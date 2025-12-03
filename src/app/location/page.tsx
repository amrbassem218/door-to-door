"use client";
import AdressPicker from "@/components/ui/adressPicker";
import { Button } from "@/components/ui/button";
import { supabase } from "@/supabase/supabaseClient";
import type { pos } from "@/types/types";
import { useUser } from "@/utils/getUser";
import { Autocomplete, useLoadScript } from "@react-google-maps/api";
import { useRouter } from "next/navigation";
import * as React from "react";
import { useRef, useState } from "react";
import { IoSearchOutline } from "react-icons/io5";
import { toast } from "sonner";
// Define libraries array outside component to prevent re-renders
const libraries: "places"[] = ["places"];

const LocationPage: React.FunctionComponent = () => {
  const [position, setPosition] = useState<pos | null>(null); // Changed from undefined to null
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const router = useRouter();

  const { user } = useUser();
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "",
    libraries, // Use the constant defined outside
  });

  const handleLocationSubmit = async () => {
    if (user && position) {
      // Check if position exists
      const { error } = await supabase
        .from("profiles")
        .update({ location: position })
        .eq("id", user.id);

      if (error) {
        console.error("can't update user location", error);
        toast.error("Failed to update location");
      } else {
        router.back();
        toast("Location updated successfully");
      }
    } else if (!position) {
      toast.error("Please select a location first");
    }
  };

  const onLoad = (autocomplete: google.maps.places.Autocomplete) => {
    console.log("Autocomplete loaded:", autocomplete);
    autocompleteRef.current = autocomplete;
  };

  const onPlaceChanged = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      console.log("Place selected:", place);

      if (place.geometry?.location) {
        const newPosition = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        };
        console.log("New position:", newPosition);
        setPosition(newPosition);
      } else {
        console.warn("No geometry found for selected place");
        toast.error("Could not get location for selected place");
      }
    }
  };

  // Handle loading error
  if (loadError) {
    console.error("Google Maps load error:", loadError);
    return (
      <div>
        Error loading Google Maps. Please check your API key and try again.
      </div>
    );
  }

  if (!isLoaded) return <div>Loading Google Maps...</div>;

  return (
    <div className="w-full h-full overflow-hidden">
      {/* Search bar */}
      <div className="w-full h-screen relative">
        <div className="absolute top-3 sm:top-15 left-1/2 -translate-x-1/2 z-20 w-[90%] max-w-md">
          <div className="justify-center relative h-10 bg-background w-full max-w-full flex items-center gap-1 rounded-md border shadow-md">
            <IoSearchOutline
              className="text-gray-500 absolute left-2"
              size={18}
            />
            <Autocomplete
              onLoad={onLoad}
              onPlaceChanged={onPlaceChanged}
              options={{
                types: ["establishment", "geocode"],
                fields: ["place_id", "geometry", "name", "formatted_address"],
              }}
              className="w-full h-full"
            >
              <input
                type="text"
                placeholder="Search for a place..."
                className="w-full pl-8 pr-3 h-full bg-transparent outline-none rounded-md"
              />
            </Autocomplete>
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="absolute top-0 h-screen w-full">
        <AdressPicker
          position={position}
          setPosition={setPosition}
          styles={{ width: "100%", height: "100%" }}
        />
      </div>

      {/* Bottom bar */}
      <div className="absolute bottom-0 bg-background h-15 left-1/2 -translate-x-1/2 z-10 flex items-center gap-3 w-full px-5 py-3">
        <Button
          variant="outline"
          className="flex-1 h-10 border"
          onClick={() => router.back()}
        >
          Cancel
        </Button>
        <Button
          className="w-50 h-10"
          onClick={handleLocationSubmit}
          disabled={!position} // Disable if no position selected
        >
          Confirm Location
        </Button>
      </div>
    </div>
  );
};

export default LocationPage;
