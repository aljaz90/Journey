import React, { Component } from 'react';
import EzAnime from '../components/Animations/EzAnime';
import { Redirect } from 'react-router-dom';
import { Logo } from '../components/Layout/Logo';
import { Dropdown } from '../components/Forms/Dropdown';
import { Button } from '../components/Forms/Button';
import { MapChart } from '../components/Map/MapChart';
import { getInitialsForName, isEmpty, signOut } from '../Utils';
import { Loader } from '../components/Utils/Loader';
import { IonIcon } from '../components/IonIcons/IonIcon';

export default class Home extends Component {

    constructor(props) {
        super(props);

        this.state = {
            sidebarOpen: false
        };
    }

    handleUserAction = action => {
        if (action === "edit") {
            window.location.replace("/account");
        }
        else if (action === "signout") {
            window.location.replace("/signin");
            signOut(this.props.saveUserData);
        }
    };


    render() {

        if (!this.props.isAuthenticated) {
            return <Redirect to="/signin" />;
        }
        else if (isEmpty(this.props.user)) {
            return <Loader />;
        }

        return (
        <div className="home">
            <div className="home--account--wrapper">
                <Dropdown onSelect={opt => this.handleUserAction(opt)} staticButton={true} options={[{key: "edit", text: "Edit account"}, {key: "signout", text: "Sign out"}]} className="home--account--button" wrapperClassName="home--account--button--wrapper">
                    <div style={{backgroundImage: `url(${this.props.user.imageUrl ? this.props.user.imageUrl.replaceAll(" ", "%20") : null})`}} className="home--account--icon">
                        {this.props.user.imageUrl ? "" : getInitialsForName(this.props.user.name)}
                    </div>
                </Dropdown>
            </div>
            <MapChart />
            <Logo background="white" className="home--logo" />
            <div className="home--trips">
                <Dropdown className="home--trips--dropdown" onSelect={opt => console.log(opt)} options={[{key: "asjkdasjldsadjlksad", text: "Unknamed trip"}]}>
                    Select a trip
                </Dropdown>
                <Button className="home--trips--add" hintText="Add trip">
                    <IonIcon icon="add-outline" />
                </Button>
            </div>
            <EzAnime transitionName="animation--sidebar">
                {
                    this.state.sidebarOpen ?
                        <div className="home--sidebar" id="sidebar">
                            <Button onClick={() => this.setState({...this.state, sidebarOpen: false})} hintText="Close sidebar" hintPosition="right" wrapperClassName="home--sidebar--close--wrapper" className="home--sidebar--close">
                                <IonIcon icon="chevron-back-outline" />
                            </Button>

                        </div>
                    :
                        <Button onClick={() => this.setState({...this.state, sidebarOpen: true})} id="sidebar-open" hintText="Open sidebar" hintPosition="right" wrapperClassName="home--sidebar--open--wrapper" className="home--sidebar--open">
                            <IonIcon icon="chevron-forward-outline" />
                        </Button>
                }
            </EzAnime>
        </div>
        )
    }
}
