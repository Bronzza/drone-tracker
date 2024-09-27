import React, { useEffect, useState, useRef } from 'react'; // Added useRef
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import L from 'leaflet'; 
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import planeImg from '../img/aircraft-jet-icon.svg';

const baseUrl = process.env.REACT_APP_API_BASE_URL;
const deviceId = process.env.REACT_APP_DEVICE_ID;
const apiUrl = `${baseUrl}/${deviceId}`;
const defaultLatt = 50.4501;
const defaultLong = 30.5234;

const MapComponent = () => {
  const [position, setPosition] = useState([defaultLatt, defaultLong]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(13); // Default zoom level
  
  const markerRef = useRef(null); // <-- Use ref to control Marker component

  useEffect(() => {
    const fetchLocation = async () => {
      setLoading(true);
      try {
        const response = await axios.get(apiUrl); // Replace with your endpoint
        const newPos = [response.data.latitude, response.data.longitude];
        setPosition(newPos);

        // <-- Move the marker without re-rendering the entire map
        if (markerRef.current) {
          markerRef.current.setLatLng(newPos);
        }

      } catch (error) {
        setError('Error fetching location');
        console.error('Error fetching location', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLocation();
    const interval = setInterval(fetchLocation, 10000); // Refresh every 10 seconds
    return () => clearInterval(interval); // Cleanup on component unmount
  }, []);

  const MapEvents = () => {
    useMapEvents({
      zoomend: (e) => {
        setZoomLevel(e.target.getZoom()); // Update zoom level when map zooms in or out
      },
    });
    return null;
  };

  // Dynamically adjust the size of the icon based on the zoom level
  const planeIcon = new L.Icon({
    iconUrl: planeImg,
    iconSize: [zoomLevel * 3, zoomLevel * 3], // Adjust icon size based on zoom level
    iconAnchor: [zoomLevel * 1.5, zoomLevel * 3], // Adjust the anchor point
    popupAnchor: [0, -zoomLevel * 3] // Adjust popup position relative to the icon size
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <MapContainer center={position} zoom={zoomLevel} style={{ height: "100vh", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={position} icon={planeIcon} ref={markerRef}> 
        <Popup>
          Drone Location: <br /> Latitude: {position[0]} <br /> Longitude: {position[1]}
        </Popup>
      </Marker>
      <MapEvents /> 
    </MapContainer>
  );
};

export default MapComponent;
