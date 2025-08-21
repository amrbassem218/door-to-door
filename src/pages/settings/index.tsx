import * as React from 'react';
import { FaAngleLeft } from 'react-icons/fa';
import { IoIosArrowBack } from 'react-icons/io';
import { Outlet, useNavigate } from 'react-router-dom';
import Flag from 'react-world-flags';
import { useState } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from '@/components/ui/button';
import { ChevronsUpDown } from 'lucide-react';
import  { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger }  from '@/components/ui/dropdown-menu';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { countries } from '@/components/countries';
interface ISettingsProps {
}

const Settings: React.FunctionComponent<ISettingsProps> = (props) => {
  const navigate = useNavigate();
  const egypt = {code: "EG", name: "Egypt"};
  const [userCountry, setUserCountry] = useState(egypt);
  return (
    <div>
      {/* Header */}
      <div className='flex px-2 gap-1 items-center pb-2 pt-3 border-b-1 shadow-sm '>
        <IoIosArrowBack className='sm:hidden text-xl' onClick={() => navigate(-1)}/>
        <h1 className='text-lg'>Settings</h1>
      </div>

      {/* content */}
      <div>
        
        {/* Profile */}
        <div className='border-b-1 px-5 py-3' onClick={() => navigate('/settings/profile')}>
          <p className='font-medium'>Profile</p>
        </div>

        {/* Country */}
        <div className='border-b-1 px-5 py-3 flex justify-between' onClick={() => navigate('/settings/country')}>
          <p className='font-medium'>Country</p>
          <Flag code={userCountry.code} className='w-7 h-7' />
          
        </div>

        {/* Profile */}
        <div className='border-b-1 px-5 py-3' onClick={() => navigate('/settings/adressPicker')}>
          <p className='font-medium'>Ship to</p>
        </div>

        {/* Profile */}
        <div className='border-b-1 px-5 py-3' onClick={() => navigate('/settings/profile')}>
          <p className='font-medium'>Profile</p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
