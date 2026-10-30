import type { Request, Response, NextFunction } from 'express'
import { prisma } from '../lib/prisma.js'
import { Role } from '@prisma/client'
import { ApiError } from '../utils/ApiError.js'
import { hashPassword } from '../lib/password.js'

export const getAgents = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const agents = await prisma.user.findMany({
      where: { role: Role.AGENT },
      select: { id: true, name: true, email: true },
    })
    res.json({ success: true, agents })
  } catch (error) {
    next(error)
  }
}

// Get all users (Admin only)
export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    })
    res.json({ success: true, users })
  } catch (error) {
    next(error)
  }
}

// Update user role (Admin only)
export const updateUserRole = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const { role } = req.body

    // Prevent admin from changing their own role (to avoid locking themselves out)
    if (req.user?.userId === Number(id)) {
      throw new ApiError(400, 'You cannot change your own role')
    }

    const user = await prisma.user.update({
      where: { id: Number(id) },
      data: { role },
      select: { id: true, name: true, email: true, role: true },
    })

    res.json({ success: true, user })
  } catch (error) {
    next(error)
  }
}

// Delete user (Admin only)
export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params

    // Prevent admin from deleting themselves
    if (req.user?.userId === Number(id)) {
      throw new ApiError(400, 'You cannot delete your own account')
    }

    await prisma.user.delete({ where: { id: Number(id) } })
    res.json({ success: true, message: 'User deleted successfully' })
  } catch (error) {
    next(error)
  }
}

// Create a new user (Admin only)
export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password, role } = req.body

    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      throw new ApiError(409, 'Email already in use')
    }

    const hashedPassword = await  hashPassword(password)

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, role },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    })

    res.status(201).json({ success: true, user })
  } catch (error) {
    next(error)
  }
}
