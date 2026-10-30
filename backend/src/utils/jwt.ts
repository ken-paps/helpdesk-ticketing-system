import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'
import type { Role } from '@prisma/client'

export interface TokenPayload {
  userId: number
  role: Role
}

// --- Access Tokens ---
export const signAccessToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRES_IN as jwt.SignOptions['expiresIn'],
  })
}

export const verifyAccessToken = (token: string): TokenPayload => {
  return jwt.verify(token, env.JWT_ACCESS_SECRET) as TokenPayload
}

// --- Refresh Tokens ---
// The refresh token only contains the userId; we store the actual token string in the DB.
export const signRefreshToken = (payload: { userId: number }): string => {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN as jwt.SignOptions['expiresIn'],
  })
}

export const verifyRefreshToken = (token: string): { userId: number } => {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as { userId: number }
}
