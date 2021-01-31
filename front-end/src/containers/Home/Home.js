import React, { Component } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import { Logo } from '../../components/Layout/Logo';
import { Dropdown } from '../../components/Forms/Dropdown';
import { MapChart } from '../../components/Map/MapChart';
import { daysBetween, isEmpty, shuffleArray } from '../../Utils';
import { Loader } from '../../components/Utils/Loader';
import { IonIcon } from '../../components/IonIcons/IonIcon';
import { Sidebar } from './Sidebar';
import { AccountDropdown } from './AccountDropdown';
import { TripGeneration } from './TripGeneration';

export default class Home extends Component {

    constructor(props) {
        super(props);

        this.state = {
            selectedTrip: null,
            autosaveTimeout: null,
            center: { lat: 51.505, lng: 0 },
            updatedStopovers: [],
            showingGeneration: false
        }

        this.mapSelectionDropdown = null;
    }

    componentWillUnmount() {
        if (this.state.autosaveTimeout) {
            clearTimeout(this.state.autosaveTimeout);
        }
    }

    addCustomTrip = async () => {
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

        this.setState({...this.state, updatedStopovers: this.state.updatedStopovers.includes(stopoverId) ? this.state.updatedStopovers : [...this.state.updatedStopovers, stopoverId], selectedTrip: trip, autosaveTimeout: setTimeout(() => this.saveChanges(), 1000)});
    };

    handleTripChange = (key, value) => {
        if (this.state.autosaveTimeout) {
            clearTimeout(this.state.autosaveTimeout);
        }

        let trip = {...this.state.selectedTrip};
        let updatedStopovers = [...this.state.updatedStopovers];

        if (key === "stopover") {
            let stopoverIndex = trip.stopovers.findIndex(el => el._id === value._id);

            if (["lat", "long"].includes(value.key)) {
                if (isNaN(value.value)) {
                    return;
                }

                value.value = Number.parseFloat(value.value);
            }

            trip.stopovers[stopoverIndex][value.key] = value.value;
            if (!updatedStopovers.includes(value._id)) {
                updatedStopovers.push(value._id);
            }
        }
        else {
            trip[key] = value;
        }

        this.setState({...this.state, updatedStopovers: updatedStopovers, selectedTrip: trip, autosaveTimeout: setTimeout(() => this.saveChanges(), 2000)});
    };

    handleAddDestination = async () => {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };
        const body = {
            lat: this.state.center.lat,
            long: this.state.center.lng
        };

        try {
            let res = await axios.post(`http://localhost:4000/api/trip/${this.state.selectedTrip._id}/stopover/new`, body, config);

            let stopover = res.data.stopover;
            let segment = res.data.segment;

            let segments = [...this.state.selectedTrip.segments];

            if (segment) {
                segments.push(segment);
            }

            let selectedTrip = { ...this.state.selectedTrip, stopovers: [...this.state.selectedTrip.stopovers, stopover], segments: segments };
            let trip = { ...this.props.trips.find(el => el._id === selectedTrip._id), stopovers: [...this.state.selectedTrip.stopovers, stopover], segments: segments };

            this.setState({...this.state, selectedTrip: selectedTrip});
            this.props.setTrip(trip);
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

    getUpdatedStopovers = updatedStopovers => {
        let stopovers = [];

        for (let stopoverId of updatedStopovers) {
            let stopover = this.state.selectedTrip.stopovers.find(el => el._id === stopoverId);
            stopovers.push({_id: stopoverId, lat: stopover.lat, long: stopover.long, name: stopover.name, days: stopover.days});
        }

        return stopovers;
    };

    saveChanges = async () => {
        let stopoversSaved = [...this.state.updatedStopovers];
        this.setState({...this.state, updatedStopovers: [], autosaveTimeout: null});

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };
        const body = {
            name: this.state.selectedTrip.name,
            from: this.state.selectedTrip.from,
            stopovers: this.getUpdatedStopovers(stopoversSaved) 
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
            this.setState({...this.state, updatedStopovers: [...new Set([...this.state.updatedStopovers, ...stopoversSaved])]});
        }
    };

    handleDeleteTrip = async () => {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };

        let tripId = this.state.selectedTrip._id;
    
        try {
            await axios.delete(`http://localhost:4000/api/trip/${tripId}`, config);

            this.setState({...this.state, selectedTrip: null});
            this.props.setTrips(this.props.trips.filter(el => el._id !== tripId));
        }
        catch (err) {
            this.props.showNotification({
                type: "toast",
                contentType: "error",
                text: "An error occured while trying to delete a trip",
                time: 2.5
            });
            console.error("An error occured while trying to delete a trip");
            console.log(err);
        }
    };

    handleDeleteDestination = async destinationId => {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };
    
        try {
            let res = await axios.delete(`http://localhost:4000/api/trip/${this.state.selectedTrip._id}/stopover/${destinationId}`, config);

            let trip = this.props.trips.find(el => el._id === this.state.selectedTrip._id);

            this.props.setTrip({ ...trip, stopovers: trip.stopovers.filter(el => el._id !== destinationId), segments: res.data });
            this.setState({...this.state, selectedTrip: { ...this.state.selectedTrip, stopovers: this.state.selectedTrip.stopovers.filter(el => el._id !== destinationId), segments: res.data }});
        }
        catch (err) {
            this.props.showNotification({
                type: "toast",
                contentType: "error",
                text: "An error occured while trying to delete a destination",
                time: 2.5
            });
            console.error("An error occured while trying to delete a destination");
            console.log(err);
        }
    };

    handleAddTrip = type => {
        if (type === "custom") {
            this.addCustomTrip();
        }
        else {
            this.setState({...this.state, showingGeneration: true });
        }
    };

    handleGenerateTrip = data => {
        if (data.name === "" || data.country === "" || data.from === "" || data.to === "") {
            this.props.showNotification({
                type: "toast",
                contentType: "error",
                text: "Please fill out all fields",
                time: 1.5
            });
            return;
        }
        else if (data.activities.length === 0) {
            this.props.showNotification({
                type: "toast",
                contentType: "error",
                text: "Select at least 1 activity",
                time: 1.5
            });
            return;
        }
        else if (data.to < data.from) {
            this.props.showNotification({
                type: "toast",
                contentType: "error",
                text: "This app unfortunately doesn't support time travel",
                time: 1.5
            });
            return;
        }

        let days = daysBetween(data.from, data.to);
        let destinations = this.props.destinations.filter(el => el.country === data.country).filter(el => {
            for (let activity of data.activities) {
                if (el.tags.includes(activity)) {
                    return true;
                }
            }
            return false;
        });

        destinations = shuffleArray(destinations);
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
            <TripGeneration showing={this.state.showingGeneration} countries={this.props.countries} onSubmit={this.handleGenerateTrip} onClose={() => this.setState({...this.state, showingGeneration: false })} />          
            <MapChart onCenterChange={latlang => this.setState({...this.state, center: latlang})} handleDragMarker={this.handleDragMarker} trip={this.state.selectedTrip} />
            <Logo background="white" className="home--logo" />

            <div className="home--trips">
                <Dropdown selectedOption={this.state.selectedTrip ? this.state.selectedTrip._id : null} selectedClassName="home--trips--dropdown--selected" className="home--trips--dropdown" onSelect={tripID => this.setState({...this.state, selectedTrip: this.props.trips.find(el => el._id === tripID)})} options={this.props.trips.map(el => ({key: el._id, text: el.name}))}>
                    Select a trip
                </Dropdown>
                <Dropdown noOpenIcon={true} staticButton={true} onSelect={opt => this.handleAddTrip(opt)} options={[{ text: "Custom", key: "custom", icon: "pin-outline" }, { text: "Generated", key: "generated", icon: "hardware-chip-outline" }]} className="home--trips--add" hintText="Add trip">
                    <IonIcon icon="add-outline" />
                </Dropdown>
            </div>

            <Sidebar history={this.props.history} handleAddDestination={this.handleAddDestination} handleDeleteDestination={this.handleDeleteDestination} handleTripChange={this.handleTripChange} handleDeleteTrip={this.handleDeleteTrip} trip={this.state.selectedTrip} />
        </div>
        )
    }
}
