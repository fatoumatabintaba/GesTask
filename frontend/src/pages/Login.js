// src/pages/Login.js
import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import Input from '../components/Input'
import Label from '../components/Label'
import PrimaryButton from '../components/PrimaryButton'
import { useAuth } from '../auth/AuthContext'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { setUser } = useAuth()
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post('http://localhost:8000/api/login', {
        email,
        password,
      })

      const { token, user } = res.data

      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
      setUser(user)

      // Redirection selon le rôle
      if (user.role === 'admin') navigate('/admin/dashboard')
      else if (user.role === 'manager') navigate('/manager/dashboard')
      else if (user.role === 'employee') navigate('/employee/dashboard')
      else navigate('/')
    } catch (err) {
      setError('Email ou mot de passe incorrect.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">
          Connexion à GesTask
        </h2>

        {error && <p className="text-red-600 text-sm mb-4 text-center">{error}</p>}

        <form onSubmit={handleLogin}>
          <Label>Email</Label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="exemple@email.com"
            required
          />

          <Label>Mot de passe</Label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />

          <PrimaryButton type="submit" className="w-full mt-4">Se connecter</PrimaryButton>
        </form>

        <p className="text-center text-sm mt-4">
          Pas encore de compte ? <a href="/register" className="text-blue-600 hover:underline">S’inscrire</a>
        </p>
      </div>
    </div>
  )
}

export default Login
