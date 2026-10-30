import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { env } from './config/env.js'
import apiRoutes from './routes/index.js'
import { errorHandler } from './middleware/errorHandler.js'

const app = express()

// Middleware
app.use(express.json())
app.use(cookieParser())
app.use(
  cors({
    origin: env.CLIENT_ORIGIN,
    credentials: true, // Crucial for httpOnly cookies
  }),
)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// API Routes
app.use('/api', apiRoutes)

// Global Error Handler (Must be the last middleware)
app.use(errorHandler)

export { app }
