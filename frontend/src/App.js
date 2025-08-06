// src/App.js
import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import AdminDashboard from './pages/AdminDashboard'
import ManagerDashboard from './pages/ManagerDashboard'
import EmployeeDashboard from './pages/EmployeeDashboard'
import Home from './pages/Home'
import { useAuth } from './auth/AuthContext'

function App() {
  const { user, loading } = useAuth()

  // Attendre que le loading soit terminé
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    )
  }

  return (
    <Routes>
      {/* Route d'accueil */}
      <Route path="/" element={user ? <Navigate to={getDashboardRoute(user.role)} /> : <Home />} />
      
      {/* Routes publiques (non connecté uniquement) */}
      <Route 
        path="/login" 
        element={user ? <Navigate to={getDashboardRoute(user.role)} /> : <Login />} 
      />
      <Route 
        path="/register" 
        element={user ? <Navigate to={getDashboardRoute(user.role)} /> : <Register />} 
      />

      {/* Routes protégées (connecté uniquement) */}
      <Route 
        path="/admin/dashboard" 
        element={
          user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/login" />
        } 
      />
      <Route 
        path="/manager/dashboard" 
        element={
          user?.role === 'manager' ? <ManagerDashboard /> : <Navigate to="/login" />
        } 
      />
      <Route 
        path="/employee/dashboard" 
        element={
          user?.role === 'employee' ? <EmployeeDashboard /> : <Navigate to="/login" />
        } 
      />

      {/* Route catch-all */}
      <Route 
        path="*" 
        element={
          user ? <Navigate to={getDashboardRoute(user.role)} /> : <Navigate to="/login" />
        } 
      />
    </Routes>
  )
}

// Fonction helper pour obtenir la route du dashboard selon le rôle
function getDashboardRoute(role) {
  switch (role) {
    case 'admin':
      return '/admin/dashboard'
    case 'manager':
      return '/manager/dashboard'
    case 'employee':
      return '/employee/dashboard'
    default:
      return '/login'
  }
}

export default App