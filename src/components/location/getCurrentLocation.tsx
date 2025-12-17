"use client";

import { FullLocation } from "@/types/types";
import { reverseGeo } from "@/utils/location";

export const getCurrentLocation = async (): Promise<FullLocation | null> => {
  if (typeof navigator === "undefined" || !navigator.geolocation) {
    console.error("Geolocation not supported in this environment");
    return null;
  }

  try {
    const position = await new Promise<GeolocationPosition>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        resolve,
        (err) => {
          console.error("Geolocation error:", err.code, err.message);
          reject(err);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    });

    const lat = position.coords.latitude;
    const lng = position.coords.longitude;

    const geo = await reverseGeo({ lat, lng });
    if (!geo) return null;

    return { ...geo, lat, lng };
  } catch {
    // already logged above
    return null;
  }
};
