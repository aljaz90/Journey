import React from 'react'
import { IonIcon } from '../../components/IonIcons/IonIcon'
import { Info } from '../../components/Utils/Info'

export const CountryInfo = props => {
    return (
        <Info className="trip--destinations--item--details--country" containerClassName="trip--destinations--item--details--country--container" position="bottom_left">
            {
                props.country.imageUrl &&
                    <img src={props.country.imageUrl} className="trip--destinations--item--details--country--image" alt="country image" />
            }
            <div className="trip--destinations--item--details--country--header">
                <div className="trip--destinations--item--details--country--header--item">
                    <div className="trip--destinations--item--details--country--header--item--label">
                        <IonIcon className="trip--destinations--item--details--country--header--item--label--icon" icon="flag-outline" /> Country
                    </div>
                    <div className="trip--destinations--item--details--country--header--item--value">
                        {props.country.name}
                    </div>
                </div>
                <div className="trip--destinations--item--details--country--header--item">
                    <div className="trip--destinations--item--details--country--header--item--label">
                        <IonIcon className="trip--destinations--item--details--country--header--item--label--icon" icon="cash-outline" /> Currency
                    </div>
                    <div className="trip--destinations--item--details--country--header--item--value">
                        {props.country.currency}
                    </div>
                </div>
                <div className="trip--destinations--item--details--country--header--item">
                    <div className="trip--destinations--item--details--country--header--item--label">
                        Safety rating
                    </div>
                    <div className="trip--destinations--item--details--country--header--item--value">
                        {
                            props.country.safetyRating === 0 ?
                                "Unknown"
                            :
                                `${props.country.safetyRating} / 10`
                        }
                    </div>
                </div>
            </div>
            <div className="trip--destinations--item--details--country--description">
                {props.country.description}
            </div>
        </Info>
    )
}
