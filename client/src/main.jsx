import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import './index.css'
import Chatbot from './components/Chatbot'
import axios from 'axios'
import { API_BASE_URL } from './config'

// Configure Axios Defaults
axios.defaults.baseURL = API_BASE_URL;

import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Auctions from './pages/Auctions'
import CreateAuction from './pages/CreateAuction'
import Login from './pages/Login'
import Register from './pages/Register'
import Checkout from './pages/Checkout'
import InvoicePage from './pages/Invoice'
import Dashboard from './pages/Dashboard'
import AdminDashboard from './pages/AdminDashboard'
import ProductDetails from './pages/ProductDetails'
import Terms from './pages/Terms'
import Privacy from './pages/Privacy'
import Cookies from './pages/Cookies'
import CompleteProfile from './pages/CompleteProfile'
import PaymentStatus from './pages/PaymentStatus'
import Footer from './components/Footer'

// Protected Route Component
import { useContext } from 'react'
import AuthContext from './context/AuthContext'

const ProtectedRoute = ({ children, roles = [] }) => {
  const { user, loading } = useContext(AuthContext)

  if (loading) return <div className="p-10 text-center">Loading...</div>
  if (!user) return <Navigate to="/login" />
  if (roles.length > 0 && !roles.includes(user.role) && user.role !== 'admin') {
    return <Navigate to="/" />
  }

  const isCompleteProfilePath = window.location.pathname === '/complete-profile'
  if (user.needsProfileUpdate && !isCompleteProfilePath) {
    return <Navigate to="/complete-profile" />
  }

  return children
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <Toaster position="top-center" />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/auctions' element={<Auctions />} />
          <Route path='/auctions/:id' element={<ProductDetails />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/complete-profile' element={
            <ProtectedRoute>
              <CompleteProfile />
            </ProtectedRoute>
          } />

          {/* Protected Routes */}
          <Route path='/dashboard' element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />

          <Route path='/create' element={
            <ProtectedRoute roles={['seller']}>
              <CreateAuction />
            </ProtectedRoute>
          } />

          <Route path='/checkout/:id' element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          } />

          <Route path='/invoice/:id' element={
            <ProtectedRoute>
              <InvoicePage />
            </ProtectedRoute>
          } />

          {/* Payment Status Routes */}
          <Route path='/checkout/success' element={<PaymentStatus type="success" />} />
          <Route path='/checkout/failed' element={<PaymentStatus type="failed" />} />

          <Route path='/admin' element={
            <ProtectedRoute roles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path='/cookies' element={<Cookies />} />
          <Route path='/terms' element={<Terms />} />
          <Route path='/privacy' element={<Privacy />} />

        </Routes>
        <Footer />
        <Chatbot />
      </AuthProvider>
    </BrowserRouter>
  )
}

createRoot(document.getElementById('root')).render(<App />)
