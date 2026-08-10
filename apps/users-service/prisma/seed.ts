import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  const email = 'admin@retail.local';
  const passwordHash = await bcrypt.hash('change-me-before-production', 12);

  await prisma.user.upsert({
    where: { email },
    update: {
      passwordHash,
      isActive: true,
      emailVerifiedAt: new Date(),
    },
    create: {
      email,
      passwordHash,
      emailVerifiedAt: new Date(),
      profile: {
        create: {
          firstName: 'Retail',
          lastName: 'Admin',
        },
      },
    },
  });
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
