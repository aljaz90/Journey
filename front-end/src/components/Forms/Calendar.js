import React, { useState } from 'react';
import EzAnimate from '../Animations/EzAnimate';
import OutsideClick from '../Utils/OutsideClick';
import { IonIcon } from '../IonIcons/IonIcon';
import { formatDate, addDays } from '../../Utils';
import { Dropdown } from './Dropdown';

const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export const Calendar = props => {

    const getDatesForTheMonth = () => {
        let dates = [];

        let firstDayOfTheMonth = new Date(selectedMonth.valueOf());
        firstDayOfTheMonth.setDate(1);
        let daysBefore = (firstDayOfTheMonth.getDay() || 7) - 1;

        let lastDayOfTheMonth;
        let daysAfter;    

        for (let i = 0; i < daysBefore; i++) {
            dates.push(addDays(firstDayOfTheMonth, i - daysBefore));
        }

        for (let i = 0; i < 31; i++) {
            let date = addDays(firstDayOfTheMonth, i);
            dates.push(date);

            if (addDays(date, 1).getMonth() !== date.getMonth()) {
                lastDayOfTheMonth = date;
                daysAfter = 7 - (lastDayOfTheMonth.getDay() || 7);
                break;
            }
        }

        for (let i = 0; i < daysAfter; i++) {
            dates.push(addDays(lastDayOfTheMonth, i + 1));
        }

        let weeks = [];

        while (dates.length > 0) {
            weeks.push(dates.splice(0, 7));
        }

        return weeks;
    };

    const [showing, setShowing] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState(new Date());
    const [weeks, setWeeks] = useState(getDatesForTheMonth());
    const [selectedDate, setSelectedDate] = useState(null);

    return (
        <OutsideClick onOutsideClick={() => setShowing(false)}>
            <div className="calendar">
                <div className="calendar--wrapper">
                    <div onClick={() => setShowing(s => !s)} className="calendar--button">
                        { (selectedDate !== null && formatDate(selectedDate)) || props.children || "Select a date" } <IonIcon className="calendar--button--icon" icon="calendar-outline" />
                    </div>
                    <EzAnimate transitionName="animation--fadeInOut">
                        { 
                            showing &&
                                <div className="calendar--calendar">
                                    <div className="calendar--calendar--header">
                                        <IonIcon className="calendar--calendar--header--previous" icon="caret-back-outline" />
                                        <Dropdown wrapperClassName="calendar--calendar--header--dropdown--wrapper" className="calendar--calendar--header--dropdown" selectedOption={`${monthNames[selectedMonth.getMonth()]} ${selectedMonth.getFullYear()}`} options={[`${monthNames[selectedMonth.getMonth()]} ${selectedMonth.getFullYear()}`]} />
                                        <IonIcon className="calendar--calendar--header--next" icon="caret-forward-outline" />
                                    </div>
                                    <table className="calendar--calendar--dates">
                                        <thead>
                                            <tr>
                                                <td className="calendar--calendar--dates--header">
                                                    Mon
                                                </td>
                                                <td className="calendar--calendar--dates--header">
                                                    Tue
                                                </td>
                                                <td className="calendar--calendar--dates--header">
                                                    Wed
                                                </td>
                                                <td className="calendar--calendar--dates--header">
                                                    Thu
                                                </td>
                                                <td className="calendar--calendar--dates--header">
                                                    Fri
                                                </td>
                                                <td className="calendar--calendar--dates--header">
                                                    Sat
                                                </td>
                                                <td className="calendar--calendar--dates--header">
                                                    Sun
                                                </td>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                weeks.map((week, i) => 
                                                    <tr key={i}>
                                                        {
                                                            week.map((el, j) => 
                                                                <td key={j} className="calendar--calendar--dates--item">
                                                                    {el.getDate()}
                                                                </td>
                                                            )
                                                        }
                                                    </tr>
                                                )
                                            }
                                        </tbody>
                                    </table>
                                </div>
                        }
                    </EzAnimate>
                </div>
            </div>
        </OutsideClick>
    );
};
