import React, { Component } from 'react';
import { NavLink, Redirect } from 'react-router-dom';
import { Dropdown } from '../components/Forms/Dropdown';
import { MapChart } from '../components/Map/MapChart';
import { getInitialsForName, isEmpty, signOut } from '../Utils';

export default class Home extends Component {

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

        if (isEmpty(this.props.user)) {
            return <Redirect to="/signin" />;
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
        </div>
        )
    }
}
