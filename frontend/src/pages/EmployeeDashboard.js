// src/pages/EmployeeDashboard.js
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import LogoutButton from '../components/LogoutButton'
import { useAuth } from '../auth/AuthContext'
import Card from '../components/Card'
import PrimaryButton from '../components/PrimaryButton'
import { ClipboardDocumentCheckIcon } from '@heroicons/react/24/outline'

const EmployeeDashboard = () => {
  const [tasks, setTasks] = useState([])
  const { user } = useAuth()

  useEffect(() => {
    const token = localStorage.getItem('token')
    axios
      .get('http://localhost:8000/api/my-tasks', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setTasks(res.data))
  }, [])

  const completedTasks = tasks.filter((t) => t.status === 'completed')
  const pendingTasks = tasks.filter((t) => t.status !== 'completed')

  const markAsDone = async (taskId) => {
    const token = localStorage.getItem('token')
    await axios.put(
      `http://localhost:8000/api/tasks/${taskId}/complete`, // Correction ici
      {},
      { headers: { Authorization: `Bearer ${token}` } } // Correction ici
    )
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, status: 'completed' } : task
      )
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-purple-700">Dashboard Employé</h1>
          <LogoutButton />
        </div>

        <p className="mb-6 text-gray-700">
          Bienvenue, <strong>{user?.name}</strong> 👋
        </p>

        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Tâches à réaliser
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {pendingTasks.map((task) => (
            <Card key={task.id} className="flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-800">{task.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                <span
                  className={`inline-block px-2 py-1 text-xs font-medium rounded ${
                    task.status === 'completed'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {task.status}
                </span>
              </div>
              {task.status !== 'completed' && (
                <PrimaryButton
                  onClick={() => markAsDone(task.id)}
                  className="mt-4 flex items-center gap-2"
                >
                  <ClipboardDocumentCheckIcon className="w-6 h-6 text-green-500" />
                  Marquer comme terminée
                </PrimaryButton>
              )}
            </Card>
          ))}
        </div>

        <h2 className="text-xl font-semibold mb-4 text-gray-800 mt-8">
          Tâches réalisées
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {completedTasks.map((task) => (
            <Card key={task.id} className="flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-800">{task.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                <span className="inline-block px-2 py-1 text-xs font-medium rounded bg-green-100 text-green-800">
                  {task.status}
                </span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

export default EmployeeDashboard