import * as React from 'react';
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { IoIosMenu } from "react-icons/io";
import { FaAngleRight, FaHome } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { Separator } from './separator';
import { CiLocationOn } from "react-icons/ci";
import { HiOutlineCurrencyDollar } from "react-icons/hi2";
import { GrLanguage } from "react-icons/gr";
import { BiSupport } from "react-icons/bi";
import { useState, useEffect } from 'react';
interface IMenuProps {
}

const Menu: React.FunctionComponent<IMenuProps> = (props) => {
  const navigate = useNavigate();
  const popularCategories = [
    { name: "Men Clothes", image: "/product_pics/men_clothes/2.jpg" },
    { name: "Crops", image: "/product_pics/crops/fresh fruits/strawberry.webp" },
    { name: "Carpets", image: "https://png.pngtree.com/png-clipart/20230526/ourmid/pngtree-persian-modern-carpet-png-image_7109855.png" },
    { name: "Office Chairs", image: "https://png.pngtree.com/png-vector/20240203/ourmid/pngtree-black-office-chair-png-image_11537176.png" },
    { name: "Pottery bottles", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKU8Y6ujZXo2nkeK0FQvrHuSNz1RtO-PTYOg&s" },
    { name: "Jewelry & Accessories", image: "https://png.pngtree.com/png-clipart/20250416/original/pngtree-elegant-gold-plated-bridal-jewelry-set-png-image_20781575.png" }
  ];
  const [open, setOpen] = useState(false);
  const handleNavigationClick = (path: string) => {
    setOpen(false);
    navigate(path);
    
  }
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger>
        <IoIosMenu className='text-2xl text-primary-foreground'/>
      </SheetTrigger>
      <SheetContent side='left' className='gap-0' >
        <SheetHeader>
          <SheetTitle className='flex gap-2 items-center'>
            <h1 className='cursor-pointer text-primary font-semibold lg:text-3xl text-xl' onClick={() => navigate('/')}>EGEEX</h1>
          </SheetTitle>
          <Separator className=''/>
        </SheetHeader>

        {/* Popular Categories */}
        <div className='mx-2 space-y-10'>
          <div className='space-y-4'>
            <div className='flex justify-between items-center ' onClick={() => handleNavigationClick('/categories')}>
              <h1 className='font-semibold text-xl '>Popular Categories</h1>
              <FaAngleRight className='text-xl'/>
            </div>
            <div className='space-y-2'>
              {popularCategories.map((cat) => (
                <button className='flex gap-4 items-center' onClick={() => handleNavigationClick(`/search/${cat.name}`)}>
                  <div className='w-10 h-10'>
                    <img loading="lazy" src={cat.image} alt=""  className='object-contain w-full max-h-full'/>
                  </div>
                  <p>{cat.name}</p>
                </button>
              ))}
            </div>
          </div>


          <div className='space-y-4'>
            <div className='flex justify-between items-center ' onClick={() => handleNavigationClick('/account/settings')}>
              <h1 className='font-semibold text-xl '>Settings</h1>
              <FaAngleRight className='text-xl'/>
            </div>
            <div className='space-y-4'>
              <div onClick={() => handleNavigationClick('/location')}>
                <button className='flex gap-4 items-center'>
                  <CiLocationOn className='text-2xl '/>
                  <p>Ship to</p>
                </button>
              </div>

              <div onClick={() => handleNavigationClick('/account/settings/currency')}>
                <button className='flex gap-4 items-center'>
                  <HiOutlineCurrencyDollar className='text-2xl '/>
                  <p>Currency</p>
                </button>
              </div>
              
              <div onClick={() => handleNavigationClick('/account/settings/language')}>
                <button className='flex gap-4 items-center'>
                  <GrLanguage className='text-xl '/>
                  <p>Language</p>
                </button>
              </div>
              
              <div onClick={() => handleNavigationClick('/support')}>
                <button className='flex gap-4 items-center'>
                  <BiSupport className='text-xl '/>
                  <p>Contact Support</p>
                </button>
              </div>
              
            </div>
          </div>
        </div>
        
        
      </SheetContent>
    </Sheet>
  );
};

export default Menu;
