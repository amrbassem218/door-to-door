import * as React from 'react';
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { useState, useEffect } from "react";

const containerStyle = {
  width: "100%",
  height: "400px",
};

interface ILocationPageProps {
}

const AdressPicker: React.FunctionComponent<ILocationPageProps> = (props) => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  });

  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      () => {
        setPosition({ lat: 30.0444, lng: 31.2357 }); 
      }
    );
  }, []);

  if (!isLoaded || !position) return <div>Loading map...</div>;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={position}
      zoom={15}
      onClick={(e) => {
        if (e.latLng) {
          setPosition({
            lat: e.latLng.lat(),
            lng: e.latLng.lng(),
          });
        }
      }}
    >
      <Marker
        position={position}
        draggable={true}
        onDragEnd={(e) => {
          setPosition({
            lat: e.latLng!.lat(),
            lng: e.latLng!.lng(),
          });
        }}
      />
    </GoogleMap>
  );
};

export default AdressPicker;
