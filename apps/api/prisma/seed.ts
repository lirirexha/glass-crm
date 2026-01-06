import { PrismaClient, Role } from '@prisma/client'
import * as argon2 from 'argon2'

const prisma = new PrismaClient()

async function main() {
  const companyId = 1111
  const adminEmail = 'admin@glass.com'
  const adminPassword = 'Admin123!'

  await prisma.company.upsert({
    where: { id: companyId },
    update: {},
    create: {
      id: companyId,
      name: 'Demo Glass Company',
    },
  })

  const passwordHash = await argon2.hash(adminPassword)

  await prisma.user.upsert({
    where: {
      companyId_email: {
        companyId,
        email: adminEmail,
      },
    },
    update: {
      passwordHash,
      role: Role.ADMIN,
      isActive: true,
    },
    create: {
      companyId,
      email: adminEmail,
      passwordHash,
      role: Role.ADMIN,
      isActive: true,
    },
  })

  console.log('Company ', companyId)
  console.log('Admin ', adminEmail)
  console.log('Pass ', adminPassword)
}

main()
  .catch((e) => {
    console.error('Seed failed', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
