import React, { Component } from 'react'
import { Redirect } from 'react-router';
import { Calendar } from '../../components/Utils/Calendar';
import { Loader } from '../../components/Utils/Loader';

export default class Trip extends Component {
    
    constructor(props) {
        super(props);

        const params = this.props.location.pathname.split("/");
        let tripID = null;
        
        if (params.length > 2) {
            tripID = params[2];
        }

        this.state = {
            selectedTrip: tripID
        };
    }

    render() {
        if (!this.props.isAuthenticated) {
            return <Redirect to="/signin" />
        }
        else if (!this.props.trips) {
            return <Loader />;
        }
        
        const trip = this.props.trips.find(el => el._id === this.state.selectedTrip);
        if (this.props.trips.length === 0 || !trip) {
            return <Redirect to="/" />;
        }

        return (
            <div className="trip">
                <div className="trip--destinations">
                    
                </div>
                <div className="trip--sidebar">
                    <div className="trip--sidebar--calendar">
                        <div className="trip--sidebar--calendar--title">
                            On the calendar
                        </div>
                        <Calendar />
                    </div>
                </div>
            </div>
        )
    }
}
