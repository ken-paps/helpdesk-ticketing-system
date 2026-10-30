import type { Request, Response, NextFunction } from 'express'
import { prisma } from '../lib/prisma.js'
import { ApiError } from '../utils/ApiError.js'
import { Role } from '@prisma/client'

export const addComment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id: ticketId } = req.params
    const { content } = req.body
    const { userId, role } = req.user!

    // Verify ticket exists and check permissions
    const ticket = await prisma.ticket.findUnique({ where: { id: Number(ticketId) } })
    if (!ticket) throw new ApiError(404, 'Ticket not found')

    if (role === Role.USER && ticket.creatorId !== userId) {
      throw new ApiError(403, 'Forbidden: You do not have access to this ticket')
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        ticketId: Number(ticketId),
        authorId: userId,
      },
      include: {
        author: { select: { id: true, name: true, role: true } },
      },
    })

    res.status(201).json({ success: true, comment })
  } catch (error) {
    next(error)
  }
}
