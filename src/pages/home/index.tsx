import * as React from 'react';
import { MdNavigateNext } from "react-icons/md";
import { useState, useEffect } from 'react';
import type { Product } from '@/types/types';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/ui/Header';
import Hero from './hero';
import FolderMenu from './folderMenu';
import { convertPrice, getProducts, newPrice } from '@/utilities';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Item from '@/components/ui/item';
import BottomBar from '@/components/ui/bottomBar';
import { useCurrencyRates } from '@/getRates';
import { getProfile, UserContext } from '@/userContext';
interface IHomeProps {
}

const Home: React.FunctionComponent<IHomeProps> = (props) => {
  const [topSellingSeeMore, setTopSellingSeeMore] = useState(false);
  const [items, setItems] = useState<Product[]>();
  const navigate = useNavigate();
  const limit = 6;
  
  useEffect(() => {
    const getProd = async() => {
      let prod = await getProducts();
      if(prod){
        setItems(prod);
      }
    }
    getProd();
  }, [])

  return (
    <div className='mx-auto'>
        {/* <section className='space-y-3 w-full'>

          <div className='border-b-1 border-border flex justify-between'>
            <div className='border-b-primary border-b-2 w-fit'>
                <h1 className='text-muted text-xl font-semibold'>Grab the <span className='text-primary'>Best Deals</span></h1>
            </div>
            <div className='flex items-center '>
              <button onClick={() => setTopSellingSeeMore(!topSellingSeeMore)} className='hover:underline text-heading cursor-pointer'>{topSellingSeeMore ? "View less" : "View More"}</button>
              <MdNavigateNext size={22} className='text-primary'/>
            </div>
          </div>
          
          <div className='grid grid-cols-12 gap-5'>
            {items && items.map((item, i) => 
              {
                return (topSellingSeeMore || i < limit) &&
               <div className='lg:col-span-2   md:col-span-3 sm:col-span-5  border-1 rounded-lg transition-transform duration-200 ease-in-out hover:scale-105 cursor-pointer' onClick={() => navigate(`/product/${item.id}`)}>
                <div className="w-full h-48 bg-background-secondary rounded-t-lg flex items-center justify-center overflow-hidden">
                  <img
                    src={item.thumbnail}
                    alt=""
                    className="object-contain h-full max-w-full"
                  />
                </div>
                
                <div className='mx-4 mt-2 pb-2 border-b-2 space-y-1'>
                  <h1 className='text-lg font-medium'>L'Oreal Paris Makeup True Match Lumi Glotion</h1>
                  <div className='flex gap-2 text-md'>
                    <p className='font-bold'>{newPrice(item)}</p>
                    <p className='line-through decoration-1'>${item.price}</p>
                  </div>
                </div>

                <div className='mx-4 py-2'>
                  <p className='font-semibold text-green-600'>Save - {item.price - newPrice(item)}</p>
                </div>
              </div>
              }
            )}
          </div>
        </section> */}
        <div className='mb-10'>
          <Hero/>
        </div>

        {/* <div className='absolute bottom-0 left-0 w-full'>
          <BottomBar/>
        </div> */}
        <div className='md:mx-20 mx-5'>
          {/* Today's deals */}
          <section className='mb-15 space-y-7'>
            <h1 className='text-center text-3xl font-bold'>Today's deals</h1>
            <div className='grid grid-cols-12 gap-5'>
              {/* Best sellers */}
              <Card className='md:col-span-4 col-span-12 transition-all text-card-foreground'>
                <CardHeader>
                  <CardTitle className='mx-auto text-2xl font-semibold'>
                    Bestsellers
                  </CardTitle>
                  <CardDescription className='mx-auto'>
                    <div className='px-2 w-40 p-1 rounded-md text-center bg-yellow-300'>
                      <p className='text-heading'>Best price & Quality</p>
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className='grid grid-cols-12 gap-2'>
                    {items && items.map((item, i) => 
                      {
                        return (topSellingSeeMore || i < 2) &&
                        <Item item={item} col='md:col-span-6 col-span-12' style='bg-card'/>
                      }
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Big save */}
              <Card className='md:col-span-4 col-span-12 transition-all text-card-foreground'>
                <CardHeader>
                  <CardTitle className='mx-auto text-2xl font-semibold'>
                    Big Save
                  </CardTitle>
                  <CardDescription className='mx-auto'>
                    <div className='px-2 w-40 p-1 rounded-md text-center bg-red-300/80'>
                      <p className='text-heading'>Up to 50% off</p>
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className='grid grid-cols-12 gap-2'>
                    {items && items.map((item, i) => 
                      {
                        return (topSellingSeeMore || i < 2) &&
                        <Item item={item} col='md:col-span-6 col-span-12' style='bg-card'/>
                      }
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Super deals */}
              <Card className='md:col-span-4 col-span-12 transition-all text-card-foreground'>
                <CardHeader>
                  <CardTitle className='mx-auto text-2xl font-semibold'>
                    SuperDeals
                  </CardTitle>
                  <CardDescription className='mx-auto'>
                    <div className='px-2 w-40 p-1 rounded-md text-center bg-red-300'>
                      <p className='text-heading'>Up to 75% off</p>
                    </div>
                  </CardDescription>
                </CardHeader>
                  <CardContent>
                  <div className='grid grid-cols-12 gap-2'>
                    {items && items.map((item, i) => 
                      {
                        return (topSellingSeeMore || i < 2) &&
                        <Item item={item} col='md:col-span-6 col-span-12' style='bg-card'/>
                      }
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* More to love */}
          <section className='space-y-7'>
            <h1 className='text-center text-3xl font-bold '>More to love</h1>
            <div className='grid grid-cols-12 gap-5'>
              {items && items.map((item, i) => 
                (
                  <Item item={item} col='lg:col-span-2 col-span-6'/>
                )
              )}
            </div>
          </section>
        </div>
    </div>
  );
};

export default Home;
