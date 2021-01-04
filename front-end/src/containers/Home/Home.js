import React, { Component } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import { Logo } from '../../components/Layout/Logo';
import { Dropdown } from '../../components/Forms/Dropdown';
import { Button } from '../../components/Forms/Button';
import { MapChart } from '../../components/Map/MapChart';
import { isEmpty } from '../../Utils';
import { Loader } from '../../components/Utils/Loader';
import { IonIcon } from '../../components/IonIcons/IonIcon';
import { Sidebar } from './Sidebar';
import { AccountDropdown } from './AccountDropdown';

export default class Home extends Component {

    constructor(props) {
        super(props);

        this.state = {
            selectedTrip: null
        }

        this.mapSelectionDropdown = null;
    }

    handleAddTrip = async () => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };

            let res = await axios.post("http://localhost:4000/api/trip/new", {}, config);

            this.props.showNotification({
                type: "toast",
                contentType: "success",
                text: "Trip successfully created",
                time: 1.5
            });

            this.props.setTrips([...this.props.trips, res.data], () => {
                this.setState({...this.state, selectedTrip: res.data});
            });

        } 
        catch (err) {
            this.props.showNotification({
                type: "toast",
                contentType: "error",
                text: "An error occured while trying to create a trip",
                time: 2.5
            });
            console.error("An error occured while trying to create a new trip");
            console.log(err);
        }
    }

    render() {
        if (!this.props.isAuthenticated) {
            return <Redirect to="/signin" />;
        }
        else if (isEmpty(this.props.user)) {
            return <Loader />;
        }

        return (
        <div className="home">
            <AccountDropdown saveUserData={this.props.saveUserData} user={this.props.user} />            
            <MapChart />
            <Logo background="white" className="home--logo" />

            <div className="home--trips">
                <Dropdown selectedOption={this.state.selectedTrip?._id} selectedClassName="home--trips--dropdown--selected" className="home--trips--dropdown" onSelect={tripID => this.setState({...this.state, selectedTrip: this.props.trips.find(el => el._id === tripID)})} options={this.props.trips.map(el => ({key: el._id, text: el.name}))}>
                    Select a trip
                </Dropdown>
                <Button onClick={() => this.handleAddTrip()} className="home--trips--add" hintText="Add trip">
                    <IonIcon icon="add-outline" />
                </Button>
            </div>

            <Sidebar trip={this.state.selectedTrip} />
        </div>
        )
    }
}
