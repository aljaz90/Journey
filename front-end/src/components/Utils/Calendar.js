import React, { useState } from 'react';
import { IonIcon } from '../IonIcons/IonIcon';
import { addDays, addMonths, datesEqual } from '../../Utils';
import { Dropdown } from '../Forms/Dropdown';

const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export const Calendar = props => {

    const getDatesForTheMonth = selectedMonth => {
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

    const [selectedMonth, setSelectedMonth] = useState(new Date());
    const [weeks, setWeeks] = useState(getDatesForTheMonth(new Date()));
    const [_selectedDate, _setSelectedDate] = useState(props.defaultDate ? props.defaultDate : null);

    const getDropdownOptions = () => {
        let options = [];

        let month = new Date(selectedMonth.valueOf());
        for (let i = 0; i < 13; i++) {
            options.push(`${monthNames[month.getMonth()]} ${month.getFullYear()}`);
            month = addMonths(month, 1);
        }

        return options;
    };

    const nextMonth = () => {
        let nextMonth = addMonths(selectedMonth, 1);
        setSelectedMonth(nextMonth);
        setWeeks(getDatesForTheMonth(nextMonth));
    };
    
    const previousMonth = () => {
        let previousMonth = addMonths(selectedMonth, -1);
        setSelectedMonth(previousMonth);
        setWeeks(getDatesForTheMonth(previousMonth));
    };

    const setSelectedDate = date => {
        if ((props.maxDate && date > props.maxDate) || (props.minDate && date < props.minDate)) {
            return;
        }

        _setSelectedDate(date);
        
        if (props.onSelect) {
            props.onSelect(date);
        }
    };

    const selectMonth = opt => {
        let [month, year] = opt.split(" ");
        month = monthNames.indexOf(month);

        let newSelectedMonth = new Date(year, month);
        setSelectedMonth(newSelectedMonth);
        setWeeks(getDatesForTheMonth(newSelectedMonth));

    };

    const selectedDate = props.selectedDate !== undefined ? props.selectedDate : _selectedDate;
    let range = props.range ? props.range : null;

    return (
        <div className="calendar-static">
            <div className="calendar--calendar--header">
                <IonIcon onClick={() => previousMonth()} className="calendar--calendar--header--previous" icon="caret-back-outline" />
                <Dropdown 
                    wrapperClassName="calendar--calendar--header--dropdown--wrapper" 
                    className="calendar--calendar--header--dropdown" 
                    selectedOption={`${monthNames[selectedMonth.getMonth()]} ${selectedMonth.getFullYear()}`} 
                    options={getDropdownOptions()}
                    onSelect={opt => selectMonth(opt)}
                />
                <IonIcon onClick={() => nextMonth()} className="calendar--calendar--header--next" icon="caret-forward-outline" />
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
                                    week.map((el, j) => {
                                        let className = `calendar--calendar--dates--item ${el.getMonth() !== selectedMonth.getMonth() ? "calendar--calendar--dates--item-not_important" : ""} ${selectedDate && datesEqual(selectedDate, el) ? "calendar--calendar--dates--item-selected" : ""} ${(props.maxDate && el > props.maxDate) || (props.minDate && el < props.minDate) ? "calendar--calendar--dates--item-disabled" : ""}`;

                                        if (range) {
                                            className += " calendar--calendar--dates--item-range-normal";
                                            if (datesEqual(el, range[0])) {
                                                className += " calendar--calendar--dates--item-range-start";
                                            }
                                            else if (datesEqual(el, range[1])) {
                                                className += " calendar--calendar--dates--item-range-end";
                                            }
                                            else if (el > range[0] && el < range[1]) {
                                                className += " calendar--calendar--dates--item-range-middle";
                                            }
                                        }

                                        return (
                                            <td onClick={() => setSelectedDate(el)} key={j} className={className}>
                                                <span className="calendar--calendar--dates--item--text">{el.getDate()}</span>
                                            </td>
                                        );
                                    })
                                }
                            </tr>
                        )
                    }
                </tbody>
            </table>
        </div>
    );
};
