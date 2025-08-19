// src/components/Layout.tsx
import { Outlet } from 'react-router-dom';
import Header from './ui/Header';
import BottomBar from './ui/bottomBar';

export default function Layout() {
  return (
    <>
      <Header />
      <main className='mt-35 sm:mt-37'>
        <Outlet />
      </main>
      <BottomBar/>
    </>
  );
}
