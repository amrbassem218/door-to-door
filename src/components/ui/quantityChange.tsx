import type { Product } from '@/types/types';
import * as React from 'react';
import { FiMinus, FiPlus } from 'react-icons/fi';

interface IQuantityChangeProps {
  handleQuantityChange: (type:string, product?: Product) => void;
  value: number;
  styles?: string;
  sqauresStyle?: string;
  mobile?: boolean;
  product?: Product;
}

const QuantityChange: React.FunctionComponent<IQuantityChangeProps> = ({handleQuantityChange, value, styles, sqauresStyle, mobile, product}) => {
  return (
    <div className={`flex items-center h-6 w-26 ${styles}`}>
        <button className={`border-1 p-2 cursor-pointer h-full flex items-center justify-center w-8 ${sqauresStyle}`} onClick={() => handleQuantityChange("minus", product)}>
            <FiMinus size={14}/>  
        </button> 
        <input 
            type='number' 
            value={value} 
            className='border-1 text-center text-sm h-full flex-1 min-w-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none' 
            onChange={(e) => handleQuantityChange(e.target.value, product)}
        />
        <button className={`border-1 p-2 cursor-pointer bg-primary text-white h-full flex items-center justify-center w-8 ${sqauresStyle}`} onClick={() => handleQuantityChange("plus", product)}>
            <FiPlus size={14}/>  
        </button>
    </div>
  );
};

export default QuantityChange;
