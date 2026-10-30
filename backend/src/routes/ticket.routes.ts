import { Router } from 'express'
import { getTickets, getTicketById, createTicket, updateTicket } from '../controllers/ticket.controller.js'
import { addComment } from '../controllers/comment.controller.js'
import { requireAuth } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'
import { createTicketSchema, updateTicketSchema } from '../validators/ticket.validator.js'
import { createCommentSchema } from '../validators/comment.validator.js'

const router = Router()

// All ticket routes require authentication
router.use(requireAuth)

router.get('/', getTickets)
router.post('/', validate(createTicketSchema), createTicket)
router.get('/:id', getTicketById)
router.patch('/:id', validate(updateTicketSchema), updateTicket)

// Nested comment route
router.post('/:id/comments', validate(createCommentSchema), addComment)

export default router
