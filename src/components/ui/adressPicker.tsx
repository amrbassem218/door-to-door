import * as React from 'react';
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { useState, useEffect } from "react";
import type { pos } from '@/types/types';



interface ILocationPageProps {
  position: pos | null;
  setPosition: React.Dispatch<React.SetStateAction<pos | null>>;
  styles: Object;
}

const AdressPicker: React.FunctionComponent<ILocationPageProps> = ({position, setPosition, styles}) => {
  const containerStyle = styles;
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.VITE_GOOGLE_MAPS_API_KEY
  });


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
      options={{
        disableDefaultUI: true
      }}
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
