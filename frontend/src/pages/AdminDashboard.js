// src/pages/AdminDashboard.js
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import LogoutButton from '../components/LogoutButton'
import { useAuth } from '../auth/AuthContext'
import Card from '../components/Card'
import { UserGroupIcon } from '@heroicons/react/24/solid'

const AdminDashboard = () => {
  const { user } = useAuth()
  const [users, setUsers] = useState([])
  const [tasks, setTasks] = useState([])

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem('token')
      const res = await axios.get('http://localhost:8000/api/users', {
        headers: { Authorization: `Bearer ${token}` },
      })
      setUsers(res.data)
    }

    const fetchTasks = async () => {
      const token = localStorage.getItem('token')
      const res = await axios.get('http://localhost:8000/api/tasks', {
        headers: { Authorization: `Bearer ${token}` },
      })
      setTasks(res.data)
    }

    fetchUsers()
    fetchTasks()
  }, [])

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-blue-700">Dashboard Admin</h1>
          <LogoutButton />
        </div>

        <p className="mb-6 text-gray-700">
          Bienvenue, <strong>{user?.name}</strong> 👋
        </p>

        <h2 className="text-xl font-semibold mb-4 text-gray-800">Utilisateurs enregistrés</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {users.map((u) => (
            <Card key={u.id} className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg text-gray-800">{u.name}</h3>
                <p className="text-sm text-gray-600">{u.email}</p>
                <span className="inline-block mt-1 px-2 py-1 text-xs font-medium rounded bg-gray-200 text-gray-700">
                  {u.role}
                </span>
              </div>
              <UserGroupIcon className="h-6 w-6 text-gray-400" />
            </Card>
          ))}
        </div>

        <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-800">Toutes les tâches</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {tasks.map((task) => (
            <Card key={task.id} className="flex flex-col justify-between">
              <div>
                <h3 className="font-semibold text-lg text-gray-800">{task.title}</h3>
                <p className="text-sm text-gray-600">{task.description}</p>
                <span className="inline-block mt-1 px-2 py-1 text-xs font-medium rounded bg-gray-200 text-gray-700">
                  {task.status}
                </span>
                <div className="text-xs text-gray-500 mt-1">
                  Assignée à : {task.assigned_to}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard