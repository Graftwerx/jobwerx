// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import fs from 'fs/promises';

const prisma = new PrismaClient();

async function main() {
  const data = await fs.readFile('./worldcities_flat_clean.json', 'utf-8');
  const cities = JSON.parse(data);

  console.log(`Seeding ${cities.length} cities...`);

  // Optional: chunk inserts to avoid overload
  const chunkSize = 1000;
  for (let i = 0; i < cities.length; i += chunkSize) {
    const chunk = cities.slice(i, i + chunkSize);

    await prisma.city.createMany({
      data: chunk,
      skipDuplicates: true, // in case you re-run
    });

    console.log(`Inserted ${i + chunk.length}/${cities.length}`);
  }

  console.log('Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
