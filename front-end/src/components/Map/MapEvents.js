import { useMapEvents } from 'react-leaflet';

export const MapEvents = props => {
    const map = useMapEvents({
        dragend: () => {
            if (props.onDragEnd) {
                console.log(map.getCenter());
                props.onDragEnd(map.getCenter());
            }
        }
    });
        
    return null;
};
