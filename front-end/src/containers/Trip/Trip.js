import React, { Component } from 'react'
import { Redirect } from 'react-router';
import { CountryInfo } from './CountryInfo';
import { IonIcon } from '../../components/IonIcons/IonIcon';
import { Calendar } from '../../components/Utils/Calendar';
import { Loader } from '../../components/Utils/Loader';
import { addDays } from '../../Utils';
import { iso1A2Code } from '@ideditor/country-coder';
import { getCountryNameByCode } from '../../Countries';

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

    getDaysInATrip = trip => {
        let days = 0;

        for (let stopover of trip.stopovers) {
            if (stopover.days) {
                days += stopover.days;
            }
        }

        return days;
    };


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

        let kmTraveled = 150;
        let flights = 2;
        
        let daysOfTrip = this.getDaysInATrip(trip) || 1;
        let overnightStays = daysOfTrip - 1;

        let dateFrom = trip.from ? new Date(trip.from) : new Date();
        let dateTo = addDays(dateFrom, daysOfTrip);
    
        return (
            <div className="trip">
                <div className="trip--destinations">
                    {
                        trip.stopovers.map((el, i) => {

                            let countryCode = iso1A2Code([el.long, el.lat]);
                            let country = getCountryNameByCode(countryCode);
                            let countryData = this.props.countries.find(el => el.code === countryCode);

                            return (
                                <div className="trip--destinations--item">
                                    <div className="trip--destinations--item--name">
                                        {i+1}. {el.name}
                                    </div>
                                    <div className="trip--destinations--item--coordinates">
                                        <div className="trip--destinations--item--coordinates--lat">
                                            <div className="trip--destinations--item--coordinates--title">
                                                Coordinates
                                            </div>
                                            <div className="trip--destinations--item--coordinates--long--title">
                                                Lat.
                                            </div>
                                            {el.lat.toFixed(2)}
                                        </div>
                                        <div className="trip--destinations--item--coordinates--long">
                                            <div className="trip--destinations--item--coordinates--long--title">
                                                Long.
                                            </div>
                                            {el.long.toFixed(2)}                                        
                                        </div>
                                    </div>
                                    <div></div>
                                    <div className="trip--destinations--item--details">
                                        {   country &&
                                                <div className="trip--destinations--item--details--item">
                                                    <IonIcon className="trip--destinations--item--details--item--icon" icon="flag-outline" /> {country} <CountryInfo country={countryData} />
                                                </div>
                                        }
                                        <div className="trip--destinations--item--details--item">
                                            <IonIcon className="trip--destinations--item--details--item--icon" icon="today-outline" /> You will spend <span className="trip--destinations--item--details--item-important">{el.days || 1}</span> {(el.days || 1) === 1 ? "day" : "days"} here
                                        </div>
                                        {
                                            el.days > 1 &&
                                                <div className="trip--destinations--item--details--item">
                                                    <IonIcon className="trip--destinations--item--details--item--icon" icon="bed-outline" /> You will need a place to stay for <span className="trip--destinations--item--details--item-important">{el.days - 1}</span> {(el.days - 1) === 1 ? "night" : "nights"}
                                                </div>
                                        }
                                    </div>
                                </div>
                            );
                        })
                    }
                </div>
                <div className="trip--sidebar">
                    <div className="trip--sidebar--details">
                        <div className="trip--sidebar--details--title">
                            Overview
                        </div>
                        <div className="trip--sidebar--details--name">
                            <IonIcon className="trip--sidebar--details--name--icon" icon="map-outline" /> {trip.name}
                        </div>
                        <div className="trip--sidebar--details--item">
                            <div className="trip--sidebar--details--item--label">
                                <IonIcon className="trip--sidebar--details--item--label--icon" icon="pin-outline" /> Stops
                            </div>
                            <div className="trip--sidebar--details--item--value">
                                {trip.stopovers.length}
                            </div>
                        </div>
                        <div className="trip--sidebar--details--item">
                            <div className="trip--sidebar--details--item--label">
                                <IonIcon className="trip--sidebar--details--item--label--icon" icon="bed-outline" /> Overnight stays
                            </div>
                            <div className="trip--sidebar--details--item--value">
                                {overnightStays}
                            </div>
                        </div>
                        <div className="trip--sidebar--details--item">
                            <div className="trip--sidebar--details--item--label">
                                <IonIcon className="trip--sidebar--details--item--label--icon" icon="car-sport-outline" /> Kilometers traveled
                            </div>
                            <div className="trip--sidebar--details--item--value">
                                {kmTraveled} km
                            </div>
                        </div>
                        <div className="trip--sidebar--details--item">
                            <div className="trip--sidebar--details--item--label">
                                <IonIcon className="trip--sidebar--details--item--label--icon" icon="airplane-outline" /> Flights
                            </div>
                            <div className="trip--sidebar--details--item--value">
                                {flights}
                            </div>
                        </div>
                    </div>
                    <div className="trip--sidebar--calendar">
                        <div className="trip--sidebar--calendar--title">
                            On the calendar
                        </div>
                        <Calendar range={[dateFrom, dateTo]} />
                    </div>
                </div>
            </div>
        )
    }
}