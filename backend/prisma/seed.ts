import { PrismaClient, Role } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  const password = await bcrypt.hash('Password123!', 10)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@helpdesk.dev' },
    update: {},
    create: {
      email: 'admin@helpdesk.dev',
      name: 'System Admin',
      password,
      role: Role.ADMIN,
    },
  })

  const agent = await prisma.user.upsert({
    where: { email: 'agent@helpdesk.dev' },
    update: {},
    create: {
      email: 'agent@helpdesk.dev',
      name: 'Support Agent',
      password,
      role: Role.AGENT,
    },
  })

  const user = await prisma.user.upsert({
    where: { email: 'user@helpdesk.dev' },
    update: {},
    create: {
      email: 'user@helpdesk.dev',
      name: 'Regular User',
      password,
      role: Role.USER,
    },
  })

  // Create a sample ticket
  await prisma.ticket.create({
    data: {
      subject: 'Cannot log in to my account',
      description: 'I keep getting an invalid password error even though I am sure it is correct.',
      priority: 'HIGH',
      creatorId: user.id,
      assigneeId: agent.id,
    },
  })

  console.log('✅ Seed complete.')
  console.log('   Admin : admin@helpdesk.dev / Password123!')
  console.log('   Agent : agent@helpdesk.dev / Password123!')
  console.log('   User  : user@helpdesk.dev  / Password123!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
