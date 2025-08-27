import * as React from 'react';
import { FaAngleLeft } from 'react-icons/fa';
import { IoIosArrowBack } from 'react-icons/io';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Flag from 'react-world-flags';
import { useState, useEffect } from 'react';
import { useUser } from '@/utilities';
import { supabase } from '@/supabase/supabaseClient';
import type { Currencies, UserProfile } from '@/types/types';
import currencyCodes from "currency-codes";
import { useProductSearch } from '@/hooks/useProductSearch';
import { getProfile } from '@/userContext';

interface ISettingsProps {
  
}

const Settings: React.FunctionComponent<ISettingsProps> = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const egypt = {code: "EG", name: "Egypt"};
  const [userCountry, setUserCountry] = useState(egypt);
  const userProfile = getProfile();
  const [userCurrency, setUserCurrency] = useState<Currencies>();
  useEffect(() => {
    if(userProfile){
      console.log("user_profile: ", userProfile);
      setUserCurrency(userProfile?.userProfile?.currencies);
    }
  }, [userProfile])
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
        <div className='border-b-1 px-5 py-3' onClick={() => navigate('/account/settings/profile')}>
          <p className='font-medium'>Profile</p>
        </div>

        {/* Currency */}
        <div className='border-b-1 px-5 py-3 flex justify-between' onClick={() => navigate('/account/settings/currency')}>
          <p className='font-medium'>Currency</p>
          <p className='text-text'>{userCurrency?.currencyCode}</p>
        </div>

        {/* Ship to */}
        <div className='border-b-1 px-5 py-3' onClick={() => navigate('/location', { state: { from: location.pathname } })}>
          <p className='font-medium'>Ship to</p>
        </div>

        {/* Profile */}
        <div className='border-b-1 px-5 py-3' onClick={() => navigate('/account/settings/profile')}>
          <p className='font-medium'>Profile</p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
