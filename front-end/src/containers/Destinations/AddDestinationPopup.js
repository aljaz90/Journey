import React from 'react';
import EzAnimate from '../../components/Animations/EzAnimate';
import { Button } from '../../components/Forms/Button';
import { Form } from '../../components/Forms/Form';
import { IonIcon } from '../../components/IonIcons/IonIcon';
import OutsideClick from '../../components/Utils/OutsideClick';

export const AddDestinationPopup = props => {

    let days = [];
    for (let i = 0; i < 10; i++) {
        days.push({ key: `${i+1}`, text: `${i+1} ${i === 0 ? "day" : "days"}`});
    }

    return (
        <OutsideClick onOutsideClick={props.onClose}>
            <EzAnimate transitionName="animation--fadeInOut">
                {
                    props.showing &&
                        <div className="destinations--add">
                                <div className="destinations--add--header">
                                    <div className="destinations--add--header--title">
                                        <IonIcon className="destinations--add--header--title--icon" icon="pin-outline" /> Add a destination.
                                    </div>
                                    <Button onClick={props.onClose} hintText="Close" hintPosition="right" className="destinations--add--header--close" wrapperClassName="destinations--add--header--close--wrapper">
                                        <IonIcon icon="close-outline" />
                                    </Button>
                                </div>
                                <div className="destinations--add--form">
                                    <Form
                                        onSubmit={props.onSubmit}
                                        rows={[
                                            [{ text: "Name", key: "name", type: "text" }],
                                            [{ text: "Recommended stop duration", key: "recommendedDays", type: "dropdown", options: [...days, { text: "10+ days", key: "10+" }] }],
                                            [{ text: "Must see rating", key: "rating", type: "dropdown", options: [1,2,3,4,5,6,7,8,9,10] }],
                                            [{ text: "Description", key: "description", type: "textarea" }],
                                            [{ text: "Tags", key: "tags", type: "checkbox[]", options: ["Nature", "Culture", "Shopping", "Historic site", "Beaches", "Relaxing", "Wildlife", "Museums"] }],
                                        ]}
                                        submitText="Add"                                    
                                    />
                                </div>
                        </div>
                }
            </EzAnimate>
        </OutsideClick>
    )
}
