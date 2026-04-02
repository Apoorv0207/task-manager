import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '../lib/prisma'

const generateAccessToken = (userId: string) => {
  return jwt.sign({ userId }, process.env.JWT_ACCESS_SECRET!, { expiresIn: '15m' })
}

const generateRefreshToken = (userId: string) => {
  return jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET!, { expiresIn: '7d' })
}

// POST /auth/register
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      res.status(400).json({ message: 'All fields are required' })
      return
    }

    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      res.status(400).json({ message: 'Email already in use' })
      return
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword }
    })

    const accessToken = generateAccessToken(user.id)
    const refreshToken = generateRefreshToken(user.id)

    res.status(201).json({
      message: 'User registered successfully',
      accessToken,
      refreshToken,
      user: { id: user.id, name: user.name, email: user.email }
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}

// POST /auth/login
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      res.status(400).json({ message: 'All fields are required' })
      return
    }

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      res.status(401).json({ message: 'Invalid credentials' })
      return
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      res.status(401).json({ message: 'Invalid credentials' })
      return
    }

    const accessToken = generateAccessToken(user.id)
    const refreshToken = generateRefreshToken(user.id)

    res.status(200).json({
      message: 'Login successful',
      accessToken,
      refreshToken,
      user: { id: user.id, name: user.name, email: user.email }
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}

// POST /auth/refresh
export const refresh = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body

    if (!refreshToken) {
      res.status(400).json({ message: 'Refresh token required' })
      return
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as { userId: string }
    const accessToken = generateAccessToken(decoded.userId)

    res.status(200).json({ accessToken })
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired refresh token' })
  }
}

// POST /auth/logout
export const logout = async (req: Request, res: Response) => {
  // Since we're using stateless JWT, logout is handled on the frontend
  // by deleting the tokens from storage
  res.status(200).json({ message: 'Logged out successfully' })
}