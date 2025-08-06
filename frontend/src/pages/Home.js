import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-blue-100">
      <div className="bg-white shadow-lg p-10 rounded-lg text-center w-full max-w-lg">
        <h1 className="text-3xl font-bold text-blue-700 mb-4">Bienvenue sur GesTask 🎯</h1>
        <p className="text-gray-700 mb-6">
          Une solution simple et efficace pour gérer les tâches selon les rôles.
        </p>
        <Link
          to="/login"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded shadow-md transition"
        >
          Se connecter
        </Link>
      </div>
    </div>
  )
}

export default Home
