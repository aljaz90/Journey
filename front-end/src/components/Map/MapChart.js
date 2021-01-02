import React from 'react';
import Leaflet, { LatLngBounds } from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';
let DefaultIcon = Leaflet.icon({
            ...Leaflet.Icon.Default.prototype.options,
            iconUrl: icon,
            iconRetinaUrl: iconRetina,
            shadowUrl: iconShadow
        });
        Leaflet.Marker.prototype.options.icon = DefaultIcon;
  
export const MapChart = props => {

    const position = [51.505, -0.09];

    return (
        <div className="map">
            <MapContainer zoomControl={false} worldCopyJump={true} center={position} maxBounds={new LatLngBounds([-85, -99999999999999999], [85, 99999999999999999])} maxBoundsViscosity={0.9} minZoom={2} zoom={3} scrollWheelZoom={true}>
                <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={position}>
                    <Popup>
                        A pretty CSS3 popup. <br /> Easily customizable.
                    </Popup>
                </Marker>
        </MapContainer>
        </div>
    );
};
