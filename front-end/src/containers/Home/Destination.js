import React from 'react';
import { Button } from '../../components/Forms/Button';
import { Dropdown } from '../../components/Forms/Dropdown';
import { IonIcon } from '../../components/IonIcons/IonIcon';

export const Destination = props => {

    let icon = "flag-outline";
    if (props.firstDestination) {

    }
    else if (props.lastDestination) {

    }



    return (
        <div className={`home--sidebar--destinations--item ${props.firstDestination && "home--sidebar--destinations--item-first"} ${props.lastDestination && "home--sidebar--destinations--item-last"}`}>
            <Button hintText="Delete stop" hintPosition="left" className="home--sidebar--destinations--item--delete" wrapperClassName="home--sidebar--destinations--item--delete--wrapper" onClick={() => props.handleDeleteDestination(props.destination._id)}>
                <IonIcon icon="close-outline" />
            </Button>
            <div className="home--sidebar--destinations--item--icon">
                <IonIcon icon={icon} />
            </div>
            <div className="home--sidebar--destinations--item--details">
                <input onChange={e => props.handleTripChange("stopover", { _id: props.destination._id, key: "name", value: e.target.value })} value={props.destination.name} placeholder="Stop name" className="home--sidebar--destinations--item--details--name" />
                <div className="home--sidebar--destinations--item--details--coordinates">
                    <div className="home--sidebar--destinations--item--details--coordinates--label home--sidebar--destinations--item--details--coordinates--label-lat">
                        Lat.
                    </div>
                    <div className="home--sidebar--destinations--item--details--coordinates--label home--sidebar--destinations--item--details--coordinates--label-long">
                        Long.
                    </div>
                    <input onChange={e => props.handleTripChange("stopover", { _id: props.destination._id, key: "lat", value: e.target.value })} value={props.destination.lat.toFixed(2)} placeholder="Latitude" className="home--sidebar--destinations--item--details--coordinates--item" />
                    <input onChange={e => props.handleTripChange("stopover", { _id: props.destination._id, key: "long", value: e.target.value })} value={props.destination.long.toFixed(2)} placeholder="Longitude" className="home--sidebar--destinations--item--details--coordinates--item" />
                </div>
            </div>
            <div className="home--sidebar--destinations--item--days">
                <Dropdown onSelect={opt => props.handleTripChange("stopover", { _id: props.destination._id, key: "days", value: opt })} selectedOption={props.destination.days} wrapperClassName="home--sidebar--destinations--item--days--dropdown--wrapper" className="home--sidebar--destinations--item--days--dropdown" options={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]} />
                <div className="home--sidebar--destinations--item--days--label">Days</div>
            </div>
        </div>
    );
};