import React, { useState } from 'react';
import EzAnimate from '../Animations/EzAnimate';
import { IonIcon } from '../IonIcons/IonIcon';
import { formatDate } from '../../Utils';

export const Calendar = props => {
    const [showing, setShowing] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());

    return (
        <div className="calendar">
            <span className="calendar--wrapper">
                <div onClick={() => setShowing(s => !s)} className="calendar--button">
                    { (selectedDate !== null && formatDate(selectedDate)) || props.children || "Select a date" } <IonIcon className="calendar--button--icon" icon="calendar-outline" />
                </div>
                <EzAnimate>
                    { 
                        showing &&
                            <div className="calendar--calendar">
                                
                            </div>
                    }
                </EzAnimate>
            </span>
        </div>
    );
};
