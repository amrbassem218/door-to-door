import * as React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { type pos, type profilesRow } from '@/types/types';
import { useState, useEffect } from 'react';
import { reverseGeo } from '@/utilities';
interface ISetLocationProps {
  userProfile: profilesRow | null;
}

const LocationDialog: React.FunctionComponent<ISetLocationProps> = ({userProfile}) => {
  const [location, setLocation] = useState<pos>();
  // const [fullLocation, setFullLocation] = useState<FullLocation>();
  useEffect(() => {
    if(userProfile){
      if(userProfile.location){
        setLocation(userProfile.location as unknown as pos);
      }
      else{
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const lat = pos.coords.latitude;
            const lng = pos.coords.longitude
            setLocation({
              lat: lat,
              lng: lng,
            });
            const geo = reverseGeo({lat, lng});
            if(geo){
              // setFullLocation(geo);
            }
          },
          () => {
            // setLocation({ lat: 30.0444, lng: 31.2357 }); 
          }
        );
      }
    }
  }, [])
  return (
    <div>
      <h1 className='text-xl text-heading font-bold'>Ship to</h1>
      <AlertDialog>
      {/* <AlertDialogTrigger className='w-full border-1 flex justify-between items-center p-2 bg-background hover:bg-gray-100 rounded-sm'>
          <div className='flex gap-2 items-center'>
            <Flag code={fullLocation?.country ?? "Egypt"} className='w-7 h-7'/>
            <p>{fullLocation?.country ?? "Egypt"}</p>
          </div>
          <FaAngleRight className='opacity-50'/>
      </AlertDialogTrigger> */}
      <AlertDialogContent>
        <AlertDialogHeader className='bg-background'>
          <AlertDialogTitle>Add a new Adress</AlertDialogTitle>
        </AlertDialogHeader>
        <div>
          
        </div>
        <AlertDialogFooter className='bg-background'>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    </div>
      
  );
};

export default LocationDialog;
