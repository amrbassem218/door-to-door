import type { Product } from '@/types/types';
import * as React from 'react';
import { FiMinus, FiPlus } from 'react-icons/fi';

interface IQuantityChangeProps {
  handleQuantityChange: (type:string, product?: Product) => void;
  value: number;
  styles?: string;
  sqauresStyle?: string;
  mobile?: boolean;
}

const QuantityChange: React.FunctionComponent<IQuantityChangeProps> = ({handleQuantityChange, value, styles, sqauresStyle, mobile}) => {
  return (
    <div className={`grid grid-cols-12 ${styles}`}>
        <button className={`border-1 p-1 cursor-pointer ${sqauresStyle} flex items-center justify-center col-span-3`} onClick={() => handleQuantityChange("minus")}>
            <FiMinus size={10}/>  
        </button> 
        <input 
            type='number' 
            value={value} 
            className='border-1 text-center text-lg sm:min-w-10 col-span-6' 
            style={{ width: `${mobile ? "" : Math.max(2.5, Math.min(8, (value.toString().length + 1)/1.5))}rem` }}
            onChange={(e) => handleQuantityChange(e.target.value)}
        />
        <button className={`border-1 p-1 cursor-pointer bg-primary text-white ${sqauresStyle} flex items-center justify-center  col-span-3`} onClick={() => handleQuantityChange("plus")}>
            <FiPlus size={10}/>  
        </button>
    </div>
  );
};

export default QuantityChange;
