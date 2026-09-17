import React, { useState, useEffect } from 'react';
import { Customer, CustomerAddress, CustomerService, MenuItem, Order, Rider, Vendor, VendorEarning } from './types';
import {
  createSupabaseClientInstance,
  getStoredSupabaseCredentials,
  initialMockAddresses,
  initialMockCustomers,
  initialMockCustomerServices,
  initialMockMenus,
  initialMockOrders,
  initialMockRiders,
  initialMockVendorEarnings,
  initialMockVendors
} from './lib/supabase';
import { CustomerPortal } from './components/CustomerPortal';
import { VendorPortal } from './components/VendorPortal';
import { RiderPortal } from './components/RiderPortal';
import { AdminPortal } from './components/AdminPortal';
import { ExportFilesModal } from './components/ExportFilesModal';
import { ShoppingBag, Store, Bike, ShieldCheck, Download, Database, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [activePortal, setActivePortal] = useState<'customer' | 'vendor' | 'rider' | 'admin'>('customer');
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Application database state
  const [vendors, setVendors] = useState<Vendor[]>(initialMockVendors);
  const [menus, setMenus] = useState<MenuItem[]>(initialMockMenus);
  const [riders, setRiders] = useState<Rider[]>(initialMockRiders);
  const [customers, setCustomers] = useState<Customer[]>(initialMockCustomers);
  const [addresses, setAddresses] = useState<CustomerAddress[]>(initialMockAddresses);
  const [orders, setOrders] = useState<Order[]>(initialMockOrders);
  const [customerServices, setCustomerServices] = useState<CustomerService[]>(initialMockCustomerServices);
  const [vendorEarnings, setVendorEarnings] = useState<VendorEarning[]>(initialMockVendorEarnings);

  const [isConnectedToSupabase, setIsConnectedToSupabase] = useState(false);

  // Load data from Supabase if configured
  const loadSupabaseData = async () => {
    const supabase = createSupabaseClientInstance();
    if (!supabase) {
      setIsConnectedToSupabase(false);
      return;
    }

    try {
      setIsConnectedToSupabase(true);

      const [
        vRes, mRes, rRes, cRes, aRes, oRes, csRes, veRes
      ] = await Promise.all([
        supabase.from('vendors').select('*'),
        supabase.from('menus').select('*'),
        supabase.from('riders').select('*'),
        supabase.from('customers').select('*'),
        supabase.from('customer_addresses').select('*'),
        supabase.from('orders').select('*').order('id', { ascending: false }),
        supabase.from('customer_service').select('*'),
        supabase.from('vendor_earnings').select('*')
      ]);

      if (vRes.data && vRes.data.length > 0) setVendors(vRes.data);
      if (mRes.data && mRes.data.length > 0) setMenus(mRes.data);
      if (rRes.data && rRes.data.length > 0) setRiders(rRes.data);
      if (cRes.data && cRes.data.length > 0) setCustomers(cRes.data);
      if (aRes.data && aRes.data.length > 0) setAddresses(aRes.data);
      if (oRes.data && oRes.data.length > 0) setOrders(oRes.data);
      if (csRes.data && csRes.data.length > 0) setCustomerServices(csRes.data);
      if (veRes.data && veRes.data.length > 0) setVendorEarnings(veRes.data);
    } catch (e) {
      console.error('Error fetching Supabase data:', e);
    }
  };

  useEffect(() => {
    loadSupabaseData();
  }, []);

  // Handlers for state updates (also pushing to Supabase if connected)
  const handlePlaceOrder = async (newOrderData: Partial<Order>) => {
    const newId = Date.now();
    const createdOrder: Order = {
      id: newId,
      vendor_id: newOrderData.vendor_id || 1,
      customer_id: newOrderData.customer_id || 1,
      rider_id: null,
      customer_name: newOrderData.customer_name || 'Customer',
      vendor_name: newOrderData.vendor_name || 'Vendor',
      items: newOrderData.items || [],
      amount: newOrderData.amount || 0,
      delivery_lat: newOrderData.delivery_lat || 23.795,
      delivery_long: newOrderData.delivery_long || 90.412,
      vendor_lat: newOrderData.vendor_lat || 23.7925,
      vendor_long: newOrderData.vendor_long || 90.4078,
      status: 'Pending',
      time: new Date().toISOString()
    };

    setOrders(prev => [createdOrder, ...prev]);

    const supabase = createSupabaseClientInstance();
    if (supabase) {
      try {
        await supabase.from('orders').insert([
          {
            vendor_id: createdOrder.vendor_id,
            customer_id: createdOrder.customer_id,
            customer_name: createdOrder.customer_name,
            vendor_name: createdOrder.vendor_name,
            items: createdOrder.items,
            amount: createdOrder.amount,
            delivery_lat: createdOrder.delivery_lat,
            delivery_long: createdOrder.delivery_long,
            vendor_lat: createdOrder.vendor_lat,
            vendor_long: createdOrder.vendor_long,
            status: createdOrder.status,
            time: createdOrder.time
          }
        ]);
      } catch (e) {
        console.error('Supabase order insert error:', e);
      }
    }
  };

  const handleUpdateVendor = async (updatedVendor: Vendor) => {
    setVendors(prev => prev.map(v => v.id === updatedVendor.id ? updatedVendor : v));

    const supabase = createSupabaseClientInstance();
    if (supabase) {
      try {
        await supabase.from('vendors').update(updatedVendor).eq('id', updatedVendor.id);
      } catch (e) {
        console.error('Supabase vendor update error:', e);
      }
    }
  };

  const handleAddVendor = async (newV: Partial<Vendor>) => {
    const newId = Date.now();
    const createdV: Vendor = {
      id: newId,
      name: newV.name || 'New Restaurant',
      address: newV.address || '',
      phone: newV.phone || '',
      types: newV.types || 'Fast Food',
      discount: newV.discount || 0,
      boost: newV.boost || false,
      status: 'Active',
      lat: 23.7925,
      long: 90.4078,
      profile_image_url: newV.profile_image_url || ''
    };

    setVendors(prev => [...prev, createdV]);

    const supabase = createSupabaseClientInstance();
    if (supabase) {
      try {
        await supabase.from('vendors').insert([newV]);
      } catch (e) {
        console.error('Supabase vendor insert error:', e);
      }
    }
  };

  const handleAddMenuItem = async (newM: Partial<MenuItem>) => {
    const newId = Date.now();
    const createdM: MenuItem = {
      id: newId,
      vendor_id: newM.vendor_id || 1,
      name: newM.name || 'Food Item',
      description: newM.description || '',
      price: newM.price || 100,
      discount: newM.discount || 0,
      status: 'Active',
      boost: false,
      available: true,
      category: newM.category || 'General',
      menu_key: `KEY_${newId}`,
      image_url: newM.image_url || ''
    };

    setMenus(prev => [...prev, createdM]);

    const supabase = createSupabaseClientInstance();
    if (supabase) {
      try {
        await supabase.from('menus').insert([newM]);
      } catch (e) {
        console.error('Supabase menu insert error:', e);
      }
    }
  };

  const handleUpdateMenuItem = async (updatedMenu: MenuItem) => {
    setMenus(prev => prev.map(m => m.id === updatedMenu.id ? updatedMenu : m));

    const supabase = createSupabaseClientInstance();
    if (supabase) {
      try {
        await supabase.from('menus').update(updatedMenu).eq('id', updatedMenu.id);
      } catch (e) {
        console.error('Supabase menu update error:', e);
      }
    }
  };

  const handleUpdateOrderStatus = async (orderId: number, status: string, riderId?: number) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          status,
          rider_id: riderId !== undefined ? riderId : o.rider_id
        };
      }
      return o;
    }));

    const supabase = createSupabaseClientInstance();
    if (supabase) {
      try {
        const updatePayload: Record<string, any> = { status };
        if (riderId !== undefined) updatePayload.rider_id = riderId;
        await supabase.from('orders').update(updatePayload).eq('id', orderId);
      } catch (e) {
        console.error('Supabase order status error:', e);
      }
    }
  };

  const handleUpdateRiderStatus = async (riderId: number, status: string, lat?: number, long?: number) => {
    setRiders(prev => prev.map(r => {
      if (r.id === riderId) {
        return {
          ...r,
          status,
          live_lat: lat !== undefined ? lat : r.live_lat,
          live_long: long !== undefined ? long : r.live_long
        };
      }
      return r;
    }));

    const supabase = createSupabaseClientInstance();
    if (supabase) {
      try {
        await supabase.from('riders').update({
          status,
          live_lat: lat,
          live_long: long
        }).eq('id', riderId);
      } catch (e) {
        console.error('Supabase rider update error:', e);
      }
    }
  };

  const handleAddRider = async (newR: Partial<Rider>) => {
    const newId = Date.now();
    const createdR: Rider = {
      id: newId,
      name: newR.name || 'New Rider',
      phone: newR.phone || '+8801700000000',
      status: 'Online',
      live_lat: 23.7910,
      live_long: 90.4060
    };

    setRiders(prev => [...prev, createdR]);

    const supabase = createSupabaseClientInstance();
    if (supabase) {
      try {
        await supabase.from('riders').insert([newR]);
      } catch (e) {
        console.error('Supabase rider insert error:', e);
      }
    }
  };

  const handleAddCustomerService = async (phone: string) => {
    const newId = Date.now();
    const createdCS: CustomerService = { id: newId, phone };
    setCustomerServices(prev => [...prev, createdCS]);

    const supabase = createSupabaseClientInstance();
    if (supabase) {
      try {
        await supabase.from('customer_service').insert([{ phone }]);
      } catch (e) {
        console.error('Supabase helpline insert error:', e);
      }
    }
  };

  const handleDeleteCustomerService = async (id: number) => {
    setCustomerServices(prev => prev.filter(cs => cs.id !== id));

    const supabase = createSupabaseClientInstance();
    if (supabase) {
      try {
        await supabase.from('customer_service').delete().eq('id', id);
      } catch (e) {
        console.error('Supabase helpline delete error:', e);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* Portal Switcher Top Banner */}
      <div className="bg-slate-950 text-white border-b border-slate-800 px-4 py-2 flex flex-col sm:flex-row items-center justify-between gap-2 z-30">
        <div className="flex items-center space-x-2">
          <span className="font-bold text-xs text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded">
            Live System Portals
          </span>
          {isConnectedToSupabase ? (
            <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Supabase DB Connected
            </span>
          ) : (
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <Database className="w-3.5 h-3.5 text-amber-400" /> Interactive Mode (Demo Store)
            </span>
          )}
        </div>

        {/* Portal Tabs */}
        <div className="flex items-center space-x-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActivePortal('customer')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activePortal === 'customer' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" /> Customer Portal
          </button>
          <button
            onClick={() => setActivePortal('vendor')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activePortal === 'vendor' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Store className="w-3.5 h-3.5" /> Vendor Portal
          </button>
          <button
            onClick={() => setActivePortal('rider')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activePortal === 'rider' ? 'bg-sky-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Bike className="w-3.5 h-3.5" /> Rider Portal
          </button>
          <button
            onClick={() => setActivePortal('admin')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activePortal === 'admin' ? 'bg-amber-500 text-slate-950 shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" /> Admin Portal
          </button>
        </div>

        {/* Download Standalone Files Button */}
        <button
          onClick={() => setIsExportModalOpen(true)}
          className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 border border-slate-700 transition"
        >
          <Download className="w-3.5 h-3.5 text-amber-400" /> Export 4 GitHub Repos
        </button>
      </div>

      {/* Main Active Portal View */}
      <div className="flex-1">
        {activePortal === 'customer' && (
          <CustomerPortal
            vendors={vendors}
            menus={menus}
            customers={customers}
            addresses={addresses}
            orders={orders}
            customerServices={customerServices}
            onPlaceOrder={handlePlaceOrder}
          />
        )}

        {activePortal === 'vendor' && (
          <VendorPortal
            vendors={vendors}
            menus={menus}
            orders={orders}
            vendorEarnings={vendorEarnings}
            onUpdateVendor={handleUpdateVendor}
            onAddMenuItem={handleAddMenuItem}
            onUpdateMenuItem={handleUpdateMenuItem}
            onUpdateOrderStatus={handleUpdateOrderStatus}
          />
        )}

        {activePortal === 'rider' && (
          <RiderPortal
            riders={riders}
            orders={orders}
            onUpdateRiderStatus={handleUpdateRiderStatus}
            onUpdateOrderStatus={handleUpdateOrderStatus}
          />
        )}

        {activePortal === 'admin' && (
          <AdminPortal
            vendors={vendors}
            menus={menus}
            riders={riders}
            orders={orders}
            customerServices={customerServices}
            vendorEarnings={vendorEarnings}
            onAddVendor={handleAddVendor}
            onUpdateVendor={handleUpdateVendor}
            onAddRider={handleAddRider}
            onAddCustomerService={handleAddCustomerService}
            onDeleteCustomerService={handleDeleteCustomerService}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onReloadFromSupabase={loadSupabaseData}
          />
        )}
      </div>

      {/* Standalone GitHub Files Download Modal */}
      <ExportFilesModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
      />
    </div>
  );
}
