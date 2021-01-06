import React, { useState } from 'react';
import EzAnime from '../../components/Animations/EzAnime';
import OutsideClick from '../../components/Utils/OutsideClick';
import { Button } from '../../components/Forms/Button';
import { IonIcon } from '../../components/IonIcons/IonIcon';
import { Dropdown } from '../../components/Forms/Dropdown';

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
                                <div className="home--sidebar--destinations--list">
                                    {
                                        props.trip?.stopovers.map(el => 
                                            <div key={el._id} className="home--sidebar--destinations--item">
                                                <div className="home--sidebar--destinations--item--details">
                                                    <input value={el.name} placeholder="Destination" className="home--sidebar--destinations--item--details--name" />
                                                    <div className="home--sidebar--destinations--item--coordinates">
                                                        <div className="home--sidebar--destinations--item--coordinates--label home--sidebar--destinations--item--coordinates--label-lat">
                                                            Lat.
                                                        </div>
                                                        <div className="home--sidebar--destinations--item--coordinates--label home--sidebar--destinations--item--coordinates--label-long">
                                                            Long.
                                                        </div>
                                                        <input value={el.lat.toFixed(2)} placeholder="Latitude" className="home--sidebar--destinations--item--coordinates--item" />
                                                        <input value={el.long.toFixed(2)} placeholder="Longitude" className="home--sidebar--destinations--item--coordinates--item" />
                                                    </div>
                                                </div>
                                                <div className="home--sidebar--destinations--item--details--days">
                                                    <Dropdown selectedOption={el.days} wrapperClassName="home--sidebar--destinations--item--details--days--dropdown--wrapper" className="home--sidebar--destinations--item--details--days--dropdown" options={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]} />
                                                    <div className="home--sidebar--destinations--item--details--days--label">Days</div>
                                                </div>
                                            </div>
                                        )
                                    }
                                    <span style={{minHeight: "5rem"}}></span>
                                </div>
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
