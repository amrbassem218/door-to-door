import * as React from 'react';
import { IoHomeOutline } from "react-icons/io5";
import { FaHome } from "react-icons/fa";
import { BiCategory } from "react-icons/bi";
import { LuShoppingCart, LuUser } from 'react-icons/lu';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
interface IBottomBarProps {
}

const BottomBar: React.FunctionComponent<IBottomBarProps> = (props) => {
  const [activeTab, setActiveTab] = useState(0);
  const navigate = useNavigate();
  const items = [<FaHome onClick={() => navigate('/')}/>, <BiCategory onClick={() => navigate('/categories')}/>, <LuShoppingCart onClick={() => navigate('/cart')}/>, <LuUser onClick={() => navigate('/user')}/>];
  return (
    <div className='sm:hidden fixed bottom-0 left-0 h-15 border-t-1 w-full bg-background flex items-center gap-4 px-2 border-1 shadow-sm'>
      <div className='flex justify-around w-full text-[1.75rem]'>
        {items.map((item, i) => {
          return (
            <div className={`${activeTab == i ? "text-red-700" : "text-text"}`} onClick={() => setActiveTab(i)}>
              {item}
            </div>
          )
        })}
      </div>
    </div>
  );
};

export default BottomBar;
