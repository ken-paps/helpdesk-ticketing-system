import { app } from './app.js'
import { env } from './config/env.js'
import { prisma } from './lib/prisma.js'

const startServer = async () => {
  try {
    await prisma.$connect()
    console.log('✅ Connected to MySQL database')

    app.listen(env.PORT, () => {
      console.log(`🚀 Server running on http://localhost:${env.PORT}`)
      console.log(`🌍 CORS enabled for: ${env.CLIENT_ORIGIN}`)
    })
  } catch (error) {
    console.error('❌ Failed to start server:', error)
    process.exit(1)
  }
}

startServer()
