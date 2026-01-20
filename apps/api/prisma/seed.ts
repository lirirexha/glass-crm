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
    where: { email: adminEmail },
    update: { passwordHash, role: Role.ADMIN, isActive: true, companyId },
    create: {
      companyId,
      email: adminEmail,
      passwordHash,
      role: Role.ADMIN,
      isActive: true,
    },
  })

  await prisma.client.upsert({
    where: { id: 1 },
    update: {},
    create: {
      companyId: 1111,
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+123456789',
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
