import { Router } from 'express'
import authRoutes from './auth.routes.js'
import ticketRoutes from './ticket.routes.js'
import userRoutes from './user.routes.js'

const router = Router()

router.use('/auth', authRoutes)
router.use('/tickets', ticketRoutes)
router.use('/users', userRoutes)

export default router
