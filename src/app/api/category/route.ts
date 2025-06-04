import { NextResponse } from 'next/server';
import { prisma } from '../../lib/prisma';

export async function GET() {
  try {
    // Fetch all categories except 'Bus'
    const categories = await prisma.category.findMany({
      where: {
        category_name: {
          not: 'Bus'
        },
        isdeleted: false
      },
      select: {
        category_id: true,
        category_name: true
      }
    });

    return NextResponse.json({ success: true, categories });
  } catch (error: any) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}