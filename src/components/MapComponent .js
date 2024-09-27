import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet'; 
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import planeImg from '../img/aircraft-jet-icon.svg';

const baseUrl = process.env.REACT_APP_API_BASE_URL;
const deviceId = process.env.REACT_APP_DEVICE_ID;
const apiUrl = `${baseUrl}/${deviceId}`;
const defaultLatt = 50.4501;
const defaultLong = 30.5234;

const planeIcon = new L.Icon({
  iconUrl: planeImg, // Make sure to replace this with the actual path
  iconSize: [50, 50], // Size of the icon
  iconAnchor: [25, 50], // Point of the icon which will correspond to marker's location
  popupAnchor: [0, -50] // Point from which the popup should open relative to the iconAnchor
});

const MapComponent = () => {
  const [position, setPosition] = useState([defaultLatt, defaultLong]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLocation = async () => {
      setLoading(true);
      try {
        const response = await axios.get(apiUrl); // Replace with your endpoint
        setPosition([response.data.latitude, response.data.longitude]);
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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <MapContainer center={position} zoom={13} style={{ height: "100vh", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={position} icon={planeIcon}>
        <Popup>
          Drone Location: <br /> Latitude: {position[0]} <br /> Longitude: {position[1]}
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default MapComponent;
