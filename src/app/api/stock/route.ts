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
    
            // First, get the batch data to retrieve usable_quantity and item_id
            const batch = await prisma.batch.findUnique({
                where: { batch_id: String(batch_id) },
                select: {
                    usable_quantity: true,
                    item_id: true,
                    isdeleted: true
                }
            });

            if (!batch) {
                return NextResponse.json({ 
                    success: false, 
                    error: "Batch not found" 
                }, { status: 404 });
            }

            if (batch.isdeleted) {
                return NextResponse.json({ 
                    success: false, 
                    error: "Batch is already deleted" 
                }, { status: 400 });
            }

            // Use a transaction to ensure both operations succeed or fail together
            await prisma.$transaction(async (tx) => {
                // Mark batch as deleted
                await tx.batch.update({
                    where: { batch_id: String(batch_id) },
                    data: { isdeleted: true },
                });

                // Subtract usable_quantity from current_stock
                await tx.inventoryItem.update({
                    where: { item_id: batch.item_id },
                    data: {
                        current_stock: {
                            decrement: batch.usable_quantity
                        }
                    }
                });
            });

            return NextResponse.json({ success: true });
        } catch (error) {
            console.error("Delete error:", error);
            return NextResponse.json({ 
                success: false, 
                error: (error as Error).message 
            }, { status: 500 });
        }
    }
}

