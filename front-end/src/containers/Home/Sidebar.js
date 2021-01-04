import React, { useState } from 'react';
import EzAnime from '../../components/Animations/EzAnime';
import { Button } from '../../components/Forms/Button';
import { IonIcon } from '../../components/IonIcons/IonIcon';

export const Sidebar = () => {
    const [open, setOpen] = useState(false);

    return (
        <EzAnime transitionName="animation--sidebar">
            {
                open ?
                    <div className="home--sidebar" id="sidebar">
                        <Button onClick={() => setOpen(false)} hintText="Close sidebar" hintPosition="right" wrapperClassName="home--sidebar--close--wrapper" className="home--sidebar--close">
                            <IonIcon icon="chevron-back-outline" />
                        </Button>
                        <div className="home--sidebar--header">

                        </div>
                        <div className="home--sidebar--destinations">

                        </div>
                    </div>
                :
                    <Button onClick={() => setOpen(true)} id="sidebar-open" hintText="Open sidebar" hintPosition="right" wrapperClassName="home--sidebar--open--wrapper" className="home--sidebar--open">
                        <IonIcon icon="chevron-forward-outline" />
                    </Button>
            }
        </EzAnime>
    )
}
