import * as React from 'react';
import { RiMenu2Fill } from "react-icons/ri";
import { IoSearchOutline } from "react-icons/io5";
import { Input } from './input';
import { IoFilter } from "react-icons/io5";
import { Button } from './button';
import { CiUser } from "react-icons/ci";
import { CiLogin } from "react-icons/ci";
import TopicBar from './topicBar';
import { useNavigate } from 'react-router-dom';
import TopBar from './topbar';
import { useSearch } from '@/searchContext';
import { useState, useEffect, useRef } from 'react';
import { LuUser } from "react-icons/lu";
import { IoCartOutline } from "react-icons/io5";
import Sign from '../sign';
import SearchBar from './searchBar';

interface IHeaderProps {
  
}

const Header: React.FunctionComponent<IHeaderProps> = (props) => {
  const navigate = useNavigate();
  return (
    <div className='relative'>
      <TopBar/>
      <div className='grid-cols-12 border-border w-full '>
        <div className='px-20  mx-auto'>
          <div className='flex items-center justify-between w-full h-20'>

            {/* Logo & Menu */}
            <div className='flex items-center gap-2 '>
              {/* <Button className='cursor-pointer bg-background-secondary-3 p-2 rounded-md' variant={'link'}>
                <RiMenu2Fill size={20} className='text-primary'/>
              </Button> */}
              <button className='cursor-pointer text-primary font-semibold text-3xl' onClick={() => navigate('/')}>Door2Door</button>
            </div>
            <div className='flex-1 border-1 border-black'>
              <SearchBar styles='width-screen'/>

            </div>

            {/* Cart & Sign */}
            <div className='flex gap-3'>
              <div className='flex gap-1 items-center pr-5 border-r-1'>
                <LuUser className='text-primary' size={20}/>
                <Sign/>
              </div>
              <div className='flex gap-1 items-center'>
                <IoCartOutline className='text-primary' size={20}/>
                <button className='text-text font-medium hover:text-primary hover:underline' onClick={() => navigate('/cart')}>Cart</button>
              </div>
            </div>
          </div>
          <div className='absolute left-0 w-screen border-b-1'></div>
          {/* <TopicBar/> */}
          <div className='absolute left-0 w-screen border-b-1'></div>
        </div>
        {/* <div className='flex gap-3 justify-center '>
          <Button className='w-25 cursor-pointer'>
          <CiLogin size={20} className=''/>
          <p>Login</p>
          </Button>
          <Button className='w-25 cursor-pointer hover:bg-gray-200' variant={'secondary'}>
          <CiLogin size={20} className=''/>
          <p>Signup</p>
          </Button>
          </div> */}
      </div>
    </div>
  );
};

export default Header;
