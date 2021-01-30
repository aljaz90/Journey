import React, { useState } from 'react';
import EzAnimate from '../Animations/EzAnimate';
import { IonIcon } from '../IonIcons/IonIcon';

export const Info = props => {

    const [showing, setShowing] = useState(false);

    let position = props.position || "bottom";

    return (
        <div onMouseEnter={() => setShowing(true)} onMouseLeave={() => setShowing(false)} className={`info ${props.className}`}>
            <div className="info-div">            
                <div className={`info--button ${props.buttonClassName}`}>
                    <IonIcon icon="information-circle-outline" />
                </div>
                <EzAnimate transitionName="animation--fadeInOut">
                    {
                        showing &&
                            <div className={`info--container info--container-${position} ${props.containerClassName}`}>
                                {
                                    props.children
                                }
                            </div>
                    }
                </EzAnimate>
            </div>
        </div>
    );
};
