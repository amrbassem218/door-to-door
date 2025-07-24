import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Header from './components/ui/Header'
import TopBar from './components/ui/topbar'
import { RouterProvider } from 'react-router-dom'
import { router } from './router'

function App() {
  return (
    <div className='w-full'>
      <RouterProvider router={router}/>
    </div>
  )
}

export default App
