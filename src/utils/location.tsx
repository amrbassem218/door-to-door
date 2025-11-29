'use client'

import { loadGoogle } from "@/googleLoader";
import { pos, ReverseGeo } from "@/types/types";

export const reverseGeo = async ({ lat, lng }: pos): Promise<ReverseGeo> => {
  try {
    await loadGoogle();
    return new Promise((resolve, reject) => {
      const geocoder = new window.google.maps.Geocoder();
      const latlng = { lat, lng };

      console.log("google:", window.google);
      console.log("maps:", window.google?.maps);

      geocoder.geocode({ location: latlng }, (results: any, status: any) => {
        console.log("h2");
        if (status === "OK" && results && results[0]) {
          const comp = results[0].address_components;
          const country = comp.find((c: any) =>
            c.types.includes("country")
          )?.long_name;
          const city = comp.find(
            (c: any) =>
              c.types.includes("locality") ||
              c.types.includes("administrative_area_level_1")
          )?.long_name;
          let adress: string = results[0].formatted_address ?? "";
          if (adress.includes("+")) {
            console.log("trying over here");
            adress = adress.slice(adress.indexOf(",") + 2);
          }
          resolve({ country, city, adress });
        } else {
          reject(new Error("Geocoder failed: " + status));
        }
      });
    });
  } catch (error) {
    console.error("Failed to load Google Maps for geocoding:", error);
    throw new Error("Geocoding service unavailable");
  }
};
