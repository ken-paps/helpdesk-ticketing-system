import { Router } from 'express'
import { createUser, deleteUser, getAgents, getAllUsers, updateUserRole } from '../controllers/user.controller.js'
import { requireAuth, requireRole } from '../middleware/auth.js'
import { Role } from '@prisma/client'

const router = Router()

router.get('/agents', requireAuth, requireRole(Role.AGENT, Role.ADMIN), getAgents)

// ONLY Admins can manage users
router.get('/', requireAuth, requireRole(Role.ADMIN), getAllUsers)
router.patch('/:id/role', requireAuth, requireRole(Role.ADMIN), updateUserRole)
router.delete('/:id', requireAuth, requireRole(Role.ADMIN), deleteUser)

router.post('/', requireAuth, requireRole(Role.ADMIN), createUser);

export default router
