// pages/api/item/check-existing.ts or app/api/item/check-existing/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const itemName = searchParams.get('itemName');

    // If action is 'check-existing', handle the existing item check
    if (action === 'check-existing') {
      console.log('Checking existing item for:', itemName); // Debug log

      if (!itemName) {
        return NextResponse.json(
          { error: 'Item name is required' },
          { status: 400 }
        );
      }

      // Check if item exists in the local database
      const existingItem = await prisma.inventoryItem.findFirst({
        where: {
          item_name: itemName,
          isdeleted: false
        },
        include: {
          category: true
        }
      });

      console.log('Found existing item:', existingItem); // Debug log

      if (existingItem) {
        return NextResponse.json({
          success: true,
          exists: true,
          item: {
            category_name: existingItem.category.category_name,
            category_id: existingItem.category_id,
            reorder_level: existingItem.reorder_level,
            unit_measure: existingItem.unit_measure
          }
        });
      } else {
        return NextResponse.json({
          success: true,
          exists: false
        });
      }
    }

  } catch (error) {
    console.error('Error in GET request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH (req: NextRequest) {

    if (req.method === 'PATCH') {
        try {
            const { batch_id } = await req.json();
    
          await prisma.batch.update({
              where: { batch_id: String(batch_id) },
              data: { isdeleted: true },
          });
          return NextResponse.json({ success: true });
      } catch (error) {
          console.error("Delete error:", error);
          return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
      }
  }
}