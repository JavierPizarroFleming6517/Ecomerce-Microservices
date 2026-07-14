import { createHash } from 'node:crypto';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  const email = 'admin@retail.local';

  await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      passwordHash: createHash('sha256')
        .update('change-me-before-production')
        .digest('hex'),
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
