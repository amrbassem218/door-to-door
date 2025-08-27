// src/components/Layout.tsx
import { Outlet, useLocation } from 'react-router-dom';
import Header from './ui/Header';
import BottomBar from './ui/bottomBar';
import { useEffect, useState } from 'react';
import { Toaster } from 'sonner';

export default function Layout() {
  const location = useLocation();
  const noHeader = ["settings"]
  const noFooter = ["location"]
  const noBottomBar = ["location"]
  const noSearch = ["location"]
  const [showHeader, setShowHeader] = useState(true);
  const [showBottomBar, setShowBottomBar] = useState(true);
  const [showFooter, setShowFooter] = useState(true);
  const [showSearch, setShowSearch] = useState(true);
  useEffect(() => {
    if(location){
      setShowHeader(true);
      setShowBottomBar(true);
      setShowFooter(true);
      setShowSearch(true);
      noHeader.forEach((ban) => {
        if(location.pathname.includes(ban)){
          setShowHeader(false);
        }
      })
      noFooter.forEach((ban) => {
        if(location.pathname.includes(ban)){
          setShowFooter(false);
        }
      })
      noBottomBar.forEach((ban) => {
        if(location.pathname.includes(ban)){
          setShowBottomBar(false);
        }
      })
      noSearch.forEach((ban) => {
        if(location.pathname.includes(ban)){
          setShowSearch(false);
        }
      })
    }
  }, [location])
  return (
    <div className='flex'>
      {
        showHeader &&
        <Header showSearch={showSearch}/>
      }
      <main className={`${showHeader && (showSearch ? "mt-27 sm:mt-37" : "mt-17 sm:mt-27")} flex-1 mb-12`}>
        <Outlet />
      </main>
      {
      showBottomBar &&        
      <BottomBar/>
      }
      <Toaster position="top-center" richColors closeButton />
      
    </div>
  );
}
