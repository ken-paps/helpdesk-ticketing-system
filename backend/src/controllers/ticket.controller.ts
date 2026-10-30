import type { Request, Response, NextFunction } from 'express'
import { prisma } from '../lib/prisma.js'
import { ApiError } from '../utils/ApiError.js'
import { Role } from '@prisma/client'

export const getTickets = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { role, userId } = req.user!

    // Role-based filtering: Normal users only see their own tickets.
    // Agents and Admins see everything.
    const where = role === Role.USER ? { creatorId: userId } : {}

    const tickets = await prisma.ticket.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        creator: { select: { id: true, name: true, email: true } },
        assignee: { select: { id: true, name: true, email: true } },
        _count: { select: { comments: true } },
      },
    })

    res.json({ success: true, tickets })
  } catch (error) {
    next(error)
  }
}

export const getTicketById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const { role, userId } = req.user!

    const ticket = await prisma.ticket.findUnique({
      where: { id: Number(id) },
      include: {
        creator: { select: { id: true, name: true, email: true } },
        assignee: { select: { id: true, name: true, email: true } },
        comments: {
          include: { author: { select: { id: true, name: true, role: true } } },
          orderBy: { createdAt: 'asc' },
        },
      },
    })

    if (!ticket) throw new ApiError(404, 'Ticket not found')

    // Security check: Users can only view their own tickets
    if (role === Role.USER && ticket.creatorId !== userId) {
      throw new ApiError(403, 'Forbidden: You do not have access to this ticket')
    }

    res.json({ success: true, ticket })
  } catch (error) {
    next(error)
  }
}

export const createTicket = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { subject, description, priority } = req.body
    const { userId } = req.user!

    const ticket = await prisma.ticket.create({
      data: {
        subject,
        description,
        priority,
        creatorId: userId,
      },
      include: {
        creator: { select: { id: true, name: true, email: true } },
      },
    })

    res.status(201).json({ success: true, ticket })
  } catch (error) {
    next(error)
  }
}

export const updateTicket = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const { status, priority, assigneeId } = req.body
    const { role, userId } = req.user!

    const existingTicket = await prisma.ticket.findUnique({ where: { id: Number(id) } })
    if (!existingTicket) throw new ApiError(404, 'Ticket not found')

    // Security check: Users can only update their own tickets (and only status)
    if (role === Role.USER) {
      if (existingTicket.creatorId !== userId) {
        throw new ApiError(403, 'Forbidden: You do not have access to this ticket')
      }
      if (assigneeId !== undefined) {
        throw new ApiError(403, 'Forbidden: Only agents can assign tickets')
      }
    }

    const updatedTicket = await prisma.ticket.update({
      where: { id: Number(id) },
      data: {
        ...(status && { status }),
        ...(priority && { priority }),
        ...(assigneeId !== undefined && { assigneeId }), // Can be null to unassign
      },
      include: {
        creator: { select: { id: true, name: true, email: true } },
        assignee: { select: { id: true, name: true, email: true } },
      },
    })

    res.json({ success: true, ticket: updatedTicket })
  } catch (error) {
    next(error)
  }
}
