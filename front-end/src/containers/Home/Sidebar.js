import React, { useState } from 'react';
import EzAnime from '../../components/Animations/EzAnime';
import axios from 'axios';
import OutsideClick from '../../components/Utils/OutsideClick';
import { Button } from '../../components/Forms/Button';
import { IonIcon } from '../../components/IonIcons/IonIcon';

export const Sidebar = props => {
    const [open, _setOpen] = useState(false);
    const [showingEditButton, setShowEditButton] = useState(false);
    const [showingEditInput, _setShowEditInput] = useState(false);
    const [tripName, setTripName] = useState(null);

    const setOpen = value => {
        if (open === value) {
            return;
        }

        _setOpen(value);

        if (value) {
            setTimeout(() => setShowEditButton(true), 600);
        }
        else {
            setShowEditButton(false);
        }
    };

    const setShowEditInput = value => {
        if (value === showingEditInput) {
            return;
        }

        _setShowEditInput(value);

        if (value) {
            setTripName(props.trip.name);
        }
    };

    const changeName = async () => {
        setShowEditInput(false);
        if (tripName === props.trip.name) {
            return;
        }

        props.handleTripChange(tripName);
    };
    
    return (
        <React.Fragment>
            <EzAnime transitionName="animation--sidebar">
                {
                    open ?
                        <div className="home--sidebar" id="sidebar">
                            <Button onClick={() => setOpen(false)} hintText="Close sidebar" hintPosition="right" wrapperClassName="home--sidebar--close--wrapper" className="home--sidebar--close">
                                <IonIcon icon="chevron-back-outline" />
                            </Button>
                            <div className="home--sidebar--header">
                                <Button onClick={() => setOpen(false)} hintText="Close sidebar" hintPosition="right" wrapperClassName="home--sidebar--close--wrapper" className="home--sidebar--close">
                                    <IonIcon icon="chevron-back-outline" />
                                </Button>                                
                            </div>
                            <div className="home--sidebar--destinations">
                                <div className="home--sidebar--destinations--header">
                                    Destinations
                                </div>
                                <Button onClick={() => props.handleAddDestination()} hintText="Add destination" hintPosition="right" wrapperClassName="home--sidebar--destinations--add--wrapper" className="home--sidebar--destinations--add">
                                    <IonIcon icon="add-outline" />
                                </Button>
                            </div>
                        </div>
                    :
                        <Button style={{display: !props.trip ? "none" : null}} onClick={() => setOpen(true)} id="sidebar-open" hintText="Open sidebar" hintPosition="right" wrapperClassName="home--sidebar--open--wrapper" className="home--sidebar--open">
                            <IonIcon icon="chevron-forward-outline" />
                        </Button>
                }
            </EzAnime>
            {
                showingEditButton && props.trip &&
                    <Button onClick={() => showingEditInput ? changeName() : setShowEditInput(true)} hintText="Change name" hintPosition="right" className="home--sidebar--header--edit" wrapperClassName="home--sidebar--header--edit--wrapper">
                        <IonIcon className="home--sidebar--header--edit--icon" icon="create-outline" />
                    </Button>
            }
            {
                showingEditInput &&
                    <OutsideClick exceptions={["home--sidebar--header--edit", "home--sidebar--header--edit--icon"]} onOutsideClick={() => changeName()}>
                        <input autoFocus placeholder="Trip name" value={tripName} onChange={e => setTripName(e.target.value)} className="home--sidebar--header--edit_input" />
                    </OutsideClick>
            }
        </React.Fragment>
    );
};
