import React, { Component } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import { Logo } from '../../components/Layout/Logo';
import { Dropdown } from '../../components/Forms/Dropdown';
import { MapChart } from '../../components/Map/MapChart';
import { daysBetween, isEmpty } from '../../Utils';
import { Loader } from '../../components/Utils/Loader';
import { IonIcon } from '../../components/IonIcons/IonIcon';
import { Sidebar } from './Sidebar';
import { AccountDropdown } from './AccountDropdown';
import { TripGeneration } from './TripGeneration';
import { Button } from '../../components/Forms/Button';

export default class Home extends Component {

    constructor(props) {
        super(props);

        this.state = {
            selectedTrip: null,
            autosaveTimeout: null,
            updatedStopovers: [],
            showingGeneration: false,
            selectingDestinationPosition: false
        }

        this.mapSelectionDropdown = null;
    }

    componentWillUnmount() {
        if (this.state.autosaveTimeout) {
            clearTimeout(this.state.autosaveTimeout);
        }
    }

    addCustomTrip = async (data={}, callback=null) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };

            let res = await axios.post("http://localhost:4000/api/trip/new", data, config);

            if (isEmpty(data)) {
                this.props.showNotification({
                    type: "toast",
                    contentType: "success",
                    text: "Trip successfully created",
                    time: 1.5
                });
            }

            this.props.setTrips([...this.props.trips, res.data], () => {
                this.setState({...this.state, selectedTrip: res.data}, () => callback ? callback() : null);
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

    handleAddDestination = async (latlng, data={}) => {
        if (isEmpty(data) && !this.state.selectingDestinationPosition) {
            return;
        }

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };
        let body = {
            lat: latlng?.lat,
            long: latlng?.lng,
            ...data
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

            this.setState({...this.state, selectedTrip: selectedTrip, selectingDestinationPosition: false});
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

    calculateDistance = (latlong1, latlong2) => {
        return Math.sqrt(Math.pow(latlong1.lat - latlong2.lat, 2) + Math.pow(latlong1.long - latlong2.long, 2));
    }

    handleGenerateTrip = async data => {
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

        // Preparations
        let days = daysBetween(data.from, data.to) + 1;
        let destinations = this.props.destinations.filter(el => el.country === data.country).filter(el => {
            for (let activity of data.activities) {
                if (el.tags.includes(activity)) {
                    return true;
                }
            }
            return false;
        });

        destinations.sort((a, b) => {
            if (a.rating === b.rating) {
                return Math.random() - 0.5;
            }
            return b.rating - a.rating;
        });

        //Generation
        let trip = {
            name: data.name,
            from: data.from,
        };

        let stopovers = [];

        for (let destination of destinations) {
            let recommendedDays = parseInt(destination.recommendedDays);
            if (data.pace === "Slow") {
                recommendedDays = (recommendedDays*1.5).toFixed(0);
            }
            else if (data.pace === "Fast") {
                recommendedDays = (recommendedDays*0.75).toFixed(0);
            }

            if (days < recommendedDays) {
                stopovers.push({ destination: destination._id, name: destination.name, lat: destination.lat, long: destination.long, days: days });
            }
            else {
                stopovers.push({ destination: destination._id, name: destination.name, lat: destination.lat, long: destination.long, days: recommendedDays });
            }

            days -= recommendedDays;
            if (days <= 0) {
                days = 0;
                break;
            }
        }

        if (days > 0) {
            let i = 0;
            while (days > 0) {
                stopovers[i].days++;
                days--;
                i++;
                if (i === stopovers.length) {
                    i = 0;
                }
            }
        }

        //Finiding the optimal path
        if (stopovers.length > 1) {
            let distances = [];
    
            for (let stop of stopovers) {
                let stopDistances = [];
                for (let stop2 of stopovers) {
                    if (stop === stop2) {
                        continue;
                    }
                    stopDistances.push({ to: stop2.destination, distance: this.calculateDistance({ lat: stop.lat, long: stop.long }, { lat: stop2.lat, long: stop2.long }) });
                }
                stopDistances.sort((a, b) => b.distance - a.distance);
                distances.push({ ...stopDistances[0], from: stop.destination });
            }

            distances.sort((a, b) => b.distance - a.distance);

            let from = stopovers.find(el => el.destination === distances[0].from);
            let to = stopovers.find(el => el.destination === distances[0].to);

            stopovers = stopovers.filter(el => el.destination !== from.destination && el.destination !== to.destination);

            let newPath = [from];
            let length = stopovers.length;

            for (let i = 0; i < length; i++) {
                let nearestDistance = null;
                let nearestStop = null;

                for (let stop of stopovers) {
                    let distance = this.calculateDistance({ lat: newPath[newPath.length-1].lat, long: newPath[newPath.length-1].long }, { lat: stop.lat, long: stop.long })
                    if (!nearestStop || nearestDistance > distance) {
                        nearestStop = stop;
                        nearestDistance = distance;
                    }
                }

                newPath.push(nearestStop);
                stopovers = stopovers.filter(el => el.destination !== nearestStop.destination);
            }

            stopovers = [...newPath, to];
        }

        //Saving
        await this.addCustomTrip(trip);

        for (let stopover of stopovers) {
            await this.handleAddDestination(null, stopover);
        }

        this.props.showNotification({
            type: "toast",
            contentType: "success",
            text: "Trip successfully generated",
            time: 1.5
        });
        this.setState({ ...this.state, showingGeneration: false });

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
                <div className="home--nav">
                    <Button onClick={() => this.props.history.push("/destinations")} className="home--nav--button">
                        Destinations
                    </Button>
                    <AccountDropdown saveUserData={this.props.saveUserData} user={this.props.user} />
                </div>
                <TripGeneration showing={this.state.showingGeneration} countries={this.props.countries} onSubmit={this.handleGenerateTrip} onClose={() => this.setState({...this.state, showingGeneration: false })} />          
                <MapChart selectingDestinationPosition={this.state.selectingDestinationPosition} onMarkerPositionSelected={this.handleAddDestination} handleDragMarker={this.handleDragMarker} trip={this.state.selectedTrip} />
                <Logo background="white" className="home--logo" />

                <div className="home--trips">
                    <Dropdown selectedOption={this.state.selectedTrip ? this.state.selectedTrip._id : null} selectedClassName="home--trips--dropdown--selected" className="home--trips--dropdown" onSelect={tripID => this.setState({...this.state, selectedTrip: this.props.trips.find(el => el._id === tripID)})} options={this.props.trips.map(el => ({key: el._id, text: el.name}))}>
                        Select a trip
                    </Dropdown>
                    <Dropdown noOpenIcon={true} staticButton={true} onSelect={opt => this.handleAddTrip(opt)} options={[{ text: "Custom", key: "custom", icon: "pin-outline" }, { text: "Generated", key: "generated", icon: "hardware-chip-outline" }]} className="home--trips--add" hintText="Add trip">
                        <IonIcon icon="add-outline" />
                    </Dropdown>
                </div>

                <Sidebar history={this.props.history} handleAddDestination={() => this.setState({ ...this.state, selectingDestinationPosition: true })} handleDeleteDestination={this.handleDeleteDestination} handleTripChange={this.handleTripChange} handleDeleteTrip={this.handleDeleteTrip} trip={this.state.selectedTrip} />
            </div>
        );
    }
}
