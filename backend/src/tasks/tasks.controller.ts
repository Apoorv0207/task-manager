import { Response } from 'express'
import prisma from '../lib/prisma'
import { AuthRequest } from '../types'

// GET /tasks
export const getTasks = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!
    const { status, search, page = '1', limit = '10' } = req.query

    const pageNum = parseInt(page as string)
    const limitNum = parseInt(limit as string)
    const skip = (pageNum - 1) * limitNum

    const where: any = { userId }

    if (status) {
      where.status = status as string
    }

    if (search) {
      where.title = {
        contains: search as string,
        mode: 'insensitive'
      }
    }

    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.task.count({ where })
    ])

    res.status(200).json({
      tasks,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum)
      }
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}

// GET /tasks/:id
export const getTaskById = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string
    const userId = req.userId!

    const task = await prisma.task.findFirst({
      where: { id, userId }
    })

    if (!task) {
      res.status(404).json({ message: 'Task not found' })
      return
    }

    res.status(200).json(task)
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}

// POST /tasks
export const createTask = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!
    const { title, description } = req.body

    if (!title) {
      res.status(400).json({ message: 'Title is required' })
      return
    }

    const task = await prisma.task.create({
      data: {
        title,
        description: description || null,
        status: 'pending',
        userId
      }
    })

    res.status(201).json(task)
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}

// PATCH /tasks/:id
export const updateTask = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string
    const userId = req.userId!
    const { title, description, status } = req.body

    const existing = await prisma.task.findFirst({
      where: { id, userId }
    })

    if (!existing) {
      res.status(404).json({ message: 'Task not found' })
      return
    }

    const updatedTask = await prisma.task.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(status && { status })
      }
    })

    res.status(200).json(updatedTask)
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}

// DELETE /tasks/:id
export const deleteTask = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string
    const userId = req.userId!

    const existing = await prisma.task.findFirst({
      where: { id, userId }
    })

    if (!existing) {
      res.status(404).json({ message: 'Task not found' })
      return
    }

    await prisma.task.delete({ where: { id } })

    res.status(200).json({ message: 'Task deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}

// PATCH /tasks/:id/toggle
export const toggleTask = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string
    const userId = req.userId!

    const existing = await prisma.task.findFirst({
      where: { id, userId }
    })

    if (!existing) {
      res.status(404).json({ message: 'Task not found' })
      return
    }

    const newStatus = existing.status === 'pending' ? 'completed' : 'pending'

    const updatedTask = await prisma.task.update({
      where: { id },
      data: { status: newStatus }
    })

    res.status(200).json(updatedTask)
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}