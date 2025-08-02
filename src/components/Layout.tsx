// src/components/Layout.tsx
import { Outlet } from 'react-router-dom';
import Header from './ui/Header';

export default function Layout() {
  return (
    <>
      <Header />
      <main className=''>
        <Outlet />
      </main>
    </>
  );
}
