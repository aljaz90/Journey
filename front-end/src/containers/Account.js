import React, { Component } from 'react';
import axios from 'axios';
import { Button } from '../components/Forms/Button';
import { ImageSelector } from '../components/Forms/ImageSelector';
import { Switch } from '../components/Forms/Switch';
import { getInitialsForName, isEmpty } from '../Utils';
import { Form } from '../components/Forms/Form';
import { Loader } from '../components/Notifications/Loader';
import { IonIcon } from '../components/IonIcons/IonIcon';

export default class Account extends Component {

    constructor(props) {
        super(props);

        let activeTab = new URLSearchParams(props.location.search).get("tab");
        this.state = {
            activeTab: activeTab ? activeTab : "account",
            showingImageSelection: false
        }
    }

    updateUser = async userDetails => {
        if (userDetails.name !== this.props.user.name || userDetails.city !== this.props.user.city || userDetails.email !== this.props.user.email || userDetails.country !== this.props.user.country) {
            const requestBody = {
                name: userDetails.name,
                city: userDetails.city,
                country: userDetails.country,
                email: userDetails.email,
            };
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                }
            };
            try {
                await axios.put("http://localhost:4000/api/user", requestBody, config);
                this.props.showNotification({
                    type: "toast",
                    contentType: "success",
                    text: "Profile updated successfully",
                    time: 1.5
                });
                this.props.setUser({...this.props.user, ...requestBody});
            } 
            catch (err) {
                this.props.showNotification({
                    type: "toast",
                    contentType: "error",
                    text: "An error occured while trying to update profile",
                    time: 1.5
                });
                console.error("An error occured while trying to update profile");
                console.log(err);
            }
        }
    
        if (userDetails.password && userDetails.new_password) {
            this.changePassword(this.props.user.email, userDetails.password, userDetails.new_password);
        }
    };

    changePassword = async (email, currentPassword, newPassword) => {
        const requestBody = {
            email: email,
            password: currentPassword,
            newPassword: newPassword
        };
        const config = {
            headers: {
                'Content-Type': 'application/json',
            }
        };

        try {
            await axios.post("http://localhost:4000/api/user/password-change", requestBody, config);
            this.props.showNotification({
                type: "toast",
                contentType: "success",
                text: "Password updated successfully",
                time: 1.5
            });
        } 
        catch (err) {
            if (err.response.status === 401)  {
                this.props.showNotification({
                    type: "toast",
                    contentType: "error",
                    text: "Current password is incorrect",
                    time: 3
                });
            }
            else {
                this.props.showNotification({
                    type: "toast",
                    contentType: "error",
                    text: "An error occured while trying to change password",
                    time: 2.5
                });
            }
            console.error("An error occured while trying to change password");
            console.log(err);
        }
    };

    changeImage = async imageUrl => {
        this.setState({...this.state, showingImageSelection: false});

        const requestBody = {
            imageUrl: imageUrl
        };
        const config = {
            headers: {
                'Content-Type': 'application/json',
            }
        };

        try {
            await axios.put("http://localhost:4000/api/user", requestBody, config);
            this.props.showNotification({
                type: "toast",
                contentType: "success",
                text: "Photo updated successfully",
                time: 1.5
            });
            this.props.setUser({...this.props.user, imageUrl: imageUrl});
        } 
        catch (err) {
            this.props.showNotification({
                type: "toast",
                contentType: "error",
                text: "An error occured while updating profile photo",
                time: 2.5
            });
            console.error("An error occured while trying to add table row");
            console.log(err);
        }
    };

    render() {
        let content = null;
        if (!this.props.isAuthenticated) {
            this.props.history.push(`/signin?redirectTo=account%3Ftab%3D${this.state.activeTab}`);
        }
        else if (isEmpty(this.props.user)) {
            return <Loader />;
        }

        if (this.state.activeTab === "account") {
            content = (
                <React.Fragment>
                    <div className="account--content--title">Account</div>
                    <div className="account--content--subtitle">User information</div>
                    {
                        !isEmpty(this.props.user) &&
                            <Form 
                                onSubmit={values => this.updateUser(values)}
                                rows={[
                                    [{key: "name", text: "Name", defaultValue: this.props.user.name}],
                                    [{key: "email", text: "Email", type: "email", defaultValue: this.props.user.email}],
                                    [{key: "city", text: "City", defaultValue: this.props.user.city}, {key: "country", text: "Country", defaultValue: this.props.user.country}],
                                    [{key: "password", text: "Current password", type: "password"}, {key: "new_password", text: "New password", type: "password"}],
                                ]}
                                submitText="Save"
                            />
                    }
                </React.Fragment>
            );
        }
        else if (this.state.activeTab === "photo") {
            content = (
                <React.Fragment>
                    <div className="account--content--title">Profile photo</div>
                    <div className="account--content--subtitle">Add or change the profile photo</div>
                    {
                            this.props.user.imageUrl ?  
                                <img draggable={false} src={this.props.user.imageUrl} alt="" className="account--content--photo" />
                            :
                                <div className="account--content--photo-alt">
                                    { getInitialsForName(this.props.user.name) }
                                </div>                     
                    }
                    <Button className="account--content--submit" onClick={() => this.setState({...this.state, showingImageSelection: true})}>Change photo</Button>
                </React.Fragment>
            );
        }
        else if (this.state.activeTab === "subscription") {
            content = (
                <React.Fragment>
                    <div className="account--content--title">Manage subscriptions</div>
                </React.Fragment>
            );
        }
        else if (this.state.activeTab === "goal") {
            content = (
                <React.Fragment>
                    <div className="account--content--title">Setup a goal</div>
                </React.Fragment>
            );
        }

        return (
            <React.Fragment>
                <ImageSelector showNotification={this.props.showNotification} user={this.props.user} setUser={this.props.setUser} showing={this.state.showingImageSelection} onSelect={this.changeImage} onClose={() => this.setState({...this.state, showingImageSelection: false})} />
                <div className="account">
                    <div className="account--title">
                        Account settings
                    </div>
                    <div className="account--header">
                        {
                            this.props.user.imageUrl ?  
                                <img draggable={false} src={this.props.user.imageUrl} alt="" className="account--header--image" />
                            :
                                <div className="account--header--image-alt">
                                    {getInitialsForName(this.props.user.name)}
                                </div>                     
                        }
                        <div className="account--header--details">
                            <div className="account--header--details--name">
                                {this.props.user.name}
                            </div>
                            <div className="account--header--details--location">
                                <IonIcon icon="location-outline" /> {this.props.user.city}, {this.props.user.country}
                            </div>
                        </div>
                    </div>
                    <Switch defaultOption={this.state.activeTab} className="account--nav" type="nav" onSelect={opt => this.setState({...this.state, activeTab: opt})} options={[{key: "account", text: "Account"}, {key: "photo", text: "Photo"}, {key: "subscription", text: "Subscription"}, {key: "goal", text: "Goal"}]} />
                    {content}
                </div>
            </React.Fragment>
        )
    }
}
