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

const Category: React.FunctionComponent<ICategoryProps> = (props) => {
  const {category: paramCat} = useParams(); 
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
    `)
    .eq('name', paramCat)
    .single();

    if (error) throw error;
    return categoryContent;
  }
  type catContentType = Awaited<ReturnType<typeof getCat>>;
  const [category, setCategory] = useState<catContentType>();

  useEffect(() => {
    if(paramCat){
      getCat()
      .then((catContent) => {
        console.log("prod is good");
        console.log("cat: ", catContent);
        setCategory(catContent)
      })
      .catch((err) => {
        console.log("can't get prod")
        console.log(err);
      })
    }
  }, [paramCat])
  const navigate = useNavigate();
  return (
    <div className='mx-5 py-5 space-y-5'>
      {
        category && category.sub_categories.map((sub) => (
          <div>
            <h1 className='text-xl font-semibold'>{capetalize(sub.name)}</h1>
            <div>
               <Carousel className="w-full max-w-4xl">
                <CarouselContent className='flex gap-2 '>
                    {sub.products.map((prod, index) => (
                      <CarouselItem key={index} className='basis-1/3' onClick={() => navigate(`/product/${prod.id}`)}> 
                        <div className='w-30  flex items-center justify-center flex-col text-center'>
                          <div className='w-25 h-25 border-2 rounded-full flex items-center justify-center'>
                            <img src={prod.thumbnail} alt="this is alt" className='object-contain w-full h-full rounded-full '/>
                          </div>
                          <span className="text-muted font-semibold line-clamp-1">{prod.name}</span>
                        </div>
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
  );
};


export default Category;
