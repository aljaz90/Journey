import React from 'react';
import { IonIcon } from '../../components/IonIcons/IonIcon';
import { CountryInfo } from './CountryInfo';

export const StopoverInfo = props => {
    return (
        <div className="trip--destinations--item">
            <div className="trip--destinations--item--name">
                {props.i+1}. {props.el.name}
            </div>
            <div className="trip--destinations--item--coordinates">
                <div className="trip--destinations--item--coordinates--lat">
                    <div className="trip--destinations--item--coordinates--title">
                        Coordinates
                    </div>
                    <div className="trip--destinations--item--coordinates--long--title">
                        Lat.
                    </div>
                    {props.el.lat.toFixed(2)}
                </div>
                <div className="trip--destinations--item--coordinates--long">
                    <div className="trip--destinations--item--coordinates--long--title">
                        Long.
                    </div>
                    {props.el.long.toFixed(2)}                                        
                </div>
            </div>
            <div></div>
            <div className="trip--destinations--item--details">
                {   props.country &&
                        <div className="trip--destinations--item--details--item">
                            <IonIcon className="trip--destinations--item--details--item--icon" icon="flag-outline" /> {props.country} <CountryInfo country={props.countryData} />
                        </div>
                }
                <div className="trip--destinations--item--details--item">
                    <IonIcon className="trip--destinations--item--details--item--icon" icon="today-outline" /> You will spend <span className="trip--destinations--item--details--item-important">{props.el.days || 1}</span> {(props.el.days || 1) === 1 ? "day" : "days"} here
                </div>
                {
                    props.el.days > 1 &&
                        <div className="trip--destinations--item--details--item">
                            <IonIcon className="trip--destinations--item--details--item--icon" icon="bed-outline" /> You will need a place to stay for <span className="trip--destinations--item--details--item-important">{props.el.days - 1}</span> {(props.el.days - 1) === 1 ? "night" : "nights"}
                        </div>
                }
            </div>
        </div>
    );
}
