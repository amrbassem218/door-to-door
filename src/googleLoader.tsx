import { Loader } from "@googlemaps/js-api-loader";

const loader = new Loader({
  apiKey: process.env.VITE_GOOGLE_MAPS_API_KEY || "YOUR_API_KEY",
  libraries: ["places", "geocoding"],
  version: "weekly",
});

let isLoaded = false;

export async function loadGoogle() {
  // Check if Google Maps is already loaded
  if (window.google && window.google.maps) {
    return window.google;
  }

  // Check if we're already loading
  if (isLoaded) {
    // Wait for the existing load to complete
    return new Promise((resolve) => {
      const checkLoaded = () => {
        if (window.google && window.google.maps) {
          resolve(window.google);
        } else {
          setTimeout(checkLoaded, 100);
        }
      };
      checkLoaded();
    });
  }

  try {
    isLoaded = true;
    const google = await loader.load();
    return google;
  } catch (error) {
    console.error("Failed to load Google Maps:", error);
    isLoaded = false;
    throw error;
  }
}
