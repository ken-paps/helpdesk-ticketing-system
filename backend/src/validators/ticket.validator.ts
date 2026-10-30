import { z } from 'zod'
import { Priority, Status } from '@prisma/client'

export const createTicketSchema = z.object({
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  priority: z.nativeEnum(Priority).optional(),
})

export const updateTicketSchema = z.object({
  status: z.nativeEnum(Status).optional(),
  priority: z.nativeEnum(Priority).optional(),
  assigneeId: z.number().int().positive().nullable().optional(),
})
