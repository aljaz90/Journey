import React, { useState, useRef } from 'react';
import { Map, Marker, Overlay } from 'pigeon-maps';
  
export const MapChart = props => {

    const wrapper = useRef();
    const [center, _setCenter] = useState([0, 0]/*[25, 0]*/);
    const fullWidth = 2304;
    const fullHeight = 1280;

    const setCenter = (center, zoom) => {
        if (!wrapper.current) {
            return;
        }

        console.log((170 / zoom) * (wrapper.current.offsetHeight / fullHeight));

        if (center[0] > 78) {
            center[0] = 78;
            _setCenter(center);
        }
        else if (center[0] < -78) {
            center[0] = -78;
            _setCenter(center);
        }

    };

    return (
        <div ref={wrapper} className="map">
            <Map 
                minZoom={1}
                defaultZoom={1.7}
                center={center} 
                onBoundsChanged={({ center, zoom }) => { setCenter(center, zoom); }}
                attribution={false}
            >
                <Marker anchor={[50.874, 4.6947]} payload={1} onClick={({ event, anchor, payload }) => {}} />
            </Map>    
        </div>
    );
};
