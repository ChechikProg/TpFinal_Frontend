import { Outlet } from 'react-router-dom'
import Navbar from '../components/layout/Navbar.jsx'
import './MainLayout.css'

export default function MainLayout() {
  return (
    <>
      <Navbar />
      <main className="main-layout">
        <Outlet />
      </main>
    </>
  )
}
