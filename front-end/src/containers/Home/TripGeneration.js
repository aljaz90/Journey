import React from 'react';
import EzAnimate from '../../components/Animations/EzAnimate';
import { Button } from '../../components/Forms/Button';
import { Form } from '../../components/Forms/Form';
import { IonIcon } from '../../components/IonIcons/IonIcon';
import OutsideClick from '../../components/Utils/OutsideClick';

export const TripGeneration = props => {
    return (
        <OutsideClick onOutsideClick={props.onClose}>
            <EzAnimate transitionName="animation--fadeInOut">
                {
                    props.showing &&
                            <div className="trip_generation">
                                <div className="trip_generation--header">
                                    <div className="trip_generation--header--title">
                                        <IonIcon className="trip_generation--header--title--icon" icon="hardware-chip-outline" /> Generate a trip.
                                    </div>
                                    <Button onClick={props.onClose} hintText="Close" hintPosition="right" className="trip_generation--header--close" wrapperClassName="trip_generation--header--close--wrapper">
                                        <IonIcon icon="close-outline" />
                                    </Button>
                                </div>
                                <div className="trip_generation--form">
                                    <Form rows={[[{ text: "Country", key: "country", type: "dropdown", options: ["fgfdg", "gdfg"] }]]} />
                                </div>
                            </div>
                }
            </EzAnimate>
        </OutsideClick>
    );
};
