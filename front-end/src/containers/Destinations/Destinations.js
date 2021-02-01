import React, { Component } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router';
import { Button } from '../../components/Forms/Button';
import { IonIcon } from '../../components/IonIcons/IonIcon';
import { Logo } from '../../components/Layout/Logo';
import { MapChart } from '../../components/Map/MapChart';
import { Loader } from '../../components/Utils/Loader';
import { isEmpty } from '../../Utils';
import { AccountDropdown } from '../Home/AccountDropdown';
import { AddDestinationPopup } from './AddDestinationPopup';

export default class Destinations extends Component {

    constructor (props) {
        super(props);

        this.state = {
            showingAddDestination: false,
            selectingDestinationPosition: false,
            formData: null
        };
    }

    handleAddDestination = data => {
        if (data.name === "" || data.country === "" || data.recommendedDays === "" || data.data === "") {
            this.props.showNotification({
                type: "toast",
                contentType: "error",
                text: "Please fill out all fields",
                time: 1.5
            });
            return;
        }
        else if (data.tags.length === 0) {
            this.props.showNotification({
                type: "toast",
                contentType: "error",
                text: "Select at least 1 tag",
                time: 1.5
            });
            return;
        }

        this.setState({ ...this.state, showingAddDestination: false, selectingDestinationPosition: true, formData: data });
        this.props.showNotification({
            type: "toast",
            contentType: "info",
            text: "Select destination position by clicking on the map",
            time: 3
        });
    };
    
    handleSelectDestinationPosition = async latlng => {
        if (!this.state.selectingDestinationPosition || this.state.formData === null) {
            return;
        }
        const data = this.state.formData;
        
        const requestBody = {
            name: data.name,
            lat: latlng.lat,
            long: latlng.lng,
            description: data.description,
            recommendedDays: data.recommendedDays,
            rating: data.rating,
            country: data.country,
            tags: data.tags
        };
        const config = {
            headers: {
                'Content-Type': 'application/json',
            }
        };

        try {
            let res = await axios.post("http://localhost:4000/api/destination/new", requestBody, config);
            this.props.setDestinations([...this.props.destinations, res.data]);
            this.props.showNotification({
                type: "toast",
                contentType: "success",
                text: "Destination successfully added",
                time: 1.5
            });
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
        this.setState({ ...this.state, selectingDestinationPosition: false, formData: null });
    }

    render() {
        if (!this.props.isAuthenticated) {
            return <Redirect to="/signin" />;
        }
        else if (isEmpty(this.props.user)) {
            return <Loader />;
        }

        return (
            <div className="destinations">
                <AddDestinationPopup countries={this.props.countries} onSubmit={this.handleAddDestination} showing={this.state.showingAddDestination} onClose={() => this.setState({ ...this.state, showingAddDestination: false })} />
                <div className="destinations--nav">
                    <Button onClick={() => this.props.history.push("/")} className="destinations--nav--button">
                        Trips
                    </Button>
                    <AccountDropdown saveUserData={this.props.saveUserData} user={this.props.user} />
                </div>
                <MapChart selectingDestinationPosition={this.state.selectingDestinationPosition} onMarkerPositionSelected={this.handleSelectDestinationPosition} type="destinations" destinations={this.props.destinations} />
                <Logo background="white" className="destinations--logo" />
                {   this.props.user.role === "admin" &&
                        <Button hintText="Add destination" hintPosition="right" onClick={() => this.setState({ ...this.state, showingAddDestination: true })} className="destinations--add--button" wrapperClassName="destinations--add--button--wrapper">
                            <IonIcon icon="add-outline" /> 
                        </Button>
                }
            </div>
        );

    };
};
