import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';


// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET() {
  try {
    // Fetch items from Supabase
    const { data: items, error } = await supabase
      .from('items')
      .select('f_item_id, item_name, custom_for, purchased_quantity, item_type, unit_measure')
      .order('item_name');

    if (error) {
      throw new Error(`Supabase error: ${error.message}`);
    }

    return NextResponse.json({ success: true, items });
  } catch (error: any) {
    console.error('Error fetching items from Supabase:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

