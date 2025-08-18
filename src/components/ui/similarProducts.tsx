import type { Product } from '@/types/types';
import * as React from 'react';
import Item from './item';
import { useState, useEffect } from 'react';
import { supabase } from '@/supabase/supabaseClient';
import { useNavigate } from 'react-router-dom';
interface IAppProps {
  product: Product;
}

const SimialrProducts: React.FunctionComponent<IAppProps> = ({product}) => {
  const [similarProducts, setSimilarProducts] = useState<Product[]>();
  const navigate = useNavigate();
  useEffect(() => {
    if(product){
      const getSimilarProds = async() => {
        const productTags = product?.tags ?? [];
        const productsMap = new Map<number, Product>();
        for (let tag of productTags){
          const {data: similar, error} = await supabase
          .from('products')
          .select('*')
          .contains('tags', [tag]);
          if(error){
            console.log("couldn't get similar products");
            console.error(error);
          }
          else if(similar){
            similar.forEach((prod) => {
              productsMap.set(prod.id, prod);
            })
          }
        }
        const prods = Array.from(productsMap.values());
        setSimilarProducts(prods);
      }
      getSimilarProds();
    }
  }, [product])
  return (
    <div>
      {/* More to love */}
      <section className='space-y-7 px-2'>
        <h1 className='text-center text-3xl font-bold '>More to love</h1>
        <div className='grid grid-cols-12 gap-5'>
          {similarProducts && similarProducts.map((item, i) => 
            (
              <div className='lg:col-span-2 col-span-6' onClick={() => navigate(`/product/${item.id}`)}>
                <Item item={item} />
              </div>
            )
          )}
        </div>
      </section>
    </div>
  );
};

export default SimialrProducts;
