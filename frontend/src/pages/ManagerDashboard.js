// ...existing code...
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import LogoutButton from '../components/LogoutButton'
import { useAuth } from '../auth/AuthContext'
import Card from '../components/Card'
import PrimaryButton from '../components/PrimaryButton'
import { ClipboardDocumentCheckIcon } from '@heroicons/react/24/outline'

// Renomme le composant pour correspondre au nom du fichier
const ManagerDashboard = () => {
  const [tasks, setTasks] = useState([])
  const [employees, setEmployees] = useState([])
  const [newTask, setNewTask] = useState({ title: '', description: '', employeeId: '' })
  const { user } = useAuth()

  useEffect(() => {
    const token = localStorage.getItem('token')
    // Récupère les tâches du manager
    axios.get('http://localhost:8000/api/manager-tasks', {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => setTasks(res.data))

    // Récupère la liste des employés
    axios.get('http://localhost:8000/api/employees', {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => setEmployees(res.data))
  }, [])

  // Assigner une tâche à un employé
  const assignTask = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem('token')
    await axios.post('http://localhost:8000/api/tasks', newTask, {
      headers: { Authorization: `Bearer ${token}` },
    })
    setNewTask({ title: '', description: '', employeeId: '' })
    // Optionnel : rafraîchir la liste des tâches
  }

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
          <h1 className="text-3xl font-bold text-purple-700">Dashboard Manager</h1>
          <LogoutButton />
        </div>

        <p className="mb-6 text-gray-700">
          Bienvenue, <strong>{user?.name}</strong> 👋
        </p>

        <h2 className="text-xl font-semibold mb-4 text-gray-800">Tâches assignées</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {tasks.map((task) => (
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

        <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-800">Liste des employés</h2>
        <ul className="mb-6">
          {employees.map(emp => (
            <li key={emp.id} className="text-gray-700">
              {emp.name} ({emp.email})
            </li>
          ))}
        </ul>

        <h2 className="text-xl font-semibold mb-4 text-gray-800">Assigner une tâche</h2>
        <form onSubmit={assignTask} className="bg-white p-4 rounded-lg shadow-md mb-8">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <input
              type="text"
              placeholder="Titre de la tâche"
              value={newTask.title}
              onChange={e => setNewTask({ ...newTask, title: e.target.value })}
              required
              className="p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Description de la tâche"
              value={newTask.description}
              onChange={e => setNewTask({ ...newTask, description: e.target.value })}
              required
              className="p-2 border rounded"
            />
            <select
              value={newTask.employeeId}
              onChange={e => setNewTask({ ...newTask, employeeId: e.target.value })}
              required
              className="p-2 border rounded"
            >
              <option value="">Choisir un employé</option>
              {employees.map(emp => (
                <option key={emp.id} value={emp.id}>{emp.name}</option>
              ))}
            </select>
          </div>
          <PrimaryButton type="submit" className="mt-4">
            Assigner la tâche
          </PrimaryButton>
        </form>
      </div>
    </div>
  )
}

export default ManagerDashboard
// ...existing code...