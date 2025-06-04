import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function generateId(
  model: 'category' | 'inventoryItem' | 'batch' | 'employeeRequest',
  prefix: string,
  idField?: string
): Promise<string> {
  let lastEntry: { [key: string]: string } | null = null;

  switch (model) {
    case 'category':
      lastEntry = await prisma.category.findFirst({
        orderBy: {
          category_id: 'desc'
        },
        select: {
          category_id: true
        }
      });
      idField = 'category_id';
      break;

    case 'inventoryItem':
      lastEntry = await prisma.inventoryItem.findFirst({
        orderBy: {
          item_id: 'desc'
        },
        select: {
          item_id: true
        }
      });
      idField = 'item_id';
      break;

    case 'batch':
      lastEntry = await prisma.batch.findFirst({
        orderBy: {
          batch_id: 'desc'
        },
        select: {
          batch_id: true
        }
      });
      idField = 'batch_id';
      break;

      // case 'employeeRequest':
      // lastEntry = await prisma.employeeRequest.findFirst({
      //   orderBy: {
      //     emp_id: 'desc'
      //   },
      //   select: {
      //     emp_id: true
      //   }
      // });
      // idField = 'emp_id';
      // break;
  }

  const lastId = lastEntry ? lastEntry[idField!] : null;
  const lastNumber = lastId ? parseInt(lastId.split('-')[1], 10) : 0;
  const nextNumber = lastNumber + 1;

  return `${prefix}-${String(nextNumber).padStart(5, '0')}`;
}
