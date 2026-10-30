import type { Request, Response, NextFunction } from 'express'
import { verifyAccessToken, type TokenPayload } from '../utils/jwt.js'
import { ApiError } from '../utils/ApiError.js'
import type { Role } from '@prisma/client'

// Extend Express Request to include our user payload
declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload
    }
  }
}

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies?.accessToken

    if (!token) {
      throw new ApiError(401, 'Authentication required')
    }

    const decoded = verifyAccessToken(token)
    req.user = decoded
    next()
  } catch (error) {
    next(new ApiError(401, 'Invalid or expired token'))
  }
}

export const requireRole = (...allowedRoles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new ApiError(401, 'Authentication required'))
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new ApiError(403, 'Forbidden: Insufficient permissions'))
    }

    next()
  }
}
