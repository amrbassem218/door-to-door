import { CiLocationOn, CiDeliveryTruck } from "react-icons/ci";
import { MdOutlineLocalOffer, MdOutlineLocationOn } from "react-icons/md";
import { LuTruck } from "react-icons/lu";

import * as React from 'react';

interface ITopBarProps {
}

const TopBar: React.FunctionComponent<ITopBarProps> = (props) => {
  return (
  <div className='text-muted bg-background-secondary h-10 flex justify-between px-20 items-center'>
    <p className="">Welcome to Door to Door (DTD)</p>
    {/* right nav */}
    <div className='flex gap-2'>
        <div className="flex border-r-2 border-gray-400 px-3 items-center  gap-1 text-sm">
            <MdOutlineLocationOn className="text-primary font-bold" size={17}/>
            <p>Deliver to Egypt</p>
        </div>
        <div className="flex border-r-2 border-gray-400 px-3 items-center gap-1 text-sm">
            <LuTruck className="text-primary font-bold" size={17}/>
            <p>Track your order</p>
        </div>
        <div className="flex px-3 items-center gap-1 text-sm">
            <MdOutlineLocalOffer className="text-primary font-bold" size={17}/>
            <p>All offers</p>
        </div>
    </div>
  </div>);
};

export default TopBar;
