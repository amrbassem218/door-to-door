import * as React from 'react';
import { MdNavigateNext } from "react-icons/md";
import { useState } from 'react';
import type { Product } from '@/types';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/ui/Header';
import Hero from './hero';
import FolderMenu from './folderMenu';
interface IHomeProps {
}

const Home: React.FunctionComponent<IHomeProps> = (props) => {
  const [topSellingSeeMore, setTopSellingSeeMore] = useState(false);
  const navigate = useNavigate();
  const limit = 6;
  const items: Product[] = [
    {
      name:"L'Oreal Paris Makeup True Match Lumi Glotion",
      thumbnail: 'https://www.lorealparis.com.au/-/media/project/loreal/brand-sites/oap/apac/au/products/makeup/face-makeup/true-match/liquid-foundation/new-images/packshot/05n__pack_closed_front.png',
      images: [],
      price: 499,
      priceBefore: 750,
      id: "111",
    },
    {
      name:"True Match Face Makeup True Match Radiant Serum Concealer",
      thumbnail: 'https://www.loreal-paris.co.uk/-/media/project/loreal/brand-sites/oap/emea/uk/products/makeup/face-makeup/true-match/concealer/radiant-serum-concealer/2023_oap_makeup_true_match_concealer_eu_opened_8n_medium_deep_pack_front-1-(1).png',
      images: [],
      price: 299,
      priceBefore: 350,
      id: "112",
    },
    {
      name:"L'Oreal Paris Makeup True Match Lumi Glotion",
      thumbnail: 'https://www.lorealparis.com.au/-/media/project/loreal/brand-sites/oap/apac/au/products/makeup/face-makeup/true-match/liquid-foundation/new-images/packshot/05n__pack_closed_front.png',
      images: [],
      price: 499,
      priceBefore: 750,
      id: "111",
    },
    {
      name:"True Match Face Makeup True Match Radiant Serum Concealer",
      thumbnail: 'https://www.loreal-paris.co.uk/-/media/project/loreal/brand-sites/oap/emea/uk/products/makeup/face-makeup/true-match/concealer/radiant-serum-concealer/2023_oap_makeup_true_match_concealer_eu_opened_8n_medium_deep_pack_front-1-(1).png',
      images: [],
      price: 299,
      priceBefore: 350,
      id: "112",
    },
    {
      name:"L'Oreal Paris Makeup True Match Lumi Glotion",
      thumbnail: 'https://www.lorealparis.com.au/-/media/project/loreal/brand-sites/oap/apac/au/products/makeup/face-makeup/true-match/liquid-foundation/new-images/packshot/05n__pack_closed_front.png',
      images: [],
      price: 499,
      priceBefore: 750,
      id: "111",
    },
    {
      name:"True Match Face Makeup True Match Radiant Serum Concealer",
      thumbnail: 'https://www.loreal-paris.co.uk/-/media/project/loreal/brand-sites/oap/emea/uk/products/makeup/face-makeup/true-match/concealer/radiant-serum-concealer/2023_oap_makeup_true_match_concealer_eu_opened_8n_medium_deep_pack_front-1-(1).png',
      images: [],
      price: 299,
      priceBefore: 350,
      id: "112",
    },
    {
      name:"L'Oreal Paris Makeup True Match Lumi Glotion",
      thumbnail: 'https://www.lorealparis.com.au/-/media/project/loreal/brand-sites/oap/apac/au/products/makeup/face-makeup/true-match/liquid-foundation/new-images/packshot/05n__pack_closed_front.png',
      images: [],
      price: 499,
      priceBefore: 750,
      id: "111",
    },
    {
      name:"True Match Face Makeup True Match Radiant Serum Concealer",
      thumbnail: 'https://www.loreal-paris.co.uk/-/media/project/loreal/brand-sites/oap/emea/uk/products/makeup/face-makeup/true-match/concealer/radiant-serum-concealer/2023_oap_makeup_true_match_concealer_eu_opened_8n_medium_deep_pack_front-1-(1).png',
      images: [],
      price: 299,
      priceBefore: 350,
      id: "112",
    },
    {
      name:"L'Oreal Paris Makeup True Match Lumi Glotion",
      thumbnail: 'https://www.lorealparis.com.au/-/media/project/loreal/brand-sites/oap/apac/au/products/makeup/face-makeup/true-match/liquid-foundation/new-images/packshot/05n__pack_closed_front.png',
      images: [],
      price: 499,
      priceBefore: 750,
      id: "111",
    },
    {
      name:"True Match Face Makeup True Match Radiant Serum Concealer",
      thumbnail: 'https://www.loreal-paris.co.uk/-/media/project/loreal/brand-sites/oap/emea/uk/products/makeup/face-makeup/true-match/concealer/radiant-serum-concealer/2023_oap_makeup_true_match_concealer_eu_opened_8n_medium_deep_pack_front-1-(1).png',
      images: [],
      price: 299,
      priceBefore: 350,
      id: "112",
    },
  ];
  return (
    <div className='mx-20 max-w-400 mx-auto'>
        {/* Hero */}
        <div className='mb-10'>
          <Hero/>
        </div>
        {/* Top suggestions */}
        {/* Top selling items */}
        <section className='space-y-3 w-full'>

          {/* Top Selling Header */}
          <div className='border-b-1 border-border flex justify-between'>
            <div className='border-b-primary border-b-2 w-fit'>
                <h1 className='text-text text-xl font-semibold'>Grab the <span className='text-primary'>Best Deals</span></h1>
            </div>
            <div className='flex items-center '>
              <button onClick={() => setTopSellingSeeMore(!topSellingSeeMore)} className='hover:underline text-heading cursor-pointer'>{topSellingSeeMore ? "View less" : "View More"}</button>
              <MdNavigateNext size={22} className='text-primary'/>
            </div>
          </div>
          
          {/* Item */}
          <div className='grid grid-cols-12 gap-5'>
            {items.map((item, i) => 
              {
                return (topSellingSeeMore || i < limit) &&
               <div className='lg:col-span-2   md:col-span-3 sm:col-span-5  border-1 rounded-lg transition-transform duration-200 ease-in-out hover:scale-105 cursor-pointer' onClick={() => navigate(`/product/${item.id}`)}>
                {/* Item Image */}
                <div className="w-full h-48 bg-background-secondary rounded-t-lg flex items-center justify-center overflow-hidden">
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
                    <p className='font-bold'>${item.price}</p>
                    <p className='line-through decoration-1'>${item.priceBefore}</p>
                  </div>
                </div>

                {/* Footer */}
                <div className='mx-4 py-2'>
                  <p className='font-semibold text-green-600'>Save - ${item.priceBefore - item.price}</p>
                </div>
              </div>
              }
            )}
          </div>
        </section>
        
    </div>
  );
};

export default Home;
