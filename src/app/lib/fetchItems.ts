// Define the item structure based on your Supabase database
export interface Item {
  f_item_id: string;
  item_name: string;
  custom_for: string;
  purchased_quantity: number;
  item_type: string;
  unit_measure: string;
  // Add other fields that your items have in Supabase
}

// Function to fetch all items from Supabase
export async function fetchItems(): Promise<Item[]> {
  try {
    const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/items`;
    
    const res = await fetch(url, {
      headers: {
        apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`,
        "Content-Type": "application/json",
        "Prefer": "return=representation"
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch items: ${res.statusText}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error fetching items:', error);
    throw error;
  }
}

// Function to fetch a single item by its ID
export async function fetchItemById(id: string): Promise<Item | null> {
  try {
    const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/items?f_item_id=eq.${id}`;
    
    const res = await fetch(url, {
      headers: {
        apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`,
        "Content-Type": "application/json",
        "Prefer": "return=representation"
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch item with ID ${id}: ${res.statusText}`);
    }

    const data = await res.json();
    return data.length > 0 ? data[0] : null;
  } catch (error) {
    console.error(`Error fetching item with ID ${id}:`, error);
    throw error;
  }
}

export async function fetchAvailableItems() {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      throw new Error('Supabase environment variables are not configured');
    }
    
    // Fetch all items from Supabase
    const allItems = await fetchItems();
    
    // Fetch items already in inventory
    const inventoryResponse = await fetch('/api/item', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!inventoryResponse.ok)  {
      throw new Error(`Error fetching inventory items: ${inventoryResponse.statusText}`);
    } 
    
    const inventoryData = await inventoryResponse.json();
    const inventoryItems = inventoryData.items;
    
    // Extract f_item_ids already in inventory
    const existingItemIds = inventoryItems.map((item: any) => item.f_item_id);
    
    // Filter out items already in inventory
    const availableItems = allItems.filter((item: Item) => 
      !existingItemIds.includes(item.f_item_id)
    );
    
    return availableItems;
  } catch (error) {
    console.error('Error in fetchAvailableItems:', error);
    throw error;
  }
  
}