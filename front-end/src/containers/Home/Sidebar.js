import React, { useState } from 'react';
import EzAnime from '../../components/Animations/EzAnime';
import OutsideClick from '../../components/Utils/OutsideClick';
import { Button } from '../../components/Forms/Button';
import { IonIcon } from '../../components/IonIcons/IonIcon';
import { Destination } from './Destination';
import { CalendarInput, ECalendarPostition } from '../../components/Forms/CalendarInput';
import { addDays, addYears, datesEqual, formatDate } from '../../Utils';

export const Sidebar = props => {
    const [open, _setOpen] = useState(false);
    const [showingEditButton, setShowEditButton] = useState(false);
    const [showingDeleteButton, setShowDeleteButton] = useState(false);
    const [showingEditInput, _setShowEditInput] = useState(false);
    const [tripName, setTripName] = useState(null);

    const setOpen = value => {
        if (open === value) {
            return;
        }

        _setOpen(value);

        if (value) {
            setTimeout(() => { setShowEditButton(true); setShowDeleteButton(true); }, 600);
        }
        else {
            setShowEditButton(false);
            setShowDeleteButton(false);
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

    const changeName = () => {
        setShowEditInput(false);
        if (tripName === props.trip.name) {
            return;
        }

        props.handleTripChange("name", tripName);
    };
    
    const changeDate = newDate => {
        if (props.trip.from && datesEqual(new Date(props.trip.from), newDate)) {
            return;
        }

        props.handleTripChange("from", newDate);
    };

    const getDaysInATrip = () => {
        let days = 0;

        if (!props.trip || !props.trip.from) {
            return;
        }

        for (let stopover of props.trip.stopovers) {
            if (stopover.days) {
                days += stopover.days;
            }
        }

        return days;
    };

    const deleteTrip = () => {
        if (showingEditInput) {
            setShowEditInput(false);
        }

        setTripName(null);
        props.handleDeleteTrip();
    };


    let daysOfTrip = getDaysInATrip();
    let dateTo = (props.trip && props.trip.from && formatDate(addDays(new Date(props.trip.from), daysOfTrip))) || "Unknown";
    
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
                                {
                                    props.trip &&
                                        <div className="home--sidebar--header--date">                      
                                            <div className="home--sidebar--header--date--from">                     
                                                <div className="home--sidebar--header--date--from--label">
                                                    From
                                                </div>                   
                                                <CalendarInput calendarPosition={ECalendarPostition.BOTTOM_RIGHT} onSelect={date => changeDate(date)} selectedDate={props.trip?.from ? new Date(props.trip.from) : null} minDate={new Date()} maxDate={addYears(new Date(), 1)} className="home--sidebar--header--from">
                                                    From
                                                </CalendarInput>
                                            </div>                      
                                            <div className="home--sidebar--header--date--to">                     
                                                <div className="home--sidebar--header--date--to--label">
                                                    To
                                                </div>    
                                                {dateTo}               
                                            </div>                      
                                        </div>
                                }                            
                            </div>
                            {
                                props.trip &&
                                    <div className="home--sidebar--destinations">
                                        <div className="home--sidebar--destinations--header">
                                            Stops
                                        </div>
                                        <Button onClick={() => props.handleAddDestination()} hintText="Add a stop" hintPosition="right" wrapperClassName="home--sidebar--destinations--add--wrapper" className="home--sidebar--destinations--add">
                                            <IonIcon icon="add-outline" />
                                        </Button>
                                        <div className="home--sidebar--destinations--list">
                                            {
                                                props.trip?.stopovers.map((el, i) => 
                                                    <Destination firstDestination={i === 0} lastDestination={i === props.trip.stopovers.length - 1} key={el._id} destination={el} handleTripChange={props.handleTripChange} handleDeleteDestination={props.handleDeleteDestination} />
                                                )
                                            }
                                        </div>                                        
                                        <Button hintText="Trip overview" hintPosition="right" onClick={() => props.history.push(`/trip/${props.trip._id}`)} wrapperClassName="home--sidebar--review--wrapper" className="home--sidebar--review">
                                            <IonIcon className="home--sidebar--review--icon" icon="trail-sign-outline" />
                                        </Button>
                                    </div>
                            }
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
                showingDeleteButton && props.trip &&
                    <Button onClick={() => deleteTrip()} hintText="Delete trip" hintPosition="right" className="home--sidebar--header--delete" wrapperClassName="home--sidebar--header--delete--wrapper">
                        <IonIcon className="home--sidebar--header--edit--icon" icon="close-outline" />
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
