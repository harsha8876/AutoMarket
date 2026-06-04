const { PrismaClient } = require('../lib/generated/prisma');
const prisma = new PrismaClient();

async function main() {
  const dealership = await prisma.dealershipInfo.findFirst({
    include: { workingHours: true }
  });
  console.log("Current Dealership in DB:", JSON.stringify(dealership, null, 2));
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
