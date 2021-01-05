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
            selectedTrip: null,
            autosaveTimeout: null
        }

        this.mapSelectionDropdown = null;
    }

    componentWillUnmount() {
        if (this.state.autosaveTimeout) {
            clearTimeout(this.state.autosaveTimeout);
        }
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

    handleDragMarker = (latlong, stopoverId) => {
        if (this.state.autosaveTimeout) {
            clearTimeout(this.state.autosaveTimeout);
        }

        let trip = {...this.state.selectedTrip};
        let index = trip.stopovers.findIndex(el => el._id === stopoverId);

        trip.stopovers[index].lat = latlong.lat;
        trip.stopovers[index].long = latlong.lng;

        this.setState({...this.state, selectedTrip: trip, autosaveTimeout: setTimeout(() => this.saveChanges(), 2000)});
    };

    handleTripChange = name => {
        if (this.state.autosaveTimeout) {
            clearTimeout(this.state.autosaveTimeout);
        }

        let trip = {...this.state.selectedTrip};
        trip.name = name;

        this.setState({...this.state, selectedTrip: trip, autosaveTimeout: setTimeout(() => this.saveChanges(), 2000)});
    };

    handleAddDestination = async () => {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };

        try {
            let res = await axios.post(`http://localhost:4000/api/trip/${this.state.selectedTrip._id}/stopover/new`, {}, config);
            this.props.setTrip({...this.state.selectedTrip, stopovers: [...this.state.selectedTrip.stopovers, res.data]});
        }
        catch (err) {
            this.props.showNotification({
                type: "toast",
                contentType: "error",
                text: "An error occured while trying to add a destination",
                time: 2.5
            });
            console.error("An error occured while trying to add a destination");
            console.log(err);
        }
    };


    saveChanges = async () => {
        this.setState({...this.state, autosaveTimeout: null});

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };
        const body = {
            name: this.state.selectedTrip.name,
            stopovers: this.state.selectedTrip.stopovers.map(el => ({_id: el._id, lat: el.lat, long: el.long}))
        };
    
        try {
            await axios.put(`http://localhost:4000/api/trip/${this.state.selectedTrip._id}`, body, config);
            this.props.setTrip(this.state.selectedTrip);
        }

        catch (err) {
            this.props.showNotification({
                type: "toast",
                contentType: "error",
                text: "An error occured while trying to save destination data",
                time: 2.5
            });
            console.error("An error occured while trying to save destination data");
            console.log(err);
        }
    };

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
            <MapChart handleDragMarker={this.handleDragMarker} trip={this.state.selectedTrip} />
            <Logo background="white" className="home--logo" />

            <div className="home--trips">
                <Dropdown selectedOption={this.state.selectedTrip?._id} selectedClassName="home--trips--dropdown--selected" className="home--trips--dropdown" onSelect={tripID => this.setState({...this.state, selectedTrip: this.props.trips.find(el => el._id == tripID)})} options={this.props.trips.map(el => ({key: el._id, text: el.name}))}>
                    Select a trip
                </Dropdown>
                <Button onClick={() => this.handleAddTrip()} className="home--trips--add" hintText="Add trip">
                    <IonIcon icon="add-outline" />
                </Button>
            </div>

            <Sidebar handleAddDestination={this.handleAddDestination} handleTripChange={this.handleTripChange} setTrip={this.props.setTrip} showNotification={this.props.showNotification} trip={this.state.selectedTrip} />
        </div>
        )
    }
}
