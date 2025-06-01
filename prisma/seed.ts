import { PrismaClient } from '@prisma/client';
import { generateId } from '../src/app/lib/idGenerator';


const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Clearing existing data...');
    await prisma.category.deleteMany({});

    console.log('Seeding categories...');
    const categoryData = [
      { category_name: 'Consumable', date_created: new Date('2025-04-01') },
      { category_name: 'Bus', date_created: new Date('2025-04-16') },
      { category_name: 'Machine & Equipment', date_created: new Date('2025-04-30') }
    ];

    const categories = [];
    for (const category of categoryData) {
      const category_id = await generateId('category', 'CAT');
      const createdCategory = await prisma.category.create({
        data: {
          category_id,
          ...category
        }
      });
      categories.push(createdCategory);
    }

    console.log('✅ Seeding completed successfully.');
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
