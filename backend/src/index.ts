import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './auth/auth.routes'
import taskRoutes from './tasks/tasks.routes'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://task-manager-chi-dun.vercel.app'
  ],
  credentials: true
}))
app.use(express.json())

// Routes
app.use('/auth', authRoutes)
app.use('/tasks', taskRoutes)

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Task Manager API is running' })
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})

export default app