import * as React from 'react';

interface ITopSellingItemsStripProps {
}

const TopSellingItemsStrip: React.FunctionComponent<ITopSellingItemsStripProps> = (props) => {
  return (
    
        <section className='space-y-3 w-full'>

          {/* Top Selling Header */}
          <div className='border-b-1 border-border flex justify-between'>
            <div className='border-b-primary border-b-2 w-fit'>
                <h1 className='text-muted text-xl font-semibold'>Grab the <span className='text-primary'>Best Deals</span></h1>
            </div>
            <div className='flex items-center '>
              <button onClick={() => setTopSellingSeeMore(!topSellingSeeMore)} className='hover:underline text-heading cursor-pointer'>{topSellingSeeMore ? "View less" : "View More"}</button>
              <MdNavigateNext size={22} className='text-primary'/>
            </div>
          </div>
          
          {/* Item */}
          <div className='grid grid-cols-12 gap-5'>
            {items && items.map((item, i) => 
              {
                return (topSellingSeeMore || i < limit) &&
               <div className='lg:col-span-2   md:col-span-3 sm:col-span-5  border-1 rounded-lg transition-transform duration-200 ease-in-out hover:scale-105 cursor-pointer' onClick={() => navigate(`/product/${item.id}`)}>
                {/* Item Image */}
                <div className="w-full h-48 bg-background-secondary rounded-t-lg flex items-center justify-center overflow-hidden">
                  <img loading="lazy"
                    src={item.thumbnail}
                    alt=""
                    className="object-contain h-full max-w-full"
                  />
                </div>
                
                {/* Item Description */}
                <div className='mx-4 mt-2 pb-2 border-b-2 space-y-1'>
                  <h1 className='text-lg font-medium'>L'Oreal Paris Makeup True Match Lumi Glotion</h1>
                  <div className='flex gap-2 text-md'>
                    <p className='font-bold'>{newPrice(item)} {userCurrency}</p>
                    <p className='line-through decoration-1'>${item.price}</p>
                  </div>
                </div>

                {/* Footer */}
                <div className='mx-4 py-2'>
                  <p className='font-semibold text-green-600'>Save - {item.price - newPrice(item)} {userCurrency}</p>
                </div>
              </div>
              }
            )}
          </div>
        </section>
        
  );
};

export default TopSellingItemsStrip;
