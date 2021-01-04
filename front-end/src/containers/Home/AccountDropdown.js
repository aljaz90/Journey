import React from 'react';
import { Dropdown } from '../../components/Forms/Dropdown';
import { getInitialsForName, signOut } from '../../Utils';

export const AccountDropdown = props => {

    const handleUserAction = action => {
        if (action === "edit") {
            window.location.replace("/account");
        }
        else if (action === "signout") {
            window.location.replace("/signin");
            signOut(props.saveUserData);
        }
    };

    return (
        <div className="home--account--wrapper">
            <Dropdown onSelect={opt => handleUserAction(opt)} staticButton={true} options={[{key: "edit", text: "Edit account"}, {key: "signout", text: "Sign out"}]} className="home--account--button" wrapperClassName="home--account--button--wrapper">
                <div style={{backgroundImage: `url(${props.user.imageUrl ? props.user.imageUrl.replaceAll(" ", "%20") : null})`}} className="home--account--icon">
                    {props.user.imageUrl ? "" : getInitialsForName(props.user.name)}
                </div>
            </Dropdown>
        </div>
    )
}
