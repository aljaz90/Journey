import React, { useState } from 'react';
import Leaflet, { LatLngBounds } from 'leaflet';
import { MapContainer, TileLayer, Marker, Tooltip, Polyline, Popup } from 'react-leaflet';
import { MapEvents } from './MapEvents';

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

    const [destinationPosition, setDestinationPosition] = useState([0, 0]);    
    const center = [51.505, 0];

    if (props.type === "destinations") {
        return (
            <div className="map">
                <MapContainer zoomControl={false} worldCopyJump={true} center={center} maxBounds={new LatLngBounds([-85, -99999999999999999], [85, 99999999999999999])} maxBoundsViscosity={0.9} minZoom={2} zoom={3} scrollWheelZoom={true}>
                    <TileLayer
                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {
                        props.selectingDestinationPosition &&
                            <Marker draggable={true} position={destinationPosition}>
                            </Marker>
                    }
                    {
                        props.destinations.map(el => 
                            <Marker key={el._id} position={[el.lat, el.long]}>
                                <Tooltip >
                                    {el.name}
                                </Tooltip>
                            </Marker>
                        )
                    }
                    <MapEvents onClick={e => props.onMarkerPositionSelected(e.latlng)} onMouseMove={e => setDestinationPosition([e.latlng.lat, e.latlng.lng])} />
            </MapContainer>
            </div>
        );
    
    }

    return (
        <div className="map">
            <MapContainer eventHandlers={{drag: e => console.log(e)}} zoomControl={false} worldCopyJump={true} center={center} maxBounds={new LatLngBounds([-85, -99999999999999999], [85, 99999999999999999])} maxBoundsViscosity={0.9} minZoom={2} zoom={3} scrollWheelZoom={true}>
                <TileLayer
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {
                    props.trip?.stopovers.map((el, i) => 
                        <Marker key={el._id} eventHandlers={{drag: e => props.handleDragMarker(e.latlng, el._id)}} draggable={true} position={[el.lat, el.long]}>
                            <Tooltip offset={[5, 0]}>
                                {i+1}. {el.name}
                            </Tooltip>
                        </Marker>
                    )
                }
                {
                    props.trip?.segments.map(el => {
                        let from = props.trip.stopovers.find(el2 => el2._id === el.from);
                        let to = props.trip.stopovers.find(el2 => el2._id === el.to);

                        if (!from || !to) {
                            return null;
                        }

                        return (
                            <Polyline key={el._id} weight={4} lineJoin="round" positions={[[from.lat, from.long], [to.lat, to.long]]}>
                                <Tooltip sticky offset={[10, 0]}>
                                    {from.name} - {to.name}
                                </Tooltip>
                            </Polyline>
                        );
                    })
                    
                }
                <MapEvents onDragEnd={(latlang) => props.onCenterChange(latlang)} />
        </MapContainer>
        </div>
    );
};
