import React, { useState } from 'react';
import { CustomerService, MenuItem, Order, Rider, Vendor, VendorEarning } from '../types';
import { ShieldCheck, Users, Store, Bike, DollarSign, Database, Plus, Trash2, CheckCircle2, PhoneCall, Star, Power } from 'lucide-react';
import { getStoredSupabaseCredentials, saveSupabaseCredentials } from '../lib/supabase';

interface Props {
  vendors: Vendor[];
  menus: MenuItem[];
  riders: Rider[];
  orders: Order[];
  customerServices: CustomerService[];
  vendorEarnings: VendorEarning[];
  onAddVendor: (vendor: Partial<Vendor>) => void;
  onUpdateVendor: (vendor: Vendor) => void;
  onAddRider: (rider: Partial<Rider>) => void;
  onAddCustomerService: (phone: string) => void;
  onDeleteCustomerService: (id: number) => void;
  onUpdateOrderStatus: (orderId: number, status: string, riderId?: number) => void;
  onReloadFromSupabase: () => void;
}

export const AdminPortal: React.FC<Props> = ({
  vendors,
  menus,
  riders,
  orders,
  customerServices,
  vendorEarnings,
  onAddVendor,
  onUpdateVendor,
  onAddRider,
  onAddCustomerService,
  onDeleteCustomerService,
  onUpdateOrderStatus,
  onReloadFromSupabase,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'vendors' | 'riders' | 'helpline' | 'database'>('overview');

  // Supabase Settings Form
  const credentials = getStoredSupabaseCredentials();
  const [supabaseUrl, setSupabaseUrl] = useState(credentials.url);
  const [supabaseKey, setSupabaseKey] = useState(credentials.key);
  const [dbSaveSuccess, setDbSaveSuccess] = useState(false);

  // Modal forms
  const [isAddVendorOpen, setIsAddVendorOpen] = useState(false);
  const [newVendor, setNewVendor] = useState<Partial<Vendor>>({
    name: '',
    address: '',
    phone: '',
    types: 'Fast Food',
    discount: 0,
    boost: false,
    status: 'Active',
    profile_image_url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80'
  });

  const [isAddRiderOpen, setIsAddRiderOpen] = useState(false);
  const [newRider, setNewRider] = useState<Partial<Rider>>({
    name: '',
    phone: '',
    status: 'Online',
    live_lat: 23.7910,
    live_long: 90.4060
  });

  const [newHelplinePhone, setNewHelplinePhone] = useState('');

  const totalRevenue = vendorEarnings.reduce((a, b) => a + b.amount, 0);

  const handleSaveDatabaseConfig = (e: React.FormEvent) => {
    e.preventDefault();
    saveSupabaseCredentials(supabaseUrl, supabaseKey);
    setDbSaveSuccess(true);
    setTimeout(() => setDbSaveSuccess(false), 3000);
    onReloadFromSupabase();
  };

  const handleCreateVendor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVendor.name) return;
    onAddVendor(newVendor);
    setIsAddVendorOpen(false);
    setNewVendor({
      name: '',
      address: '',
      phone: '',
      types: 'Fast Food',
      discount: 0,
      boost: false,
      status: 'Active',
      profile_image_url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80'
    });
  };

  const handleCreateRider = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRider.name || !newRider.phone) return;
    onAddRider(newRider);
    setIsAddRiderOpen(false);
    setNewRider({
      name: '',
      phone: '',
      status: 'Online',
      live_lat: 23.7910,
      live_long: 90.4060
    });
  };

  const handleAddHelpline = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHelplinePhone) return;
    onAddCustomerService(newHelplinePhone);
    setNewHelplinePhone('');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      {/* Header Bar */}
      <header className="bg-slate-900 text-white shadow-md sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center font-bold text-xl text-slate-950">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight">Super Admin Dashboard</h1>
              <p className="text-xs text-slate-400">Multi-Vendor Food Delivery Control Center</p>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('database')}
            className="bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition"
          >
            <Database className="w-4 h-4" /> Supabase Config
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 space-x-4 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-2 text-sm font-bold flex items-center gap-2 border-b-2 whitespace-nowrap transition ${
              activeTab === 'overview' ? 'border-amber-500 text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            System Overview
          </button>
          <button
            onClick={() => setActiveTab('vendors')}
            className={`pb-2 text-sm font-bold flex items-center gap-2 border-b-2 whitespace-nowrap transition ${
              activeTab === 'vendors' ? 'border-amber-500 text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Vendors ({vendors.length})
          </button>
          <button
            onClick={() => setActiveTab('riders')}
            className={`pb-2 text-sm font-bold flex items-center gap-2 border-b-2 whitespace-nowrap transition ${
              activeTab === 'riders' ? 'border-amber-500 text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Riders ({riders.length})
          </button>
          <button
            onClick={() => setActiveTab('helpline')}
            className={`pb-2 text-sm font-bold flex items-center gap-2 border-b-2 whitespace-nowrap transition ${
              activeTab === 'helpline' ? 'border-amber-500 text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Helplines ({customerServices.length})
          </button>
          <button
            onClick={() => setActiveTab('database')}
            className={`pb-2 text-sm font-bold flex items-center gap-2 border-b-2 whitespace-nowrap transition ${
              activeTab === 'database' ? 'border-amber-500 text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Supabase DB Settings
          </button>
        </div>

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
                <span className="text-xs text-slate-400 font-semibold">Total Vendors</span>
                <p className="text-2xl font-bold text-slate-900">{vendors.length}</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
                <span className="text-xs text-slate-400 font-semibold">Active Riders</span>
                <p className="text-2xl font-bold text-emerald-600">{riders.filter(r => r.status === 'Online').length}</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
                <span className="text-xs text-slate-400 font-semibold">Total Orders</span>
                <p className="text-2xl font-bold text-indigo-600">{orders.length}</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
                <span className="text-xs text-slate-400 font-semibold">Platform Earnings</span>
                <p className="text-2xl font-bold text-amber-600">৳{totalRevenue}</p>
              </div>
            </div>

            {/* System Live Orders Monitor */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-sm">
              <h2 className="text-base font-bold text-slate-900">All Live Orders Monitor</h2>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-700 font-bold">
                    <tr>
                      <th className="p-3">Order ID</th>
                      <th className="p-3">Customer</th>
                      <th className="p-3">Vendor</th>
                      <th className="p-3">Amount</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Assigned Rider</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {orders.map(ord => (
                      <tr key={ord.id} className="hover:bg-slate-50">
                        <td className="p-3 font-bold text-slate-900">#{ord.id}</td>
                        <td className="p-3">{ord.customer_name}</td>
                        <td className="p-3">{ord.vendor_name}</td>
                        <td className="p-3 font-bold text-slate-900">৳{ord.amount}</td>
                        <td className="p-3">
                          <select
                            value={ord.status}
                            onChange={e => onUpdateOrderStatus(ord.id, e.target.value)}
                            className="bg-slate-100 border border-slate-200 text-slate-900 text-xs font-semibold px-2 py-1 rounded"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Preparing">Preparing</option>
                            <option value="Ready for Pickup">Ready for Pickup</option>
                            <option value="Picked Up">Picked Up</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="p-3">
                          <select
                            value={ord.rider_id || ''}
                            onChange={e => onUpdateOrderStatus(ord.id, ord.status, Number(e.target.value))}
                            className="bg-slate-100 border border-slate-200 text-slate-900 text-xs px-2 py-1 rounded"
                          >
                            <option value="">Unassigned</option>
                            {riders.map(r => (
                              <option key={r.id} value={r.id}>{r.name}</option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* VENDORS TAB */}
        {activeTab === 'vendors' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-base font-bold text-slate-900">Manage System Vendors</h2>
              <button
                onClick={() => setIsAddVendorOpen(true)}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="w-4 h-4" /> Add Vendor
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {vendors.map(vendor => (
                <div key={vendor.id} className="bg-white rounded-xl border border-slate-200 p-4 space-y-3 shadow-sm">
                  <div className="flex items-center gap-3">
                    <img
                      src={vendor.profile_image_url || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80'}
                      alt={vendor.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">{vendor.name}</h3>
                      <p className="text-xs text-slate-500">{vendor.phone}</p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600">{vendor.address}</p>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <button
                      onClick={() => onUpdateVendor({ ...vendor, status: vendor.status === 'Active' ? 'Inactive' : 'Active' })}
                      className={`px-2.5 py-1 rounded-lg font-bold ${
                        vendor.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {vendor.status}
                    </button>

                    <button
                      onClick={() => onUpdateVendor({ ...vendor, boost: !vendor.boost })}
                      className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 ${
                        vendor.boost ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      <Star className="w-3 h-3" /> {vendor.boost ? 'Boosted' : 'Boost'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* RIDERS TAB */}
        {activeTab === 'riders' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-base font-bold text-slate-900">Manage Registered Delivery Riders</h2>
              <button
                onClick={() => setIsAddRiderOpen(true)}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="w-4 h-4" /> Add Rider
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {riders.map(r => (
                <div key={r.id} className="bg-white rounded-xl border border-slate-200 p-4 space-y-2 shadow-sm">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-slate-900 text-sm">{r.name}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded font-bold ${
                      r.status === 'Online' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {r.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">Phone: {r.phone}</p>
                  <p className="text-xs text-slate-400">Live GPS: {r.live_lat}, {r.live_long}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* HELPLINE TAB */}
        {activeTab === 'helpline' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 max-w-xl mx-auto space-y-4 shadow-sm">
            <h2 className="text-base font-bold text-slate-900">Customer Support Helplines</h2>

            <form onSubmit={handleAddHelpline} className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. +8801700112233"
                value={newHelplinePhone}
                onChange={e => setNewHelplinePhone(e.target.value)}
                className="flex-1 p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none"
              />
              <button
                type="submit"
                className="bg-slate-900 text-white font-bold text-xs px-4 py-2 rounded-xl"
              >
                Add Helpline
              </button>
            </form>

            <div className="divide-y divide-slate-100">
              {customerServices.map(cs => (
                <div key={cs.id} className="py-2.5 flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800 flex items-center gap-2">
                    <PhoneCall className="w-3.5 h-3.5 text-emerald-600" /> {cs.phone}
                  </span>
                  <button
                    onClick={() => onDeleteCustomerService(cs.id)}
                    className="text-rose-600 hover:text-rose-800 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* DATABASE SETTINGS TAB */}
        {activeTab === 'database' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 max-w-2xl mx-auto space-y-4 shadow-sm">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Database className="w-5 h-5 text-emerald-600" />
              <h2 className="text-base font-bold text-slate-900">Supabase Connection Config</h2>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Connect your Supabase Database directly by entering your Supabase Project URL and Anon API key below.
              These credentials will be saved locally in your browser.
            </p>

            <form onSubmit={handleSaveDatabaseConfig} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700">Supabase Project URL</label>
                <input
                  required
                  type="text"
                  value={supabaseUrl}
                  onChange={e => setSupabaseUrl(e.target.value)}
                  placeholder="https://xyz.supabase.co"
                  className="w-full mt-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700">Supabase Anon Key</label>
                <input
                  required
                  type="password"
                  value={supabaseKey}
                  onChange={e => setSupabaseKey(e.target.value)}
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  className="w-full mt-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl text-xs transition shadow-sm"
                >
                  Save & Connect Supabase Client
                </button>
              </div>

              {dbSaveSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 font-bold text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Supabase Credentials Saved! Connected to live database.
                </div>
              )}
            </form>
          </div>
        )}
      </main>

      {/* Add Vendor Modal */}
      {isAddVendorOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <form onSubmit={handleCreateVendor} className="bg-white rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900">Add New Vendor</h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700">Vendor Name</label>
                <input
                  required
                  type="text"
                  value={newVendor.name}
                  onChange={e => setNewVendor({ ...newVendor, name: e.target.value })}
                  placeholder="e.g. Master Chef Biryani"
                  className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700">Cuisine Types</label>
                <input
                  type="text"
                  value={newVendor.types}
                  onChange={e => setNewVendor({ ...newVendor, types: e.target.value })}
                  placeholder="e.g. Biryani, Fast Food"
                  className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700">Phone</label>
                <input
                  type="text"
                  value={newVendor.phone}
                  onChange={e => setNewVendor({ ...newVendor, phone: e.target.value })}
                  placeholder="+8801700000000"
                  className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700">Address</label>
                <input
                  type="text"
                  value={newVendor.address}
                  onChange={e => setNewVendor({ ...newVendor, address: e.target.value })}
                  placeholder="Gulshan, Dhaka"
                  className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAddVendorOpen(false)}
                className="flex-1 bg-slate-100 text-slate-700 font-bold py-2 rounded-xl text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 bg-amber-500 text-slate-950 font-bold py-2 rounded-xl text-xs"
              >
                Save Vendor
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Add Rider Modal */}
      {isAddRiderOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <form onSubmit={handleCreateRider} className="bg-white rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900">Add New Rider</h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700">Rider Name</label>
                <input
                  required
                  type="text"
                  value={newRider.name}
                  onChange={e => setNewRider({ ...newRider, name: e.target.value })}
                  placeholder="e.g. Tariqul Islam"
                  className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700">Phone</label>
                <input
                  required
                  type="text"
                  value={newRider.phone}
                  onChange={e => setNewRider({ ...newRider, phone: e.target.value })}
                  placeholder="+8801811223344"
                  className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAddRiderOpen(false)}
                className="flex-1 bg-slate-100 text-slate-700 font-bold py-2 rounded-xl text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 bg-amber-500 text-slate-950 font-bold py-2 rounded-xl text-xs"
              >
                Save Rider
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
