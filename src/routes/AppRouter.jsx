import { Routes, Route } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute.jsx'
import PublicRoute from './PublicRoute.jsx'
import MainLayout from '../layouts/MainLayout.jsx'

import Login from '../pages/Login/Login.jsx'
import Register from '../pages/Register/Register.jsx'
import Home from '../pages/Home/Home.jsx'
import Explore from '../pages/Explore/Explore.jsx'
import GameDetail from '../pages/GameDetail/GameDetail.jsx'
import Library from '../pages/Library/Library.jsx'
import Collections from '../pages/Collections/Collections.jsx'
import CollectionDetail from '../pages/CollectionDetail/CollectionDetail.jsx'
import Profile from '../pages/Profile/Profile.jsx'
import Stats from '../pages/Stats/Stats.jsx'
import NotFound from '../pages/NotFound/NotFound.jsx'

export default function AppRouter() {
  return (
    <Routes>
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Register />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/explorar" element={<Explore />} />
          <Route path="/juego/:id" element={<GameDetail />} />
          <Route path="/biblioteca" element={<Library />} />
          <Route path="/colecciones" element={<Collections />} />
          <Route path="/colecciones/:id" element={<CollectionDetail />} />
          <Route path="/perfil" element={<Profile />} />
          <Route path="/estadisticas" element={<Stats />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
