import * as React from 'react';
import { RiMenu2Fill } from "react-icons/ri";
import { IoSearchOutline } from "react-icons/io5";
import { Input } from './input';
import { IoFilter } from "react-icons/io5";
import { Button } from './button';
import { CiUser } from "react-icons/ci";
import { CiLogin } from "react-icons/ci";

interface IHeaderProps {
}

const Header: React.FunctionComponent<IHeaderProps> = (props) => {
  const handleFilter = () => {
    console.log("filtered");
  }
  return (
  <div className='flex grid-cols-12 border-b-1 border-border w-full h-20 items-center px-20 justify-between'>
    <div className='flex items-center gap-2 '>
      <Button className='cursor-pointer bg-background-secondary-3 p-2 rounded-md' variant={'link'}>
        <RiMenu2Fill size={20} className='text-primary'/>
      </Button>
      <button className='cursor-pointer text-primary font-semibold'>LOGO NAME</button>
    </div>
    <div className='justify-center relative h-10 bg-background-secondary-3 w-120 flex items-center gap-1 rounded-md'>
      <IoSearchOutline className='text-primary absolute left-2' size={18}/>
      <Input type="text" placeholder='Search Essentials, crops and more...' className='w-full border-0 px-8' />
      <Button className='cursor-pointer absolute right-0' variant={'link'} onClick={() => handleFilter()}>
        <IoFilter className='text-primary'/>
      </Button>
    </div>
    <div className='flex gap-3 justify-center '>
      <Button className='w-25 cursor-pointer'>
        <CiLogin size={20} className=''/>
        <p>Login</p>
      </Button>
      <Button className='w-25 cursor-pointer hover:bg-gray-200' variant={'secondary'}>
        <CiLogin size={20} className=''/>
        <p>Signup</p>
      </Button>
      
    </div>
  </div>
  );
};

export default Header;
