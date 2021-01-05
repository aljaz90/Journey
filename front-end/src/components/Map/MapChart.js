import React, { useState, useEffect } from 'react';
import Leaflet, { LatLngBounds } from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import axios from 'axios';

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
    const center = [51.505, 0];

    return (
        <div className="map">
            <MapContainer zoomControl={false} worldCopyJump={true} center={center} maxBounds={new LatLngBounds([-85, -99999999999999999], [85, 99999999999999999])} maxBoundsViscosity={0.9} minZoom={2} zoom={3} scrollWheelZoom={true}>
                <TileLayer
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {
                    props.trip?.stopovers.map(el => 
                        <Marker key={el._id} eventHandlers={{drag: e => props.handleDragMarker(e.latlng, el._id)}} draggable={true} position={[el.lat, el.long]}>
                            <Popup>
                                {el.name}
                            </Popup>
                        </Marker>
                    )
                }
        </MapContainer>
        </div>
    );
};
