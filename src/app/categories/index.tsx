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
import { useSearch } from '@/contexts/searchContext';
interface ICategoryProps {
}

const Categories: React.FunctionComponent<ICategoryProps> = (props) => {
  const search = useSearch();

  const getCat = async() => {
    const { data: categoryContent, error } = await supabase
    .from('categories')
    .select(`
      name
    `);

    if (error) throw error;
    return categoryContent;
  }
  // type catContentType = Awaited<ReturnType<typeof getCat>>;
  const [categories, setCategories] = useState<string[]>([]);
  const [subCategories, setSubCategories] = useState<Record<string, Product[]>>({});
  useEffect(() => {
    getCat()
    .then(async(catContent) => {
      const catsTemp = catContent.map((c) => c.name);
      setCategories(catsTemp);
      catsTemp.forEach((cat) => {
        search.searchProducts(cat).then((prods) => {
          let tempSub = subCategories;
          tempSub[cat] = prods;
          setSubCategories(tempSub);
        })
      })
    })
    .catch((err) => {
      console.log("can't get prod")
      console.log(err);
    })
  }, [])
  const navigate = useNavigate();
  return (
    <div className='overflow-hidden hidden  '>
      {
        // Object.keys(subCategories).map((cat) => (
        //   <div key={cat} className='mx-5 py-5 '>
        //     <h1 className='font-bold text-lg'>{cat}</h1>
        //     <div className='space-y-5'>
        //       {
        //       subCategories[cat].map((sub) => (
        //         <div key={sub.name} className='sm:text-center sm:flex sm:items-center sm:flex-col sm:w-full'>
        //           {
        //             subCategories[sub].length > 0 &&
        //             <div>
        //               <h1 className='text-xl font-semibold'>{capetalize(sub)}</h1>
        //               <div className=''>
        //                 <Carousel className="w-full ">
        //                   <CarouselContent className='flex gap-2 w-full'>
        //                       {Object.values(subCategories).map((prod, index) => (
        //                         <CarouselItem key={index} className='basis-1/3 max-w-30' onClick={() => navigate(`/product/${prod.id}`)}> 
        //                           <button className='w-30 flex items-center justify-center flex-col text-center'>
        //                             <div className='w-25 h-25 border-2 rounded-full flex items-center justify-center'>
        //                               <img loading="lazy" src={prod.thumbnail} alt="this is alt" className='object-contain w-full h-full rounded-full '/>
        //                             </div>
        //                             <span className="text-muted font-semibold line-clamp-1">{prod.name}</span>
        //                           </button>
        //                         </CarouselItem>
        //                       ))}
        //                   </CarouselContent>
        //                   <CarouselPrevious />
        //                   <CarouselNext />
        //                 </Carousel>
        //               </div>
        //             </div>

        //           }
        //         </div>
        //       ))
        //     }
        //     </div>
            
        //   </div>
        // ))
      }
    </div>
  );
};


export default Categories;
