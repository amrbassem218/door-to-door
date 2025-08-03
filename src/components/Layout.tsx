// src/components/Layout.tsx
import { Outlet } from 'react-router-dom';
import Header from './ui/Header';

export default function Layout() {
  return (
    <>
      <Header />
      <main className='mt-15 sm:mt-37'>
        <Outlet />
      </main>
    </>
  );
}
