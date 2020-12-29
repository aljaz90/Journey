import React from 'react';

export const Logo = props => {
    return (
        <div className={`logo ${props.background === "white" ? "logo-white_background" : ""} ${props.className}`}>            
            <div className="logo--title">
                Journey
            </div>
            <div className="logo--subtitle">
                りょこう
            </div>
        </div>
    )
}
