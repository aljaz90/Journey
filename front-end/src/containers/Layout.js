import React, { useState } from 'react';
import axios from 'axios';
import { Link, NavLink } from 'react-router-dom';
import { signOut, getInitialsForName } from '../Utils';
import { ImageSelector } from '../components/Forms/ImageSelector';
import { IonIcon } from '../components/IonIcons/IonIcon';
import { Logo } from '../components/Layout/Logo';
import { Button } from '../components/Forms/Button';

export const Layout = props => {
    const [showingImageSelection, setShowingImageSelection] = useState(false);

    const changeImage = async imageUrl => {
        setShowingImageSelection(false);
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
            props.showNotification({
                type: "toast",
                contentType: "success",
                text: "Profile picture updated successfully",
                time: 1.5
            });
            props.setUser({...props.user, imageUrl: imageUrl});
        } 
        catch (err) {
            console.error("An error occured while trying to change the profile picture");
            console.log(err);
            props.showNotification({
                type: "toast",
                contentType: "error",
                text: "An error occured while trying to change the profile picture",
                time: 1.5
            });
        }
    };

    return (
        <React.Fragment>
            <ImageSelector showNotification={props.showNotification} user={props.user} setUser={props.setUser} showing={showingImageSelection} onSelect={changeImage} onClose={() => setShowingImageSelection(false)} />
            <div className="nav">
                <Logo background="white" className="nav--logo" />
                <div className="nav--nav">
                    { !props.isAuthenticated ?
                    <React.Fragment>
                        <NavLink activeClassName="nav--nav--item-active" className="nav--nav--item" to="/signin">
                            Sign in
                        </NavLink>
                        <NavLink activeClassName="nav--nav--item-active" className="nav--nav--item" to="/signup">
                            Sign up
                        </NavLink>
                    </React.Fragment>
                    :
                    <div className="nav--nav--account">
                        <div style={{backgroundImage: `url(${props.user.imageUrl ? props.user.imageUrl.replaceAll(" ", "%20") : null})`}} className="nav--nav--account--icon">
                            {props.user.imageUrl ? "" : getInitialsForName(props.user.name)}
                        </div>
                        <div className="nav--nav--account--dropdown">
                            <div className="nav--nav--account--dropdown--item-header">
                                <div onClick={() => setShowingImageSelection(true)} className="nav--nav--account--dropdown--image_container">
                                    <IonIcon className={`nav--nav--account--dropdown--image-edit ${!props.user.imageUrl ? "nav--nav--account--dropdown--image-edit-dark" : ""}`} icon="create-outline" />
                                    <div style={{backgroundImage: `url(${props.user.imageUrl ? props.user.imageUrl.replaceAll(" ", "%20") : null})`}} className={`nav--nav--account--icon nav--nav--account--dropdown--item-icon ${props.user.imageUrl ? "nav--nav--account--dropdown--image" : null}`}>
                                        {props.user.imageUrl ? "" : getInitialsForName(props.user.name)}
                                    </div>
                                </div>
                                <div className="nav--nav--account--dropdown--item-text">
                                    {props.user.name}
                                </div>  
                                <div className="nav--nav--account--dropdown--item-email">
                                    {props.user.email}
                                </div>  
                            </div>
                            <Link to="/account?tab=account" className="nav--nav--account--dropdown--item">
                                Edit account
                            </Link>
                            <div onClick={() => { window.location.replace("/signin"); signOut(props.saveUserData); }} className="nav--nav--account--dropdown--item">
                                Sign out
                            </div>  
                        </div>  
                    </div>
                    }
                </div>
            </div>
            <Button hintText="Open map" hintPosition="right" wrapperClassName="nav--map-position" className="nav--map">
                <IonIcon icon="map-outline" className="nav--map--icon" />
            </Button>
        </React.Fragment>
    )
}
