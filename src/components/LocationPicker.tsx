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
    const [loadingLocation, setLoadingLocation] = useState(false);

    // Fix for default marker icon
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
        if (!isMounted || !mapRef.current || mapInstance.current) return;

        const defaultCenter = initialLocation || { lat: 20.5937, lng: 78.9629 };
        const map = L.map(mapRef.current).setView([defaultCenter.lat, defaultCenter.lng], 5); // Zoom out initially

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);

        map.on('click', (e: L.LeafletMouseEvent) => {
            const { lat, lng } = e.latlng;
            updateMarker(lat, lng);
        });

        mapInstance.current = map;

        if (initialLocation) {
            updateMarker(initialLocation.lat, initialLocation.lng);
            map.setView([initialLocation.lat, initialLocation.lng], 15);
        }
    }, [isMounted]);

    const updateMarker = (lat: number, lng: number) => {
        if (!mapInstance.current) return;

        if (markerInstance.current) {
            markerInstance.current.setLatLng([lat, lng]);
        } else {
            markerInstance.current = L.marker([lat, lng], { icon: defaultIcon }).addTo(mapInstance.current);
        }
        onLocationSelect({ lat, lng });
    };

    const handleGetLocation = () => {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser");
            return;
        }

        setLoadingLocation(true);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const { latitude, longitude } = pos.coords;
                if (mapInstance.current) {
                    mapInstance.current.setView([latitude, longitude], 15);
                    updateMarker(latitude, longitude);
                }
                setLoadingLocation(false);
            },
            (err) => {
                console.error(err);
                setLoadingLocation(false);
                if (err.code === 1) {
                    alert("Location permission denied. Please enable it in browser settings or use the map to pin manually.");
                } else {
                    alert("Could not fetch location. Please try again.");
                }
            },
            { enableHighAccuracy: true }
        );
    };

    return (
        <div className="relative w-full h-[300px] rounded-xl overflow-hidden border border-gray-200 shadow-sm">
            <div ref={mapRef} className="w-full h-full z-0" />

            <div className="absolute top-3 right-3 z-[400] flex flex-col gap-2">
                <button
                    type="button"
                    onClick={handleGetLocation}
                    disabled={loadingLocation}
                    className="bg-white text-gray-800 px-3 py-2 rounded-lg shadow-md text-sm font-bold flex items-center gap-2 hover:bg-gray-50 transition-colors border border-gray-100"
                >
                    {loadingLocation ? (
                        <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                    ) : (
                        <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                    )}
                    Use My Location
                </button>
            </div>

            <div className="absolute bottom-2 left-2 bg-white/90 px-2 py-1 rounded text-[10px] text-gray-500 z-[400] pointer-events-none border border-gray-100">
                Tap anywhere to pin location
            </div>
        </div>
    );
};

export default LocationPicker;
