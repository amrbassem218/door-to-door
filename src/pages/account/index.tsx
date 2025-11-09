import MenuItem from '@/components/ui/menuItem';
import { Separator } from '@/components/ui/separator';
import { useUser } from '@/utils/getUser';
import { getDisplayName } from '@/utils/user-utils';
import { User } from 'lucide-react';
import * as React from 'react';
import { FaAngleRight, FaRegHeart } from "react-icons/fa";
import { LuShoppingCart } from 'react-icons/lu';
import { RiCoupon2Line } from "react-icons/ri";
import { useNavigate } from 'react-router-dom';
interface IAccountProps {
}

const Account: React.FunctionComponent<IAccountProps> = (props) => {
  const user = useUser();
  const navigate = useNavigate();
  return (
    <div className='space-y-5 bg-gray-100'>

      {/* Account info */}
      <section className='px-3 space-y-4 bg-background py-3'>
        {
          user
          ? <div className='flex gap-2 items-center'>
            {/* <User size={60}/> */}
            <div className='w-12 h-12'>
              <img loading="lazy" src={"/avatar.png"} alt="" />
            </div>
            <p className='font-semibold text-lg'>{getDisplayName(user)}</p>
          </div>
          :<div className='flex gap-2'>
            <img loading="lazy" src="/avatar.png" alt="" />
            <p className='font-semibold text-lg'>Sign In / Register</p>
          </div>
        }
        <div className='flex justify-around'>
          {/* Favourites */}
          <div className='flex flex-col items-center gap-2'>
            <FaRegHeart className='text-2xl'/>
            <p className='text-sm'>Favourites</p>
          </div>
          {/* Favourites */}
          <div className='flex flex-col items-center gap-2'>
            <RiCoupon2Line className='text-2xl'/>
            <p className='text-sm'>Coupons</p>
          </div>
          {/* Favourites */}
          <div className='flex flex-col items-center gap-2'>
            <LuShoppingCart className='text-2xl'/>
            <p className='text-sm'>Cart</p>
          </div>
        </div>
      </section>

      {/* Order info */}
      {/* <section className='py-4 pt-7 px-3 space-y-3 bg-background'>
        <div className='flex gap-1 items-center justify-between px-2'>
            <h1 className='text-lg sm:text-xl font-normal'>My Orders</h1>
            <div className='flex gap-1 text-sm items-center'>
                <p>View all</p>
                <FaAngleRight className='text-muted ' size={12}/>
            </div>
        </div>

        <Separator className='my-5'/>

        <div className='flex justify-around'>

          <div className='flex flex-col items-center'>
            <FaRegHeart className='text-2xl'/>
            <p className='text-xs'>Favourites</p>
          </div>
          <div className='flex flex-col items-center'>
            <RiCoupon2Line className='text-2xl'/>
            <p className='text-xs'>Favourites</p>
          </div>
          <div className='flex flex-col items-center'>
            <LuShoppingCart className='text-2xl'/>
            <p className='text-xs'>Favourites</p>
          </div>
        </div>
      </section> */}

      {/* Help Menu */}
      <section className='py-4 px-3 space-y-3 bg-background'>
        <ul>
          <li>
            <MenuItem name='Settings' route={() => navigate('/account/settings')}/>
          </li>
        </ul>
      </section>
    </div>
  );
};

export default Account;
