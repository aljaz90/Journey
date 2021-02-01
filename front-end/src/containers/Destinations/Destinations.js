import React, { Component } from 'react';
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
        console.log(data)
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
    
    handleSelectDestinationPosition = latlng => {
        console.log(latlng)
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
                <MapChart selectingDestinationPosition={this.state.selectingDestinationPosition} onMarkerPositionSelected={this.handleSelectDestinationPosition} type="destinations" destinations={[]} />
                <Logo background="white" className="destinations--logo" />
                {   true &&
                        <Button hintText="Add destination" hintPosition="right" onClick={() => this.setState({ ...this.state, showingAddDestination: true })} className="destinations--add--button" wrapperClassName="destinations--add--button--wrapper">
                            <IonIcon icon="add-outline" /> 
                        </Button>
                }
            </div>
        );

    };
};
