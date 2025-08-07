// src/pages/Register.js
import React, { useState } from 'react'
import axios from '../api/axios' // Utiliser votre instance personnalisée
import { useNavigate } from 'react-router-dom'
import Input from '../components/Input'
import Label from '../components/Label'
import PrimaryButton from '../components/PrimaryButton'

const Register = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'employee',
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')
    try {
      await axios.post('/register', form)
      setSuccess("Inscription réussie ! Vérifiez votre email.")
      // Optionnel : navigate('/login')
    } catch (err) {
      setError("Erreur lors de l'inscription.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-blue-100">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-purple-700 mb-6">
          Inscription GesTask
        </h2>

        {error && <div className="text-red-600">{error}</div>}
        {success && <div className="text-green-600">{success}</div>}

        <form onSubmit={handleSubmit}>
          <Label>Nom</Label>
          <Input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Votre nom complet"
            required
            disabled={loading}
          />

          <Label>Email</Label>
          <Input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="votre@email.com"
            required
            disabled={loading}
          />

          <Label>Mot de passe</Label>
          <Input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="••••••••"
            required
            disabled={loading}
            minLength="6"
          />

          <Label>Rôle</Label>
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded mb-4 focus:outline-none focus:border-purple-500"
            required
            disabled={loading}
          >
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="employee">Employé</option>
          </select>

          <PrimaryButton 
            type="submit" 
            className="w-full" 
            disabled={loading}
          >
            {loading ? 'Inscription en cours...' : "S'inscrire"}
          </PrimaryButton>
        </form>

        <p className="text-center text-sm mt-4">
          Déjà inscrit ? <a href="/login" className="text-purple-600 hover:underline">Se connecter</a>
        </p>
      </div>
    </div>
  )
}

export default Register