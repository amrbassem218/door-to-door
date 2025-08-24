import type { currenciesDataType, UserProfile } from '@/types/types';
import * as React from 'react';
import { IoIosArrowBack } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import Flag from 'react-world-flags';
import countries from "world-countries";
import { useState, useEffect } from 'react';
import { currencyToPrimaryCountry, useUser } from '@/utilities';
import { supabase } from '@/supabase/supabaseClient';
import { Check } from 'lucide-react';
import { toast } from 'sonner';
interface ICurrencyProps {
}

const Currency: React.FunctionComponent<ICurrencyProps> = () => {
  const navigate = useNavigate();
  const [currenciesData, setCurrenciesData] = useState<currenciesDataType[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile>();
  const user = useUser();
  const [userCurrency, setUserCurrency] = useState<currenciesDataType>();

  useEffect(() => {
    if(user){
      const getUserData = async() => {
        const {data: userData, error} = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
        if(error){
          console.log("couldn't get user profile");
          console.error(error);
        }
        if(userData){
          setUserProfile(userData);
          console.log("currency coming");
          console.log("currency: ", userData.currency);
          setUserCurrency(userData.currency);
        }
      }
      getUserData();
    }
  }, [user])

  useEffect(() => {
    const seenCodes: string[] = [];
    const currencies: currenciesDataType[] = [];
    for(let country of countries){
      for(let currency of Object.keys(country.currencies)){
        if(!seenCodes.includes(currency)){
          let countryCode = Object.keys(currencyToPrimaryCountry).includes(currency) ? currencyToPrimaryCountry[currency] : country.cca2;
          let currencyData: currenciesDataType = {
            countryCode: countryCode,
            currencyName: country.currencies[currency].name,
            currencyCode: currency
          }
          currencies.push(currencyData);
          seenCodes.push(currency);
        }
      }
    }
    currencies.sort((a,b) => {
      return a.currencyName.localeCompare(b.currencyName);
    })
    setCurrenciesData(currencies);
  }, [])

  const handleNewCurrencyClick = async(currency: currenciesDataType) => {
    setUserCurrency(currency);
    if(user){
      const {error} = await supabase
      .from('profiles')
      .update({currency: currency})
      .eq('id', user.id);
    }
    toast("Language changed succssfully", {description: `changed language to ${currency.currencyName}`});
  }
  return (
    <div className=''>
      {/* Header */}
      <div className='flex px-2 gap-1 items-center pb-2 pt-3 border-b-1 shadow-sm '>
        <IoIosArrowBack className='sm:hidden text-xl' onClick={() => navigate(-1)}/>
        <h1 className='text-lg'>Currency</h1>
      </div>

      
      <div className='w-full  bg-gray-100 flex flex-col gap-2 py-2'>
        {/* Current Currency */}
        <div className='space-y-1'>
          <div className='px-2'>
            <p className='text-xs text-text'>Current Currency</p>
          </div>
          <div className='w-full bg-white  px-5 py-2 flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <Flag code={userCurrency?.countryCode ?? "US"} className='w-7 h-7' />
              <p>{userCurrency?.currencyName ?? "United States Dollar"}</p>
            </div>
            <div>
              <Check className='text-md text-primary'/>
            </div>
          </div>
        </div>
        {/* More currencies */}
       {currenciesData.map((currency, i) => (
        <div className='space-y-1' onClick={() => handleNewCurrencyClick(currency)}>
          {(i-1 < 0 || currency.currencyName[0] > currenciesData[i-1].currencyName[0]) &&
          <div className='px-2'>
            <p className='text-xs text-text'>{currency.currencyName[0]}</p>
          </div>
          }
          <div className='w-full bg-white px-5 py-2 flex items-center gap-2'>
            <Flag code={currency.countryCode} className='w-7 h-7' />
            <p>{currency.currencyName}</p>
          </div>
        </div>
      ))} 
      </div>
      
    </div>
  );
};

export default Currency;
