'use client'
import { userUserName } from "@/contexts/authContext";
import { useUserLocation } from "@/contexts/locationContext";
import { IoLocationOutline } from "react-icons/io5";
import * as React from "react";
import { useRouter } from "next/navigation";

interface ILocationChangeProps {}

const LocationChange: React.FunctionComponent<ILocationChangeProps> = (
  props
) => {
  const [username] = userUserName();
  const [userLocation] = useUserLocation(); 
  const router = useRouter();
  const handleChangeLocationClick = () => {
    router.replace('/location'); 
  }
  if(userLocation){
    console.log("User Location:", userLocation);
  }  
  return (
    <button onClick={() => handleChangeLocationClick()} className="flex items-center cursor-pointer">
      {/* Location Icon */}
      <div>
        <IoLocationOutline className="w-6 h-6"/>
      </div>
      {/* Location Description */}
      <div className="flex flex-col text-left">
        <p className="text-xs text-muted-foreground">Deliver to</p>
        <p className="text-sm">{userLocation?.city}</p>
      </div>
    </button>
  );
};

export default LocationChange;
