import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MapComponent = () => {
  const [position, setPosition] = useState([0, 0]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLocation = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:8081/api/telemetry/device/location/drone123'); // Replace with your endpoint
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
    <div>
      <p>Current Position: Latitude: {position[0]}, Longitude: {position[1]}</p>
    </div>
  );
};

export default MapComponent;
