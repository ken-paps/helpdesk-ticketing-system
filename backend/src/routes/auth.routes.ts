import { Router } from 'express'
import { login, refresh, logout, getMe } from '../controllers/auth.controller.js'
import { validate } from '../middleware/validate.js'
import { registerSchema, loginSchema } from '../validators/auth.validator.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

router.post('/login', validate(loginSchema), login)
router.post('/refresh', refresh)
router.post('/logout', logout)
router.get('/me', requireAuth, getMe)

export default router
