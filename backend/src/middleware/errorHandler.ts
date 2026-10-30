import type { Request, Response, NextFunction } from 'express'
import { ApiError } from '../utils/ApiError.js'
import { env } from '../config/env.js'

export const errorHandler = (err: Error | ApiError, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err instanceof ApiError ? err.statusCode : 500
  const message = err.message || 'Internal Server Error'

  // Log error in development
  if (env.NODE_ENV === 'development' && statusCode === 500) {
    console.error('🔥 Server Error:', err)
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(env.NODE_ENV === 'development' && statusCode === 500 && { stack: err.stack }),
  })
}
