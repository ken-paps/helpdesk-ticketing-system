import type { Request, Response, NextFunction } from 'express'
import { prisma } from '../lib/prisma.js'
import { hashPassword, verifyPassword } from '../lib/password.js'
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt.js'
import { ApiError } from '../utils/ApiError.js'
import { env } from '../config/env.js'

// Helper to set cookies
const setAuthCookies = (res: Response, accessToken: string, refreshToken: string) => {
  const isProd = env.NODE_ENV === 'production'

  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax', // 'lax' allows standard navigation, 'strict' might block localhost
    domain: env.COOKIE_DOMAIN,
    maxAge: 15 * 60 * 1000, // 15 mins
  })

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    domain: env.COOKIE_DOMAIN,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/api/auth/refresh', // Only send to refresh endpoint
  })
}

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password } = req.body

    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      throw new ApiError(409, 'Email already in use')
    }

    const hashedPassword = await hashPassword(password)

    // Note: By default, we make them a USER.
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
      select: { id: true, name: true, email: true, role: true },
    })

    res.status(201).json({ success: true, user })
  } catch (error) {
    next(error)
  }
}

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      throw new ApiError(401, 'Invalid credentials')
    }

    const isValid = await verifyPassword(password, user.password)
    if (!isValid) {
      throw new ApiError(401, 'Invalid credentials')
    }

    // Generate tokens
    const accessToken = signAccessToken({ userId: user.id, role: user.role })
    const refreshToken = signRefreshToken({ userId: user.id })

    // Save refresh token to DB for validation later
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    })

    setAuthCookies(res, accessToken, refreshToken)

    res.json({
      success: true,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    })
  } catch (error) {
    next(error)
  }
}

export const refresh = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.cookies

    if (!refreshToken) {
      throw new ApiError(401, 'Refresh token required')
    }

    // Verify JWT
    const decoded = verifyRefreshToken(refreshToken)

    // Check if token exists in DB and is not expired
    const dbToken = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: { select: { id: true, role: true } } },
    })

    if (!dbToken || dbToken.expiresAt < new Date()) {
      throw new ApiError(401, 'Invalid or expired refresh token')
    }

    // Generate new tokens (Token Rotation)
    const newAccessToken = signAccessToken({ userId: dbToken.user.id, role: dbToken.user.role })

    res.cookie('accessToken', newAccessToken, {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'lax',
      domain: env.COOKIE_DOMAIN,
      maxAge: 15 * 60 * 1000,
    })

    res.json({ success: true, message: 'Token refreshed' })
  } catch (error) {
    next(new ApiError(401, 'Invalid refresh token'))
  }
}

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.cookies

    if (refreshToken) {
      // Delete from DB
      await prisma.refreshToken.deleteMany({ where: { token: refreshToken } })
    }

    // Clear cookies
    res.clearCookie('accessToken', { domain: env.COOKIE_DOMAIN })
    res.clearCookie('refreshToken', { domain: env.COOKIE_DOMAIN, path: '/api/auth/refresh' })

    res.json({ success: true, message: 'Logged out successfully' })
  } catch (error) {
    next(error)
  }
}

export const getMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      select: { id: true, name: true, email: true, role: true },
    })

    if (!user) throw new ApiError(404, 'User not found')

    res.json({ success: true, user })
  } catch (error) {
    next(error)
  }
}
