import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface Location {
    lat: number;
    lng: number;
}

interface LocationPickerProps {
    initialLocation?: Location;
    onLocationSelect: (location: Location) => void;
}

const LocationPicker = ({ initialLocation, onLocationSelect }: LocationPickerProps) => {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstance = useRef<L.Map | null>(null);
    const markerInstance = useRef<L.Marker | null>(null);
    const [isMounted, setIsMounted] = useState(false);

    
    const defaultIcon = L.icon({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41]
    });

    useEffect(() => {
        setIsMounted(true);
        return () => {
            
            if (mapInstance.current) {
                mapInstance.current.remove();
                mapInstance.current = null;
            }
        };
    }, []);

    useEffect(() => {
        if (!isMounted || !mapRef.current) return;

        
        if (!mapInstance.current) {
            const defaultCenter = initialLocation || { lat: 20.5937, lng: 78.9629 };
            const map = L.map(mapRef.current).setView([defaultCenter.lat, defaultCenter.lng], 13);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; OpenStreetMap contributors'
            }).addTo(map);

            
            map.on('click', (e: L.LeafletMouseEvent) => {
                const { lat, lng } = e.latlng;

                
                if (markerInstance.current) {
                    markerInstance.current.setLatLng([lat, lng]);
                } else {
                    markerInstance.current = L.marker([lat, lng], { icon: defaultIcon }).addTo(map);
                }

                
                onLocationSelect({ lat, lng });
            });

            mapInstance.current = map;

            
            if (initialLocation) {
                markerInstance.current = L.marker([initialLocation.lat, initialLocation.lng], { icon: defaultIcon }).addTo(map);
            }

            
            if (!initialLocation && navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (pos) => {
                        const userLat = pos.coords.latitude;
                        const userLng = pos.coords.longitude;
                        map.setView([userLat, userLng], 13);
                        if (!markerInstance.current) { 
                            markerInstance.current = L.marker([userLat, userLng], { icon: defaultIcon }).addTo(map);
                            onLocationSelect({ lat: userLat, lng: userLng });
                        }
                    },
                    (err) => console.error(err)
                );
            }
        }
    }, [isMounted]); 

    return (
        <div className="h-[300px] w-full rounded-lg overflow-hidden border border-border shadow-sm relative z-0">
            <div ref={mapRef} style={{ height: '100%', width: '100%' }} />
            <div className="absolute top-2 right-2 bg-background/90 text-xs px-2 py-1 rounded shadow z-[1000] pointer-events-none text-foreground border border-border">
                Tap map to select
            </div>
        </div>
    );
};

export default LocationPicker;
