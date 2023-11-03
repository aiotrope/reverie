import React, { lazy } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAtomValue } from 'jotai'

import { jwtAtom } from '../atoms/user'

const Home = lazy(() => import('./Home'))
const About = lazy(() => import('./About'))
const Signup = lazy(() => import('./Signup'))
const Login = lazy(() => import('./Login'))
const Dashboard = lazy(() => import('./Dashboard'))
const NotFound = lazy(() => import('./404'))

const RouterList: React.FC = () => {
  const jwt = useAtomValue(jwtAtom)
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route
        path="/signup"
        element={jwt.access !== '' ? <Navigate to="/dashboard" /> : <Signup />}
      />
      <Route path="/login" element={jwt.access !== '' ? <Navigate to="/dashboard" /> : <Login />} />
      <Route
        path="/dashboard"
        element={jwt.access !== '' ? <Dashboard /> : <Navigate to="/login" />}
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default RouterList
