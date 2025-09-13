import * as React from 'react';
import { IoHomeOutline } from "react-icons/io5";
import { FaHome } from "react-icons/fa";
import { BiCategory } from "react-icons/bi";
import { LuShoppingCart, LuUser } from 'react-icons/lu';
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
interface IBottomBarProps {
}

const BottomBar: React.FunctionComponent<IBottomBarProps> = (props) => {
  const [activeTab, setActiveTab] = useState("home");
  const navigate = useNavigate();
  const location = useLocation();
  const tabs = ["home", "categories", "cart", "account"]
  useEffect(() => {
    setActiveTab("home");
    tabs.forEach(tab => {
      if(location.pathname.includes(tab)){
        setActiveTab(tab);
      }
    })
  }, [location.pathname])
  const handleNavigationClick = (tabName: string, path: string) => {
    setActiveTab(tabName);
    navigate(path);
  }
  return (
    <div className='sm:hidden fixed bottom-0 left-0 h-12 border-t-1 w-full bg-background flex items-center gap-4 px-2 border-1 shadow-sm'>
      <div className='flex justify-around w-full text-[1.75rem]'>
          {/* Home */}
          <div className={`flex flex-col items-center ${activeTab == "home" ? "text-primary/80" : "text-muted"}`} onClick={() => handleNavigationClick("home", "/")}>
            <FaHome/>
            <p className='text-xs'>Home</p>
          </div>

          {/* Categories */}
          <div className={`flex flex-col items-center  ${activeTab == "categories" ? "text-primary/80" : "text-muted"}`} onClick={() => handleNavigationClick("categories", "/categories")}>
            <BiCategory />
            <p className='text-xs'>Categories</p>
          </div>

          {/* Cart */}
          <div className={`flex flex-col items-center  ${activeTab == "cart" ? "text-primary/80" : "text-muted"}`} onClick={() => handleNavigationClick("cart", "/cart")}>
            <LuShoppingCart/>
            <p className='text-xs'>Cart</p>
          </div>

          {/* Account */}
          <div className={`flex flex-col items-center  ${activeTab == "account" ? "text-primary/80" : "text-muted"}`} onClick={() => handleNavigationClick("account", "/account")}>
            <LuUser/>
            <p className='text-xs'>Account</p>
          </div>
      </div>
    </div>
  );
};

export default BottomBar;
