import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Customer, CustomerAddress, CustomerService, MenuItem, Order, Rider, Vendor, VendorEarning } from '../types';

const STORAGE_URL_KEY = 'food_sys_supabase_url';
const STORAGE_KEY_KEY = 'food_sys_supabase_key';

export function getStoredSupabaseCredentials() {
  const url = localStorage.getItem(STORAGE_URL_KEY) || import.meta.env.VITE_SUPABASE_URL || '';
  const key = localStorage.getItem(STORAGE_KEY_KEY) || import.meta.env.VITE_SUPABASE_ANON_KEY || '';
  return { url, key };
}

export function saveSupabaseCredentials(url: string, key: string) {
  localStorage.setItem(STORAGE_URL_KEY, url);
  localStorage.setItem(STORAGE_KEY_KEY, key);
}

export function createSupabaseClientInstance(): SupabaseClient | null {
  const { url, key } = getStoredSupabaseCredentials();
  if (url && key) {
    try {
      return createClient(url, key);
    } catch (e) {
      console.error('Failed to initialize Supabase client:', e);
      return null;
    }
  }
  return null;
}

// Initial Mock Data Store for interactive preview without Supabase setup
export const initialMockVendors: Vendor[] = [
  {
    id: 1,
    name: 'Burger Craft & Bites',
    address: '123 Food Street, Gulshan, Dhaka',
    phone: '+8801700000001',
    types: 'Fast Food, Burgers, Fries',
    discount: 10,
    boost: true,
    status: 'Active',
    lat: 23.7925,
    long: 90.4078,
    profile_image_url: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 2,
    name: 'Sultan Dine Biryani',
    address: '45 Heritage Lane, Dhanmondi, Dhaka',
    phone: '+8801800000002',
    types: 'Kacchi Biryani, Kebabs, Traditional',
    discount: 15,
    boost: true,
    status: 'Active',
    lat: 23.7461,
    long: 90.3742,
    profile_image_url: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 3,
    name: 'Pizza Gusto Italiano',
    address: '88 Avenue 4, Banani, Dhaka',
    phone: '+8801900000003',
    types: 'Italian Pizza, Pasta, Garlic Bread',
    discount: 5,
    boost: false,
    status: 'Active',
    lat: 23.7937,
    long: 90.4048,
    profile_image_url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80'
  }
];

export const initialMockMenus: MenuItem[] = [
  {
    id: 101,
    vendor_id: 1,
    name: 'Classic Smoky Cheese Burger',
    description: 'Juicy beef patty with double cheddar, caramelized onions, and secret BBQ sauce.',
    price: 350,
    discount: 10,
    status: 'Active',
    boost: true,
    available: true,
    category: 'Burgers',
    menu_key: 'BURGER_SMOKY_CHEESE',
    image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 102,
    vendor_id: 1,
    name: 'Crispy Loaded Fries',
    description: 'Golden French fries topped with melted cheese, jalapenos and minced beef.',
    price: 220,
    discount: 0,
    status: 'Active',
    boost: false,
    available: true,
    category: 'Sides',
    menu_key: 'SIDES_LOADED_FRIES',
    image_url: 'https://images.unsplash.com/photo-1585109649139-366815a0d713?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 201,
    vendor_id: 2,
    name: 'Mutton Kacchi Biryani Full Box',
    description: 'Aromatic basmati rice cooked with tender mutton chunks and fragrant ghee.',
    price: 480,
    discount: 15,
    status: 'Active',
    boost: true,
    available: true,
    category: 'Main Course',
    menu_key: 'BIR YANI_MUTTON_KACCHI',
    image_url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 202,
    vendor_id: 2,
    name: 'Chicken Reshmi Kebab',
    description: 'Marinated chicken kebabs grilled over charcoal with mint chutney.',
    price: 290,
    discount: 5,
    status: 'Active',
    boost: false,
    available: true,
    category: 'Kebabs',
    menu_key: 'KEBAB_CHICKEN_RESHMI',
    image_url: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 301,
    vendor_id: 3,
    name: 'Pepperoni Supreme Pizza 12"',
    description: 'Wood-fired crispy crust topped with rich tomato sauce, mozzarella, and spicy beef pepperoni.',
    price: 750,
    discount: 10,
    status: 'Active',
    boost: true,
    available: true,
    category: 'Pizza',
    menu_key: 'PIZZA_PEPPERONI_SUPREME',
    image_url: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=600&q=80'
  }
];

export const initialMockRiders: Rider[] = [
  {
    id: 1,
    name: 'Rahim Uddin',
    phone: '+8801711112222',
    status: 'Online',
    live_lat: 23.7910,
    live_long: 90.4060,
    home_lat: 23.7800,
    home_long: 90.4000
  },
  {
    id: 2,
    name: 'Karim Hossain',
    phone: '+8801822223333',
    status: 'Offline',
    live_lat: 23.7450,
    live_long: 90.3720,
    home_lat: 23.7400,
    home_long: 90.3700
  }
];

export const initialMockCustomers: Customer[] = [
  {
    id: 1,
    name: 'Anika Rahman',
    phone: '+8801999888777',
    password: 'password123'
  }
];

export const initialMockAddresses: CustomerAddress[] = [
  {
    id: 1,
    customer_id: 1,
    lat: 23.7950,
    long: 90.4120,
    description: 'House 42, Road 11, Banani, Dhaka'
  }
];

export const initialMockOrders: Order[] = [
  {
    id: 1001,
    vendor_id: 1,
    customer_id: 1,
    rider_id: 1,
    customer_name: 'Anika Rahman',
    vendor_name: 'Burger Craft & Bites',
    items: [
      { menu_id: 101, name: 'Classic Smoky Cheese Burger', price: 350, quantity: 2, subtotal: 700 },
      { menu_id: 102, name: 'Crispy Loaded Fries', price: 220, quantity: 1, subtotal: 220 }
    ],
    amount: 920,
    delivery_lat: 23.7950,
    delivery_long: 90.4120,
    vendor_lat: 23.7925,
    vendor_long: 90.4078,
    status: 'Preparing',
    time: new Date(Date.now() - 15 * 60000).toISOString()
  }
];

export const initialMockCustomerServices: CustomerService[] = [
  { id: 1, phone: '+8809612345678' },
  { id: 2, phone: '+8801700998877' }
];

export const initialMockVendorEarnings: VendorEarning[] = [
  { id: 1, vendor_id: 1, amount: 14500 },
  { id: 2, vendor_id: 2, amount: 22300 },
  { id: 3, vendor_id: 3, amount: 8900 }
];
