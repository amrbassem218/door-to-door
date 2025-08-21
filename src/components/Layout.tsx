// src/components/Layout.tsx
import { Outlet, useLocation } from 'react-router-dom';
import Header from './ui/Header';
import BottomBar from './ui/bottomBar';
import { useEffect, useState } from 'react';

export default function Layout() {
  const location = useLocation();
  const noHeader = ["settings"]
  const [showHeader, setShowHeader] = useState(true);
  useEffect(() => {
    if(location){
      setShowHeader(true);
      noHeader.forEach((ban) => {
        if(location.pathname.includes(ban)){
          setShowHeader(false);
        }
      })
    }
  }, [location])
  return (
    <>
      {
        showHeader &&
        <Header />
      }
      <main className={`${showHeader && "mt-35 sm:mt-37"}`}>
        <Outlet />
      </main>
      <BottomBar/>
    </>
  );
}
