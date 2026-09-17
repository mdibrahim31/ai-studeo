import React, { useState } from 'react';
import { MenuItem, Order, Vendor, VendorEarning } from '../types';
import { Store, Utensils, DollarSign, PackageCheck, Plus, Edit2, Check, Star, RefreshCw, Power } from 'lucide-react';

interface Props {
  vendors: Vendor[];
  menus: MenuItem[];
  orders: Order[];
  vendorEarnings: VendorEarning[];
  onUpdateVendor: (vendor: Vendor) => void;
  onAddMenuItem: (menu: Partial<MenuItem>) => void;
  onUpdateMenuItem: (menu: MenuItem) => void;
  onUpdateOrderStatus: (orderId: number, status: string) => void;
}

export const VendorPortal: React.FC<Props> = ({
  vendors,
  menus,
  orders,
  vendorEarnings,
  onUpdateVendor,
  onAddMenuItem,
  onUpdateMenuItem,
  onUpdateOrderStatus,
}) => {
  const [selectedVendorId, setSelectedVendorId] = useState<number>(vendors[0]?.id || 1);
  const currentVendor = vendors.find(v => v.id === selectedVendorId) || vendors[0];

  // Forms & Modals
  const [activeTab, setActiveTab] = useState<'orders' | 'menus' | 'profile'>('orders');
  const [isAddMenuModalOpen, setIsAddMenuModalOpen] = useState(false);

  // New Menu Item Form state
  const [newMenu, setNewMenu] = useState<Partial<MenuItem>>({
    name: '',
    description: '',
    price: 100,
    discount: 0,
    category: 'Fast Food',
    available: true,
    image_url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80'
  });

  if (!currentVendor) {
    return <div className="p-8 text-center text-slate-500">No vendor registered in system.</div>;
  }

  // Current vendor menus & orders
  const vendorMenus = menus.filter(m => m.vendor_id === currentVendor.id);
  const vendorOrders = orders.filter(o => o.vendor_id === currentVendor.id);
  const totalEarning = vendorEarnings.find(e => e.vendor_id === currentVendor.id)?.amount || 0;

  const handleAddMenuSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMenu.name || !newMenu.price) return;

    onAddMenuItem({
      ...newMenu,
      vendor_id: currentVendor.id,
      status: 'Active',
      boost: false,
    });

    setIsAddMenuModalOpen(false);
    setNewMenu({
      name: '',
      description: '',
      price: 100,
      discount: 0,
      category: 'Fast Food',
      available: true,
      image_url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80'
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      {/* Header Bar */}
      <header className="bg-indigo-700 text-white shadow-md sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center font-bold text-xl">
              🏪
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight">Vendor Management Portal</h1>
              <p className="text-xs text-indigo-100">{currentVendor.name}</p>
            </div>
          </div>

          {/* Switch Active Vendor Selector */}
          <div className="flex items-center space-x-2">
            <label className="text-xs text-indigo-100 hidden sm:inline">Select Vendor:</label>
            <select
              value={currentVendor.id}
              onChange={e => setSelectedVendorId(Number(e.target.value))}
              className="bg-indigo-800 text-white text-xs font-semibold px-3 py-1.5 rounded-lg border border-indigo-500 focus:outline-none"
            >
              {vendors.map(v => (
                <option key={v.id} value={v.id}>{v.name}</option>
              ))}
            </select>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Vendor Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400">Total Revenue</p>
              <p className="text-xl font-bold text-slate-900">৳{totalEarning}</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <PackageCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400">Total Orders</p>
              <p className="text-xl font-bold text-slate-900">{vendorOrders.length}</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Utensils className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400">Menu Items</p>
              <p className="text-xl font-bold text-slate-900">{vendorMenus.length}</p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 space-x-4">
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-2.5 text-sm font-bold flex items-center gap-2 border-b-2 transition ${
              activeTab === 'orders' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <PackageCheck className="w-4 h-4" /> Incoming Orders ({vendorOrders.length})
          </button>
          <button
            onClick={() => setActiveTab('menus')}
            className={`pb-2.5 text-sm font-bold flex items-center gap-2 border-b-2 transition ${
              activeTab === 'menus' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Utensils className="w-4 h-4" /> Menu Catalog ({vendorMenus.length})
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-2.5 text-sm font-bold flex items-center gap-2 border-b-2 transition ${
              activeTab === 'profile' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Store className="w-4 h-4" /> Vendor Settings
          </button>
        </div>

        {/* TAB 1: ORDERS */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900">Manage Kitchen Orders</h2>
              <span className="text-xs text-slate-500">Live order status updates</span>
            </div>

            {vendorOrders.length === 0 ? (
              <div className="bg-white p-8 rounded-xl text-center text-slate-400 border border-slate-200">
                No orders received yet for this vendor.
              </div>
            ) : (
              <div className="space-y-3">
                {vendorOrders.map(order => (
                  <div key={order.id} className="bg-white rounded-xl border border-slate-200 p-4 space-y-3 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-sm">Order #{order.id}</span>
                          <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">
                            Customer: {order.customer_name}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400">Placed on: {new Date(order.time).toLocaleString()}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500 font-semibold">Status:</span>
                        <select
                          value={order.status}
                          onChange={e => onUpdateOrderStatus(order.id, e.target.value)}
                          className="bg-indigo-50 border border-indigo-200 text-indigo-900 text-xs font-bold px-3 py-1.5 rounded-lg focus:outline-none"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Preparing">Preparing</option>
                          <option value="Ready for Pickup">Ready for Pickup</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <p className="text-xs font-bold text-slate-700">Order Items:</p>
                      <ul className="text-xs text-slate-600 divide-y divide-slate-100">
                        {order.items.map((it, idx) => (
                          <li key={idx} className="py-1 flex justify-between">
                            <span>{it.name} x {it.quantity}</span>
                            <span className="font-semibold text-slate-800">৳{it.subtotal}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-xs">
                      <span className="text-slate-500">Delivery Lat/Long: {order.delivery_lat}, {order.delivery_long}</span>
                      <span className="font-bold text-slate-900 text-sm">Total: ৳{order.amount}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: MENUS */}
        {activeTab === 'menus' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900">Food Items & Prices</h2>
              <button
                onClick={() => setIsAddMenuModalOpen(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition"
              >
                <Plus className="w-4 h-4" /> Add New Dish
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {vendorMenus.map(menu => (
                <div key={menu.id} className="bg-white rounded-xl border border-slate-200 p-4 space-y-3 shadow-sm flex flex-col justify-between">
                  <div className="space-y-2">
                    <img
                      src={menu.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80'}
                      alt={menu.name}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm">{menu.name}</h3>
                        <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">
                          {menu.category || 'Food'}
                        </span>
                      </div>
                      <span className="font-bold text-indigo-700 text-sm">৳{menu.price}</span>
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-2">{menu.description}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <button
                      onClick={() => onUpdateMenuItem({ ...menu, available: !menu.available })}
                      className={`px-2.5 py-1 rounded-lg font-semibold text-[11px] flex items-center gap-1 ${
                        menu.available ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      <Power className="w-3 h-3" /> {menu.available ? 'In Stock' : 'Out of Stock'}
                    </button>

                    <button
                      onClick={() => onUpdateMenuItem({ ...menu, boost: !menu.boost })}
                      className={`px-2.5 py-1 rounded-lg font-semibold text-[11px] flex items-center gap-1 ${
                        menu.boost ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      <Star className="w-3 h-3" /> {menu.boost ? 'Boosted' : 'Normal'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: VENDOR PROFILE */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 max-w-2xl mx-auto space-y-4 shadow-sm">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">Update Restaurant Settings</h2>

            <div className="grid grid-cols-1 gap-4 text-xs">
              <div>
                <label className="font-bold text-slate-700">Restaurant Name</label>
                <input
                  type="text"
                  value={currentVendor.name}
                  onChange={e => onUpdateVendor({ ...currentVendor, name: e.target.value })}
                  className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700">Phone Number</label>
                <input
                  type="text"
                  value={currentVendor.phone || ''}
                  onChange={e => onUpdateVendor({ ...currentVendor, phone: e.target.value })}
                  className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700">Address</label>
                <input
                  type="text"
                  value={currentVendor.address || ''}
                  onChange={e => onUpdateVendor({ ...currentVendor, address: e.target.value })}
                  className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700">Discount %</label>
                  <input
                    type="number"
                    value={currentVendor.discount}
                    onChange={e => onUpdateVendor({ ...currentVendor, discount: Number(e.target.value) })}
                    className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700">Status</label>
                  <select
                    value={currentVendor.status}
                    onChange={e => onUpdateVendor({ ...currentVendor, status: e.target.value })}
                    className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700">Profile Image URL</label>
                <input
                  type="text"
                  value={currentVendor.profile_image_url || ''}
                  onChange={e => onUpdateVendor({ ...currentVendor, profile_image_url: e.target.value })}
                  className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Add Menu Item Modal */}
      {isAddMenuModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <form onSubmit={handleAddMenuSubmit} className="bg-white rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900">Add New Dish to Menu</h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700">Dish Name</label>
                <input
                  required
                  type="text"
                  value={newMenu.name}
                  onChange={e => setNewMenu({ ...newMenu, name: e.target.value })}
                  placeholder="e.g. Spicy Chicken Pizza"
                  className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700">Category</label>
                <input
                  type="text"
                  value={newMenu.category}
                  onChange={e => setNewMenu({ ...newMenu, category: e.target.value })}
                  placeholder="e.g. Fast Food, Drinks"
                  className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700">Price (৳)</label>
                  <input
                    required
                    type="number"
                    value={newMenu.price}
                    onChange={e => setNewMenu({ ...newMenu, price: Number(e.target.value) })}
                    className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700">Discount %</label>
                  <input
                    type="number"
                    value={newMenu.discount}
                    onChange={e => setNewMenu({ ...newMenu, discount: Number(e.target.value) })}
                    className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700">Description</label>
                <textarea
                  value={newMenu.description}
                  onChange={e => setNewMenu({ ...newMenu, description: e.target.value })}
                  className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                  rows={2}
                />
              </div>

              <div>
                <label className="font-bold text-slate-700">Image URL</label>
                <input
                  type="text"
                  value={newMenu.image_url}
                  onChange={e => setNewMenu({ ...newMenu, image_url: e.target.value })}
                  className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAddMenuModalOpen(false)}
                className="flex-1 bg-slate-100 text-slate-700 font-bold py-2 rounded-xl text-xs hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 bg-indigo-600 text-white font-bold py-2 rounded-xl text-xs hover:bg-indigo-700"
              >
                Save Menu Item
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
