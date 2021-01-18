import React, { Component } from 'react';
import Auth from './containers/Auth';
import Home from './containers/Home/Home';
import NotificationSystem from './containers/NotificationSystem';
import { Route, Switch } from 'react-router-dom';
import { Layout } from './containers/Layout';
import { getCookie, getUser } from './Utils';
import Account from './containers/Account';
import Trip from './containers/Trip/Trip';

export default class App extends Component {

    constructor(props) {
        super(props);

        let isAuthenticated = getCookie("session") ? true : false;

        this.state = {
            isAuthenticated: isAuthenticated,
            user: {},
            trips: null,
            notification: null,
            notificationsBuffer: []
        };

        this.setters = {
            setUser: user => {
                this.setState({ ...this.state, user: { ...this.state.user, ...user } });
            },
            setTrips: (trips, callback=null) => {
                this.setState({ ...this.state, trips: trips }, callback);
            },
            setTrip: (trip, callback=null) => {
                let trips = [...this.state.trips];
                let index = trips.findIndex(el => el._id === trip._id);

                if (index !== -1) {
                    trips[index] = trip;
                }

                this.setState({ ...this.state, trips: trips });
            }
        };
    };

    componentDidMount() {
        if (getCookie("session")) {
            this.setState({...this.state, isAuthenticated: true});
            getUser(this.saveUserData);
        }
    }
    
    showNotification = (notification, removeFromBuffer = false) => {
        if (this.state.notification) {
            if (removeFromBuffer) {
                if (notification.type === "toast" && notification.time > 0) {
                    setTimeout(() => this.dismissNotification(), notification.time * 1000);
                }
                let notificationsBuffer = this.state.notificationsBuffer.slice(1);
                this.setState({ ...this.state, notification, notificationsBuffer });
            }
            else {
                this.setState({ ...this.state, notificationsBuffer: [...this.state.notificationsBuffer, notification] });
            }
        }
        else {
            if (notification.type === "toast" && notification.time > 0) {
                setTimeout(() => this.dismissNotification(), notification.time * 1000);
            }
            this.setState({ ...this.state, notification });
        }
    };

    dismissNotification = () => {
        if (this.state.notificationsBuffer.length > 0) {
            this.showNotification(this.state.notificationsBuffer[0], true);
        }
        else {
            this.setState({ ...this.state, notification: null });
        }
    };

    saveUserData = (isAuthenticated, data = {}, callback = null) => {
        let newState = { ...this.state, isAuthenticated, user: {}, trips: [] };
        if (isAuthenticated) {
            newState.user = data.user;
            newState.trips = data.user.trips;
        }
        this.setState(newState, () => { if (callback) { callback(); } });
    };


    render() {
        return (
            <div className="container">
                <NotificationSystem dismissNotification={() => this.dismissNotification()} notification={this.state.notification} />
                <Layout {...this.state} {...this.setters} showNotification={this.showNotification} saveUserData={this.saveUserData} />
                <Switch>
                    <Route exact path="/" render={props => <Home showNotification={this.showNotification} {...this.state} {...this.setters} {...props} />} />
                    <Route path="/trip" render={props => <Trip showNotification={this.showNotification} {...this.state} {...this.setters} {...props} />} />
                    <Route exact path="/account" render={props => <Account showNotification={this.showNotification} {...this.state} {...this.setters} {...props} />} />
                    <Route path="/signin" render={props => <Auth showNotification={this.showNotification} {...this.state} {...this.setters} {...props} saveUserData={this.saveUserData} />} />
                    <Route path="/signup" render={props => <Auth showNotification={this.showNotification} {...this.state} {...this.setters} {...props} saveUserData={this.saveUserData} />} />
                    <Route path="/reset" render={props => <Auth showNotification={this.showNotification} {...this.state} {...this.setters} {...props} saveUserData={this.saveUserData} />} />
                    <Route path="/reset-link" render={props => <Auth showNotification={this.showNotification} {...this.state} {...this.setters} {...props} saveUserData={this.saveUserData} />} />
                </Switch>
            </div>
        );
    }
}