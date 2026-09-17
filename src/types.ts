export interface Vendor {
  id: number;
  name: string;
  address?: string | null;
  phone?: string | null;
  types?: string | null;
  discount: number;
  boost: boolean;
  status: string;
  lat?: number | null;
  long?: number | null;
  profile_image_url?: string | null;
}

export interface MenuItem {
  id: number;
  vendor_id: number;
  name: string;
  description?: string | null;
  price: number;
  discount: number;
  status: string;
  boost: boolean;
  available: boolean;
  category?: string | null;
  menu_key?: string | null;
  image_url?: string | null;
}

export interface Rider {
  id: number;
  name: string;
  phone: string;
  status: string;
  live_lat?: number | null;
  live_long?: number | null;
  home_lat?: number | null;
  home_long?: number | null;
}

export interface Customer {
  id: number;
  name: string;
  phone: string;
  password?: string;
}

export interface CustomerAddress {
  id: number;
  customer_id: number;
  lat: number;
  long: number;
  description: string;
}

export interface OrderItem {
  menu_id: number;
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface Order {
  id: number;
  vendor_id?: number | null;
  customer_id?: number | null;
  rider_id?: number | null;
  customer_name?: string | null;
  vendor_name?: string | null;
  items: OrderItem[];
  amount: number;
  delivery_lat?: number | null;
  delivery_long?: number | null;
  vendor_lat?: number | null;
  vendor_long?: number | null;
  status: string;
  time: string;
}

export interface CustomerService {
  id: number;
  phone: string;
}

export interface VendorEarning {
  id: number;
  vendor_id: number;
  amount: number;
}
