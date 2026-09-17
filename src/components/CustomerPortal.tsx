import React, { useState } from 'react';
import { Customer, CustomerAddress, CustomerService, MenuItem, Order, OrderItem, Vendor } from '../types';
import { ShoppingBag, Search, MapPin, Phone, Star, Tag, CheckCircle2, Clock, Truck, ChevronRight, X, Plus, Minus } from 'lucide-react';

interface Props {
  vendors: Vendor[];
  menus: MenuItem[];
  customers: Customer[];
  addresses: CustomerAddress[];
  orders: Order[];
  customerServices: CustomerService[];
  onPlaceOrder: (newOrder: Partial<Order>) => void;
}

export const CustomerPortal: React.FC<Props> = ({
  vendors,
  menus,
  customers,
  addresses,
  orders,
  customerServices,
  onPlaceOrder,
}) => {
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // Checkout state
  const activeCustomer = customers[0] || { id: 1, name: 'Anika Rahman', phone: '+8801999888777' };
  const [selectedAddress, setSelectedAddress] = useState<CustomerAddress>(
    addresses[0] || { id: 1, customer_id: 1, lat: 23.795, long: 90.412, description: 'House 42, Road 11, Banani, Dhaka' }
  );
  const [orderPlacedSuccess, setOrderPlacedSuccess] = useState<Order | null>(null);

  // Filter vendors
  const filteredVendors = vendors.filter(v => 
    v.status === 'Active' && 
    (v.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
     v.types?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Filter menus for selected vendor
  const vendorMenus = selectedVendor 
    ? menus.filter(m => m.vendor_id === selectedVendor.id && m.status === 'Active')
    : [];

  const categories = Array.from(new Set(vendorMenus.map(m => m.category || 'General')));

  const filteredMenus = vendorMenus.filter(m => {
    const matchesCategory = selectedCategory === 'All' || (m.category || 'General') === selectedCategory;
    const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          m.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const addToCart = (item: MenuItem) => {
    // Check if adding from a different vendor
    if (cart.length > 0 && selectedVendor && cartVendorId !== selectedVendor.id) {
      if (!confirm('Your cart contains items from another restaurant. Clear cart and add this item?')) {
        return;
      }
      setCart([]);
    }

    const existingIndex = cart.findIndex(c => c.menu_id === item.id);
    const itemPrice = item.discount > 0 ? item.price * (1 - item.discount / 100) : item.price;

    if (existingIndex > -1) {
      const updated = [...cart];
      updated[existingIndex].quantity += 1;
      updated[existingIndex].subtotal = updated[existingIndex].quantity * updated[existingIndex].price;
      setCart(updated);
    } else {
      setCart([
        ...cart,
        {
          menu_id: item.id,
          name: item.name,
          price: Math.round(itemPrice),
          quantity: 1,
          subtotal: Math.round(itemPrice)
        }
      ]);
    }
  };

  const updateQuantity = (menuId: number, delta: number) => {
    const updated = cart.map(item => {
      if (item.menu_id === menuId) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty, subtotal: newQty * item.price } : null;
      }
      return item;
    }).filter(Boolean) as OrderItem[];
    setCart(updated);
  };

  const cartVendorId = selectedVendor?.id;
  const cartTotal = cart.reduce((sum, item) => sum + item.subtotal, 0);

  const handleCheckout = () => {
    if (cart.length === 0 || !selectedVendor) return;

    const newOrder: Partial<Order> = {
      vendor_id: selectedVendor.id,
      customer_id: activeCustomer.id,
      customer_name: activeCustomer.name,
      vendor_name: selectedVendor.name,
      items: cart,
      amount: cartTotal,
      delivery_lat: selectedAddress.lat,
      delivery_long: selectedAddress.long,
      vendor_lat: selectedVendor.lat || 23.7925,
      vendor_long: selectedVendor.long || 90.4078,
      status: 'Pending',
      time: new Date().toISOString()
    };

    onPlaceOrder(newOrder);
    setOrderPlacedSuccess(newOrder as Order);
    setCart([]);
    setIsCartOpen(false);
  };

  // Active Customer Orders
  const myOrders = orders.filter(o => o.customer_id === activeCustomer.id);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      {/* Top Banner & Customer Header */}
      <header className="bg-emerald-600 text-white shadow-md sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center font-bold text-xl">
              🍔
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight">FoodExpress Customer Portal</h1>
              <p className="text-xs text-emerald-100 flex items-center gap-1">
                <MapPin className="w-3 h-3" /> {selectedAddress.description}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsCartOpen(true)}
              id="customer-cart-btn"
              className="relative bg-white text-emerald-700 px-3 py-2 rounded-xl font-medium text-sm flex items-center gap-2 shadow-sm hover:bg-emerald-50 transition"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Cart</span>
              {cart.length > 0 && (
                <span className="bg-amber-500 text-slate-900 font-bold text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {cart.reduce((a, b) => a + b.quantity, 0)}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-8">
        {/* Customer Helpline Bar */}
        {customerServices.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-center justify-between text-xs text-amber-900 shadow-sm">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-amber-600" />
              <span className="font-semibold">Customer Support Helpline:</span>
              <span>{customerServices.map(cs => cs.phone).join(' | ')}</span>
            </div>
            <span className="bg-amber-200 text-amber-900 font-medium px-2 py-0.5 rounded-full">24/7 Available</span>
          </div>
        )}

        {/* Selected Vendor Detail or Restaurant Grid */}
        {selectedVendor ? (
          <div className="space-y-6">
            <button
              onClick={() => { setSelectedVendor(null); setSelectedCategory('All'); }}
              className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 hover:bg-emerald-100 flex items-center gap-1"
            >
              ← Back to All Restaurants
            </button>

            {/* Vendor Banner Card */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6 items-start">
              <img
                src={selectedVendor.profile_image_url || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80'}
                alt={selectedVendor.name}
                className="w-full md:w-48 h-36 object-cover rounded-xl"
              />
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold text-slate-900">{selectedVendor.name}</h2>
                  {selectedVendor.boost && (
                    <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Star className="w-3 h-3 fill-amber-500 text-amber-500" /> Featured
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" /> {selectedVendor.address}
                </p>
                <p className="text-xs text-slate-600">Cuisines: <span className="font-medium text-slate-800">{selectedVendor.types}</span></p>
                {selectedVendor.discount > 0 && (
                  <div className="inline-flex items-center gap-1 text-xs font-bold bg-rose-50 text-rose-600 px-2.5 py-1 rounded-lg border border-rose-100">
                    <Tag className="w-3.5 h-3.5" /> Flat {selectedVendor.discount}% OFF on vendor items!
                  </div>
                )}
              </div>
            </div>

            {/* Menu Search & Categories */}
            <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
              <div className="relative w-full md:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search dishes..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1">
                <button
                  onClick={() => setSelectedCategory('All')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition ${
                    selectedCategory === 'All' ? 'bg-emerald-600 text-white' : 'bg-white text-slate-600 border border-slate-200'
                  }`}
                >
                  All Items
                </button>
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition ${
                      selectedCategory === cat ? 'bg-emerald-600 text-white' : 'bg-white text-slate-600 border border-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Menu Items Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMenus.map(menu => {
                const effectiveDiscount = menu.discount > 0 ? menu.discount : selectedVendor.discount;
                const finalPrice = effectiveDiscount > 0 ? Math.round(menu.price * (1 - effectiveDiscount / 100)) : menu.price;

                return (
                  <div key={menu.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col">
                    <div className="relative h-40 bg-slate-100">
                      <img
                        src={menu.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80'}
                        alt={menu.name}
                        className="w-full h-full object-cover"
                      />
                      {effectiveDiscount > 0 && (
                        <span className="absolute top-2 left-2 bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                          {effectiveDiscount}% OFF
                        </span>
                      )}
                      {!menu.available && (
                        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center text-white font-bold text-xs">
                          Out of Stock
                        </div>
                      )}
                    </div>

                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-bold text-slate-900 text-sm">{menu.name}</h3>
                          <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium">
                            {menu.category || 'Food'}
                          </span>
                        </div>
                        {menu.description && (
                          <p className="text-xs text-slate-500 line-clamp-2 mt-1">{menu.description}</p>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                        <div>
                          <span className="text-emerald-700 font-bold text-base">৳{finalPrice}</span>
                          {effectiveDiscount > 0 && (
                            <span className="text-slate-400 line-through text-xs ml-1 font-medium">৳{menu.price}</span>
                          )}
                        </div>

                        <button
                          disabled={!menu.available}
                          onClick={() => addToCart(menu)}
                          className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1 transition"
                        >
                          <Plus className="w-3.5 h-3.5" /> Add
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* Vendors Search & Listing */
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white p-6 rounded-2xl shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center md:text-left">
                <h2 className="text-2xl font-bold">Craving Delicious Food?</h2>
                <p className="text-emerald-100 text-xs">Order from top rated local restaurants with superfast delivery.</p>
              </div>

              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search restaurants or cuisines..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-white text-slate-900 border border-slate-200 rounded-xl text-sm focus:outline-none"
                />
              </div>
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-4">Featured Restaurants</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredVendors.map(vendor => (
                  <div
                    key={vendor.id}
                    onClick={() => setSelectedVendor(vendor)}
                    className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer group"
                  >
                    <div className="relative h-44 bg-slate-100 overflow-hidden">
                      <img
                        src={vendor.profile_image_url || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80'}
                        alt={vendor.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                      {vendor.boost && (
                        <span className="absolute top-3 left-3 bg-amber-500 text-slate-900 text-[11px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                          <Star className="w-3.5 h-3.5 fill-slate-900" /> Featured
                        </span>
                      )}
                      {vendor.discount > 0 && (
                        <span className="absolute top-3 right-3 bg-rose-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg shadow-sm">
                          {vendor.discount}% OFF
                        </span>
                      )}
                    </div>

                    <div className="p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-slate-900 text-base group-hover:text-emerald-600 transition">{vendor.name}</h3>
                        <span className="text-xs bg-emerald-50 text-emerald-700 font-semibold px-2 py-0.5 rounded-md">
                          {vendor.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-1 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" /> {vendor.address}
                      </p>
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                        <span>{vendor.types}</span>
                        <span className="text-emerald-700 font-semibold flex items-center gap-0.5">
                          View Menu <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Active Orders Section */}
        {myOrders.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-sm">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-emerald-600" /> My Recent Orders
            </h2>

            <div className="space-y-3">
              {myOrders.map(ord => (
                <div key={ord.id} className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">Order #{ord.id}</span>
                      <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                        ord.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800' :
                        ord.status === 'Preparing' ? 'bg-amber-100 text-amber-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {ord.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">Vendor: <span className="font-medium">{ord.vendor_name}</span></p>
                    <p className="text-xs text-slate-500">
                      Items: {ord.items.map(i => `${i.name} x${i.quantity}`).join(', ')}
                    </p>
                  </div>

                  <div className="text-right flex flex-col items-end">
                    <span className="text-sm font-bold text-slate-900">৳{ord.amount}</span>
                    <span className="text-[11px] text-slate-400">{new Date(ord.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex justify-end">
          <div className="w-full max-w-md bg-white h-full flex flex-col shadow-2xl">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h2 className="font-bold text-slate-900 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-emerald-600" /> Your Food Basket
              </h2>
              <button onClick={() => setIsCartOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 flex-1 overflow-y-auto space-y-4">
              {cart.length === 0 ? (
                <div className="text-center py-12 text-slate-400 space-y-2">
                  <ShoppingBag className="w-12 h-12 mx-auto stroke-1 text-slate-300" />
                  <p className="text-sm font-medium">Your cart is empty</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {cart.map(item => (
                    <div key={item.menu_id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <div>
                        <h4 className="font-semibold text-sm text-slate-900">{item.name}</h4>
                        <span className="text-xs text-emerald-700 font-bold">৳{item.price} each</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.menu_id, -1)}
                          className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold text-slate-800 w-4 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.menu_id, 1)}
                          className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center hover:bg-emerald-700"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Delivery Location Selection */}
                  <div className="pt-4 border-t border-slate-200 space-y-2">
                    <label className="text-xs font-bold text-slate-700">Delivery Address</label>
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs space-y-1">
                      <p className="font-semibold text-emerald-900">{selectedAddress.description}</p>
                      <p className="text-slate-500">Coordinates: {selectedAddress.lat}, {selectedAddress.long}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-4 border-t border-slate-200 bg-slate-50 space-y-3">
                <div className="flex justify-between text-sm font-bold text-slate-900">
                  <span>Total Payable:</span>
                  <span className="text-emerald-700 text-base">৳{cartTotal}</span>
                </div>

                <button
                  onClick={handleCheckout}
                  id="place-order-btn"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl text-sm transition shadow-md flex items-center justify-center gap-2"
                >
                  Confirm & Place Order
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Success Modal */}
      {orderPlacedSuccess && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full text-center space-y-4 shadow-2xl">
            <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto" />
            <h3 className="text-xl font-bold text-slate-900">Order Placed Successfully!</h3>
            <p className="text-xs text-slate-500">Your order #{orderPlacedSuccess.id || 'NEW'} has been sent to {orderPlacedSuccess.vendor_name}.</p>
            <button
              onClick={() => setOrderPlacedSuccess(null)}
              className="w-full bg-emerald-600 text-white font-bold py-2.5 rounded-xl text-xs hover:bg-emerald-700"
            >
              Track Order Status
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
