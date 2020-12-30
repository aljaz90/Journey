import React, { useState } from 'react';
import { Map, Marker, Overlay } from 'pigeon-maps';
  
export const MapChart = props => {

    const [center, _setCenter] = useState([25, 0]);
    const [zoom, setZoom] = useState(3);

    const setCenter = (center) => {
        if (center[0] > 78) {
            center[0] = 78;
        }
        else if (center[0] < -78) {
            center[0] = -78;
        }

        _setCenter(center);
    };

    return (
        <div className="map">
            <Map 
                minZoom={3}
                center={center} 
                zoom={zoom}
                onBoundsChanged={({ center, zoom }) => { setCenter(center); setZoom(zoom); console.log(center) }}
                attribution={false}
            >
                <Marker anchor={[50.874, 4.6947]} payload={1} onClick={({ event, anchor, payload }) => {}} />
            </Map>    
        </div>
    );
};
