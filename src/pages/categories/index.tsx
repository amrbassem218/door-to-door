import * as React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from '@/supabase/supabaseClient';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Card, CardContent } from '@/components/ui/card';
import type { Product } from '@/types/types';
import { capetalize } from '@/utilities';
interface ICategoryProps {
}

const Categories: React.FunctionComponent<ICategoryProps> = (props) => {
  const getCat = async() => {
    const { data: categoryContent, error } = await supabase
    .from('categories')
    .select(`
      id,
      name,
      sub_categories (
        id,
        name,
        products (
          id,
          name,
          thumbnail
        )
      )
    `);

    if (error) throw error;
    return categoryContent;
  }
  type catContentType = Awaited<ReturnType<typeof getCat>>;
  const [categories, setCategories] = useState<catContentType>();

  useEffect(() => {
    getCat()
    .then((catContent) => {
      setCategories(catContent)
    })
    .catch((err) => {
      console.log("can't get prod")
      console.log(err);
    })
  }, [])
  const navigate = useNavigate();
  return (
    <div className='overflow-hidden'>
      {
        categories && categories.map((cat) => (
          <div className='mx-5 py-5 '>
            {/* <h1 className='font-bold text-lg'>{cat.name}</h1> */}
            <div className='space-y-5'>
              {
              cat.sub_categories.map((sub) => (
                <div className='sm:text-center  sm:flex sm:items-center sm:flex-col sm:w-full'>
                  <h1 className='text-xl font-semibold'>{capetalize(sub.name)}</h1>
                  <div className=''>
                    <Carousel className="w-full ">
                      <CarouselContent className='flex gap-2 w-full'>
                          {sub.products.map((prod, index) => (
                            <CarouselItem key={index} className='basis-1/3 max-w-30' onClick={() => navigate(`/product/${prod.id}`)}> 
                              <button className='w-30 flex items-center justify-center flex-col text-center'>
                                <div className='w-25 h-25 border-2 rounded-full flex items-center justify-center'>
                                  <img src={prod.thumbnail} alt="this is alt" className='object-contain w-full h-full rounded-full '/>
                                </div>
                                <span className="text-muted font-semibold line-clamp-1">{prod.name}</span>
                              </button>
                            </CarouselItem>
                          ))}
                      </CarouselContent>
                      <CarouselPrevious />
                      <CarouselNext />
                    </Carousel>
                  </div>
                </div>
              ))
            }
            </div>
            
          </div>
        ))
      }
    </div>
  );
};


export default Categories;
