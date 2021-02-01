import { useMapEvents } from 'react-leaflet';

export const MapEvents = props => {
    const map = useMapEvents({
        dragend: () => {
            if (props.onDragEnd) {
                props.onDragEnd(map.getCenter());
            }
        },
        drag: () => {
            if (props.onDrag) {
                props.onDrag(map.getCenter());
            }    
        },
        mousemove: e => {
            if (props.onMouseMove) {
                props.onMouseMove(e);
            }    
        },
        click: e => {
            if (props.onClick) {
                props.onClick(e);
            }    
        }
    });
        
    return null;
};
