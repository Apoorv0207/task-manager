import { Router } from 'express'
import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  toggleTask
} from './tasks.controller'
import { protect } from '../middleware/auth.middleware'

const router = Router()

// All task routes are protected
router.use(protect)

router.get('/', getTasks)
router.post('/', createTask)
router.get('/:id', getTaskById)
router.patch('/:id', updateTask)
router.delete('/:id', deleteTask)
router.patch('/:id/toggle', toggleTask)

export default router