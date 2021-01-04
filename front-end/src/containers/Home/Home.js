import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Logo } from '../../components/Layout/Logo';
import { Dropdown } from '../../components/Forms/Dropdown';
import { Button } from '../../components/Forms/Button';
import { MapChart } from '../../components/Map/MapChart';
import { isEmpty } from '../../Utils';
import { Loader } from '../../components/Utils/Loader';
import { IonIcon } from '../../components/IonIcons/IonIcon';
import { Sidebar } from './Sidebar';
import { AccountDropdown } from './AccountDropdown';

export default class Home extends Component {

    constructor(props) {
        super(props);
    }


    render() {

        if (!this.props.isAuthenticated) {
            return <Redirect to="/signin" />;
        }
        else if (isEmpty(this.props.user)) {
            return <Loader />;
        }

        return (
        <div className="home">
            <AccountDropdown saveUserData={this.props.saveUserData} user={this.props.user} />            
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
            <Sidebar />
        </div>
        )
    }
}
