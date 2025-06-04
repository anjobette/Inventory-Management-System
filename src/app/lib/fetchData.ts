export interface Category {
  category_id: string;
  category_name: string;
}

export interface Batch {
  batch_id: string;
  f_item_id: string;
  usable_quantity: number;
  defective_quantity: number;
  missing_quantity: number;
  expiration_date: string | null;
  date_created: string;
}

export interface InventoryItem {
  item_id: string;
  item_name: string;
  unit_measure: string;
  status: string;
  category_id: string;
  category: Category;
  reorder_level: number;
  date_created: string;
  date_updated: string;
  current_stock: number;
  batches: Batch[];
}

export interface ItemsResponse {
  success: boolean;
  items: InventoryItem[];
  batches: Batch[];
}

export async function fetchInventoryItems(): Promise<InventoryItem[]> {
  try {
    const res = await fetch('/api/item', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch inventory items: ${res.statusText}`);
    }

    const data: ItemsResponse = await res.json();
    
    if (!data.success) {
      throw new Error('Failed to fetch inventory items');
    }

    return data.items;
  } catch (error) {
    console.error('Error fetching inventory items:', error);
    throw error;
  }
}