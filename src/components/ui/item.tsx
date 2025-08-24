import { useCurrencyRates } from '@/getRates';
import type { Product } from '@/types/types';
import { getProfile } from '@/userContext';
import { convertPrice, newPrice } from '@/utilities';
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
interface IItemProps {
  item: Product
  col?: string;
}

const Item: React.FunctionComponent<IItemProps> = ({item, col}) => {
  const navigate = useNavigate();
  const { rates, loading } = useCurrencyRates();
  const userProfile = getProfile();
  const [userCurrency, setUserCurrency] = useState(userProfile?.userProfile?.currency?.currencycode ?? "USD");
  if (loading) return <p>Loading prices...</p>;
  return (
    <div className={`${col} border-1 rounded-lg transition-transform duration-200 ease-in-out hover:scale-105 cursor-pointer bg-white`} onClick={() => navigate(`/product/${item.id}`)}>
      {/* Item Image */}
      <div className="h-48 bg-background-secondary rounded-t-lg flex items-center justify-center overflow-hidden m-2 p-2">
        <img
          src={item.thumbnail}
          alt=""
          className="object-contain h-full max-w-full"
        />
      </div>
      
      {/* Item Description */}
      <div className='mx-4 mt-2 pb-2 border-b-2 space-y-1'>
        <h1 className='text-lg font-medium'>{item.name}</h1>
        <div className='flex gap-2 text-md'>
          <p className='font-bold'>${newPrice(item, userCurrency, rates)}</p>
          <p className='line-through decoration-1'>${convertPrice(item.price, userCurrency ,rates) ?? "00"}</p>
        </div>
      </div>

      {/* Footer */}
      <div className='mx-4 py-2'>
        <p className='font-semibold text-green-600'>Save - ${item.price - (newPrice(item, userCurrency, rates) ?? 0)}</p>
      </div>
    </div>
  );
};

export default Item;
