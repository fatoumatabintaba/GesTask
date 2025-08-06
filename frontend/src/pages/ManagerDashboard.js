import React, { useEffect, useState } from 'react'
import axios from 'axios'
import LogoutButton from '../components/LogoutButton'
import { useAuth } from '../auth/AuthContext'
import Label from '../components/Label'
import Input from '../components/Input'
import PrimaryButton from '../components/PrimaryButton'
import Card from '../components/Card'
import { UserCircleIcon } from '@heroicons/react/24/solid'

const ManagerDashboard = () => {
  const { user } = useAuth()
  const [employees, setEmployees] = useState([])
  const [tasks, setTasks] = useState([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [assignedTo, setAssignedTo] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token')

      const usersRes = await axios.get('http://localhost:8000/api/users', {
        headers: { Authorization: `Bearer ${token}` },
      })
      const employeesOnly = usersRes.data.filter(u => u.role === 'employee')
      setEmployees(employeesOnly)

      const tasksRes = await axios.get('http://localhost:8000/api/tasks', {
        headers: { Authorization: `Bearer ${token}` },
      })
      setTasks(tasksRes.data)
    }

    fetchData()
  }, [])

  const handleCreateTask = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem('token')

    await axios.post('http://localhost:8000/api/tasks', {
      title,
      description,
      assigned_to: assignedTo,
    }, {
      headers: { Authorization: `Bearer ${token}` },
    })

    setTitle('')
    setDescription('')
    setAssignedTo('')
    window.location.reload()
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-green-700">Dashboard Manager</h1>
          <LogoutButton />
        </div>

        <p className="mb-6 text-gray-700">Bienvenue, <strong>{user?.name}</strong> 👋</p>

        {/* Formulaire de création de tâche */}
        <Card className="mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Créer une nouvelle tâche</h2>
          <form onSubmit={handleCreateTask}>
            <Label>Titre</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Titre de la tâche"
              required
            />

            <Label>Description</Label>
            <textarea
              className="w-full border px-4 py-2 rounded mb-2"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Détaillez la tâche à effectuer"
              required
            ></textarea>

            <Label>Assigner à</Label>
            <select
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              className="w-full border px-4 py-2 rounded mb-4"
              required
            >
              <option value="">-- Sélectionner un employé --</option>
              {employees.map(emp => (
                <option key={emp.id} value={emp.id}>
                  {emp.name} ({emp.email})
                </option>
              ))}
            </select>

            <PrimaryButton type="submit">Créer tâche</PrimaryButton>
          </form>
        </Card>

        {/* Liste des tâches */}
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Tâches existantes</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {tasks.map(task => (
            <Card key={task.id} className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-lg text-gray-800">{task.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                <span className={`inline-block px-2 py-1 text-xs font-medium rounded ${
                  task.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {task.status}
                </span>
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <UserCircleIcon className="h-5 w-5 text-gray-500" />
                {task.assigned_to_name || 'Non assigné'}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ManagerDashboard
