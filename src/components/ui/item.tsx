import type { Product } from '@/types';
import { newPrice } from '@/utilities';
import * as React from 'react';
import { useNavigate } from 'react-router-dom';

interface IItemProps {
  item: Product
  col: string;
}

const Item: React.FunctionComponent<IItemProps> = ({item, col}) => {
  const navigate = useNavigate();
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
        <h1 className='text-lg font-medium'>L'Oreal Paris Makeup True Match Lumi Glotion</h1>
        <div className='flex gap-2 text-md'>
          <p className='font-bold'>${newPrice(item)}</p>
          <p className='line-through decoration-1'>${item.price}</p>
        </div>
      </div>

      {/* Footer */}
      <div className='mx-4 py-2'>
        <p className='font-semibold text-green-600'>Save - ${item.price - newPrice(item)}</p>
      </div>
    </div>
  );
};

export default Item;
