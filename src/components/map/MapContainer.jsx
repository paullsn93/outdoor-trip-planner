/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { MapContainer as LeafletMap, TileLayer, Polyline, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in Leaflet with Webpack/Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const defaultCenter = [24.5, 121.5]; // [lat, lng] format for Leaflet
const defaultZoom = 10;

// Component to handle map resizing
function MapResizer() {
    const map = useMap();
    useEffect(() => {
        setTimeout(() => {
            map.invalidateSize();
        }, 100);
    }, [map]);
    return null;
}

import { useTrip } from '../../context/TripContext';

// ... (omitted L fix)

export function MapContainer() {
    const { currentTrip } = useTrip();
    const [markers, setMarkers] = useState([]);
    const [route, setRoute] = useState([]);

    useEffect(() => {
        if (!currentTrip?.itinerary) return;

        const newMarkers = [];
        const newRoute = [];

        currentTrip.itinerary.forEach(day => {
            if (day.events) {
                day.events.forEach(event => {
                    if (event.location && event.location.lat && event.location.lng) {
                        try {
                            const lat = parseFloat(event.location.lat);
                            const lng = parseFloat(event.location.lng);
                            if (!isNaN(lat) && !isNaN(lng)) {
                                const pos = [lat, lng];
                                newMarkers.push({ ...event, pos, dayTitle: day.title });
                                newRoute.push(pos);
                            }
                        } catch (e) {
                            console.warn("Invalid coordinates", event);
                        }
                    }
                });
            }
        });

        setMarkers(newMarkers);
        setRoute(newRoute);
    }, [currentTrip]);

    return (
        <div style={{ width: '100%', height: '100%' }}>
            <LeafletMap
                center={defaultCenter}
                zoom={defaultZoom}
                scrollWheelZoom={true}
                style={{ width: '100%', height: '100%' }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {route.length > 0 && (
                    <Polyline
                        positions={route}
                        pathOptions={{ color: 'blue', weight: 4, opacity: 0.7, dashArray: '10, 10' }}
                    />
                )}

                {markers.map((marker, idx) => (
                    <Marker key={idx} position={marker.pos}>
                        <Popup>
                            <strong>{marker.title}</strong><br />
                            <small>{marker.dayTitle}</small><br />
                            {marker.time} @ {marker.location.name}
                        </Popup>
                    </Marker>
                ))}

                <MapResizer />
            </LeafletMap>
        </div>
    );
}
