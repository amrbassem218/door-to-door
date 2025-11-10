'use client'
import * as React from 'react';
import { useState, useEffect } from 'react';
import type { Product } from '@/types/types';
import Item from '@/components/ui/item';
import { getProducts } from '@/utils/products-utils';
interface IListProdProps {
    limit?: number;
    size: string;
}

const ListProd: React.FunctionComponent<IListProdProps> = ({limit, size}) => {
  const [items, setItems] = useState<Product[]>();
  useEffect(() => {
    const getProd = async() => {
      const prod = await getProducts();
      if(prod){
        setItems(prod);
      }
    }
    getProd();
  }, [])
  const colSize = size == "large" ? 'md:col-span-6 col-span-12' : 'sm:col-span-2 col-span-6';
  return (
    <div className='grid grid-cols-12 gap-2'>
        {items && items.map((item, i) => 
            {
                return !limit || (limit && i < limit) && ( 
                    <Item item={item} col={colSize} style='bg-card'/>
                ) 
            }
        )}
    </div>
  );
};

export default ListProd;
