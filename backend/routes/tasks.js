const express = require('express')
const router = express.Router()
const { verifyToken, isManager } = require('../middleware/auth')
const Task = require('../models/Task')
const User = require('../models/User')

// GET /api/manager-tasks
router.get('/manager-tasks', verifyToken, isManager, async (req, res) => {
  const tasks = await Task.find()
  res.json(tasks)
})

// GET /api/employees
router.get('/employees', verifyToken, isManager, async (req, res) => {
  const employees = await User.find({ role: 'employee' })
  res.json(employees)
})

// POST /api/tasks
router.post('/tasks', verifyToken, isManager, async (req, res) => {
  const { title, description, employeeId } = req.body
  const task = new Task({ title, description, assignedTo: employeeId, status: 'pending' })
  await task.save()
  res.status(201).json(task)
})

// PUT /api/tasks/:id/complete
router.put('/tasks/:id/complete', verifyToken, async (req, res) => {
  const task = await Task.findByIdAndUpdate(req.params.id, { status: 'completed' }, { new: true })
  res.json(task)
})

module.exports = router