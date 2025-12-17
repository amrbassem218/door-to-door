import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useUserLocation } from "@/contexts/locationContext";
import { type profilesRow } from "@/types/types";
import * as React from "react";
interface ISetLocationProps {
  userProfile: profilesRow | null;
}

const LocationDialog: React.FunctionComponent<ISetLocationProps> = () => {
  const [location, setLocation] = useUserLocation();
  return (
    <div>
      <h1 className="text-xl text-heading font-bold">Ship to</h1>
      <AlertDialog>
        {/* <AlertDialogTrigger className='w-full border-1 flex justify-between items-center p-2 bg-background hover:bg-gray-100 rounded-sm'>
          <div className='flex gap-2 items-center'>
            <Flag code={fullLocation?.country ?? "Egypt"} className='w-7 h-7'/>
            <p>{fullLocation?.country ?? "Egypt"}</p>
          </div>
          <FaAngleRight className='opacity-50'/>
      </AlertDialogTrigger> */}
        <AlertDialogContent>
          <AlertDialogHeader className="bg-background">
            <AlertDialogTitle>Add a new Adress</AlertDialogTitle>
          </AlertDialogHeader>
          <div></div>
          <AlertDialogFooter className="bg-background">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default LocationDialog;
