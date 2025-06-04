export interface Employee {
  emp_id: string;
  emp_first_name: string;
  emp_last_name: string;
}

export async function fetchEmployees(): Promise<Employee[]> {
  try {
    const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/employees`;
    
    const res = await fetch(url, {
      headers: {
        apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`,
        "Content-Type": "application/json",
        "Prefer": "return=representation"
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch employees: ${res.statusText}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error fetching employees:', error);
    throw error;
  }
}

export async function fetchEmployeeById(id: string): Promise<Employee | null> {
  try {
    const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/employees?emp_id=eq.${id}`;
    
    const res = await fetch(url, {
      headers: {
        apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`,
        "Content-Type": "application/json",
        "Prefer": "return=representation"
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch employee with ID ${id}: ${res.statusText}`);
    }

    const data = await res.json();
    return data.length > 0 ? data[0] : null;
  } catch (error) {
    console.error(`Error fetching employee with ID ${id}:`, error);
    throw error;
  }
}