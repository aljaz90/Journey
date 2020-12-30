import React from 'react';
import { Map, Marker, Overlay } from 'pigeon-maps';
  
  
export const MapChart = props => {

    return (
        <div className="map">
            <Map 
                defaultCenter={[25, 0]} 
                defaultZoom={2.9}
                attribution={false}
            >
                <Marker anchor={[50.874, 4.6947]} payload={1} onClick={({ event, anchor, payload }) => {}} />
            </Map>    
        </div>
    );
};
