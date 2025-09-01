import { useCurrencyRates } from '@/getRates';
import type { Product } from '@/types/types';
import { getProfile } from '@/userContext';
import { convertPrice, newPrice, price, save } from '@/utilities';
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Separator } from './separator';
interface IItemProps {
  item: Product
  col?: string;
  style?: string;
}

const Item: React.FunctionComponent<IItemProps> = ({item, col, style}) => {
  const navigate = useNavigate();
  const { rates, loading } = useCurrencyRates();
  const userProfile = getProfile();
  const [userCurrency, setUserCurrency] = useState(userProfile?.userProfile?.currencies.currencyCode ?? "USD");
  if (loading) return <p>Loading prices...</p>;
  return (
    <div className={`${col} border-1 rounded-lg transition-transform duration-200 ease-in-out hover:scale-105 cursor-pointer bg-background ${style} px-2 w-40`} onClick={() => navigate(`/product/${item.id}`)}>
      {/* Item Image */}
      <div className="h-24 rounded-t-lg flex items-center justify-center overflow-hidden ">
        <img
          src={item.thumbnail}
          alt=""
          className=" object-contain h-full max-w-full"
        />
      </div>
      {/* <Separator className=''/> */}
      {/* Item Description */}
      <div className='mx-2 mt-2 pb-2 border-b-2 space-y-1'>
        <h1 className='text-lg font-medium'>{item.name}</h1>
        <div className='flex gap-2 text-md'>
          <p className='font-bold'>{newPrice(item, userCurrency, rates)} {userCurrency}</p>
          <p className='line-through decoration-1'>{price(item, userCurrency ,rates) ?? "00"}</p>
        </div>
      </div>

      {/* Footer */}
      <div className='mx-2 py-2'>
        <p className='font-semibold text-green-600'>Save {save(item, userCurrency, rates)} {userCurrency}</p>
      </div>
    </div>
  );
};

export default Item;
