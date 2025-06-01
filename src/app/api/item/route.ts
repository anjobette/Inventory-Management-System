import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../lib/prisma';
import { generateId } from '../../lib/idGenerator';

export async function GET() {
  try {
    // Fetch all items from the inventory that aren't deleted
    const items = await prisma.inventoryItem.findMany({
      where: {
        isdeleted: false
      },
      select: {
        item_id: true,
        f_item_id: true,
        item_name: true,
        current_stock: true,
        unit_measure: true,
        status: true,
        category_id: true,
        reorder_level: true,
        batches: {
          select: {
            batch_id: true,
            usable_quantity: true,
            defective_quantity: true,
            missing_quantity: true,
            expiration_date: true
          }
        }
      }
    });

    return NextResponse.json({ success: true, items });
  } catch (error: any) {
    console.error('Error fetching inventory items:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { stockItems } = await request.json();
    console.log(`🔄 Starting to process ${stockItems.length} items`);

    // Process each stock item sequentially with detailed logging
    const results = [];
    
    for (let i = 0; i < stockItems.length; i++) {
      const item = stockItems[i];
      console.log(`📦 Processing item ${i + 1}/${stockItems.length}: ${item.itemName}`);
      
      try {
        // Check if the inventory item already exists
        console.log(`🔍 Checking if item exists: ${item.itemName}`);
        const existingItem = await prisma.inventoryItem.findFirst({
          where: { item_name: item.itemName }
        });

        // Convert status string to enum value
        const statusMap: Record<string, any> = {
          'available': 'AVAILABLE',
          'out-of-stock': 'OUT_OF_STOCK',
          'low-stock': 'LOW_STOCK',
          'maintenance': 'UNDER_MAINTENANCE'
        };
        const inventoryStatus = statusMap[item.status] || 'AVAILABLE';

        // Generate new batch ID
        console.log(`🆔 Generating batch ID for item ${i + 1}`);
        const batch_id = await generateId('batch', 'BAT');
        console.log(`✅ Generated batch ID: ${batch_id}`);
      
        if (existingItem) {
          console.log(`🔄 Updating existing item: ${existingItem.item_id}`);
          // Update existing inventory item
          const updatedItem = await prisma.inventoryItem.update({
            where: { item_id: existingItem.item_id, isdeleted: false },
            data: {
              current_stock: existingItem.current_stock + item.usable,
              reorder_level: item.reorder,
              status: inventoryStatus,
              date_updated: new Date(),
              batches: {
                create: {
                  batch_id,
                  usable_quantity: item.usable,
                  defective_quantity: item.defective,
                  missing_quantity: item.missing,
                  expiration_date: item.expiration ? new Date(item.expiration) : null,
                  created_by: 1
                }
              }
            }
          });
          console.log(`✅ Successfully updated item ${i + 1}`);
          results.push({ success: true, action: 'updated', item: updatedItem });
          
        } else {
          console.log(`🆔 Generating item ID for new item ${i + 1}`);
          const item_id = await generateId('inventoryItem', 'ITEM');
          console.log(`✅ Generated item ID: ${item_id}`);
          
          // Get category information
          console.log(`🏷️ Finding category for: ${item.category}`);
          const category = await prisma.category.findFirst({
            where: { 
              category_name: item.category === 'Consumable' 
                ? 'Consumable' 
                : 'Machine & Equipment'
            }
          });

          if (!category) {
            throw new Error(`Category not found for ${item.category}`);
          }
          console.log(`✅ Found category: ${category.category_id}`);

          // Create new inventory item
          console.log(`➕ Creating new inventory item ${i + 1}`);
          const newItem = await prisma.inventoryItem.create({
            data: {
              item_id,
              f_item_id: item.name,
              category_id: category.category_id,
              item_name: item.itemName,
              unit_measure: item.unit,
              current_stock: item.usable,
              reorder_level: item.reorder,
              status: inventoryStatus,
              created_by: 1,
              batches: {
                create: {
                  batch_id,
                  usable_quantity: item.usable,
                  defective_quantity: item.defective,
                  missing_quantity: item.missing,
                  expiration_date: item.expiration ? new Date(item.expiration) : null,
                  created_by: 1
                }
              }
            }
          });
          console.log(`✅ Successfully created item ${i + 1}: ${newItem.item_id}`);
          results.push({ success: true, action: 'created', item: newItem });
        }
        
      } catch (itemError: any) {
        console.error(`❌ Error processing item ${i + 1} (${item.name}):`, itemError.message);
        console.error('Full error:', itemError);
        results.push({ 
          success: false, 
          action: 'failed', 
          item: item.name, 
          error: itemError.message 
        });
        
        // Don't break the loop, continue with next item
      }
    }

    console.log(`🏁 Finished processing. Results:`, results.map(r => r.action));
    return NextResponse.json({ success: true, results });
    
  } catch (error: any) {
    console.error('❌ Fatal error processing stock items:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { item_id, reorder_level, status } = await request.json();

    if (!item_id || item_id === "undefined") {
            return NextResponse.json({ success: false, error: "Missing or invalid item_id" }, { status: 400 });
        }

    const updated = await prisma.inventoryItem.update({
            where: { item_id: String(item_id) },
            data: {
                reorder_level: reorder_level,
                status: status,
            },
        });
        return NextResponse.json({ 
      success: true, 
      item: updated,
      message: 'Item updated successfully'
    });
    } catch (error) {
        return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
    }
}

export async function PATCH (req: NextRequest) {

    if (req.method === 'PATCH') {
        try {
            const { item_id } = await req.json();
          // Soft-delete the inventory item
          await prisma.inventoryItem.update({
              where: { item_id: String(item_id) },
              data: { isdeleted: true },
          });
          // Soft-delete all batches for this item
          await prisma.batch.updateMany({
              where: { item_id: String(item_id) },
              data: { isdeleted: true },
          });
          return NextResponse.json({ success: true });
      } catch (error) {
          console.error("Delete error:", error);
          return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
      }
  }
}