import React, { useState } from 'react';
import {
    ComposableMap,
    Geographies,
    Geography,
    ZoomableGroup
} from "react-simple-maps";
  
const geoUrl = "https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json";
  
export const MapChart = props => {

    const [width, setWidth] = useState(800);
    const [height, setHeight] = useState(500);

    return (
        <div className="map">
            <ComposableMap
                width={980}
                height={551}
                style={{
                    width: "100%",
                    height: "auto",
                }}
  
            >
                    <Geographies geography={geoUrl}>
                    {({ geographies }) =>
                        geographies.map(geo => (
                        <Geography key={geo.rsmKey} geography={geo} />
                        ))
                    }
                    </Geographies>
            </ComposableMap>
        </div>
    );
};
