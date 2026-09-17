import React, { useState } from 'react';
import { Order, Rider } from '../types';
import { Navigation, Bike, CheckCircle2, MapPin, Phone, Power, RefreshCw, Clock } from 'lucide-react';

interface Props {
  riders: Rider[];
  orders: Order[];
  onUpdateRiderStatus: (riderId: number, status: string, lat?: number, long?: number) => void;
  onUpdateOrderStatus: (orderId: number, status: string, riderId?: number) => void;
}

export const RiderPortal: React.FC<Props> = ({
  riders,
  orders,
  onUpdateRiderStatus,
  onUpdateOrderStatus,
}) => {
  const [selectedRiderId, setSelectedRiderId] = useState<number>(riders[0]?.id || 1);
  const currentRider = riders.find(r => r.id === selectedRiderId) || riders[0];

  const [liveLat, setLiveLat] = useState<number>(currentRider?.live_lat || 23.7910);
  const [liveLong, setLiveLong] = useState<number>(currentRider?.live_long || 90.4060);

  if (!currentRider) {
    return <div className="p-8 text-center text-slate-500">No riders configured in database.</div>;
  }

  // Available & Active Deliveries
  const activeDelivery = orders.find(o => o.rider_id === currentRider.id && o.status !== 'Delivered' && o.status !== 'Cancelled');
  const availableOrders = orders.filter(o => !o.rider_id && (o.status === 'Pending' || o.status === 'Preparing' || o.status === 'Ready for Pickup'));
  const completedDeliveries = orders.filter(o => o.rider_id === currentRider.id && o.status === 'Delivered');

  const handleStatusToggle = () => {
    const nextStatus = currentRider.status === 'Online' ? 'Offline' : 'Online';
    onUpdateRiderStatus(currentRider.id, nextStatus, liveLat, liveLong);
  };

  const handleUpdateLocation = () => {
    onUpdateRiderStatus(currentRider.id, currentRider.status, liveLat, liveLong);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      {/* Header Bar */}
      <header className="bg-sky-700 text-white shadow-md sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center font-bold text-xl">
              🛵
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight">Delivery Rider Portal</h1>
              <p className="text-xs text-sky-100">{currentRider.name} ({currentRider.phone})</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <label className="text-xs text-sky-100 hidden sm:inline">Active Rider Profile:</label>
            <select
              value={currentRider.id}
              onChange={e => {
                const id = Number(e.target.value);
                setSelectedRiderId(id);
                const r = riders.find(rd => rd.id === id);
                if (r) {
                  setLiveLat(r.live_lat || 23.7910);
                  setLiveLong(r.live_long || 90.4060);
                }
              }}
              className="bg-sky-800 text-white text-xs font-semibold px-3 py-1.5 rounded-lg border border-sky-500 focus:outline-none"
            >
              {riders.map(r => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Rider Online/Offline & GPS Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className={`w-3.5 h-3.5 rounded-full ${currentRider.status === 'Online' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
              <div>
                <h2 className="font-bold text-slate-900 text-base">Rider Duty Status</h2>
                <p className="text-xs text-slate-500">
                  Current Status: <span className="font-bold text-sky-700">{currentRider.status}</span>
                </p>
              </div>
            </div>

            <button
              onClick={handleStatusToggle}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition ${
                currentRider.status === 'Online' 
                  ? 'bg-rose-100 text-rose-700 hover:bg-rose-200' 
                  : 'bg-emerald-600 text-white hover:bg-emerald-700'
              }`}
            >
              <Power className="w-4 h-4" />
              {currentRider.status === 'Online' ? 'Go Offline' : 'Go Online'}
            </button>
          </div>

          {/* GPS Coordinates Simulator */}
          <div className="bg-sky-50 border border-sky-100 rounded-xl p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-sky-900 flex items-center gap-1">
                <Navigation className="w-3.5 h-3.5" /> Live GPS Coordinates Simulator
              </span>
              <button
                onClick={handleUpdateLocation}
                className="text-[11px] font-bold text-sky-700 hover:text-sky-900 bg-white px-2 py-0.5 rounded border border-sky-200"
              >
                Sync GPS Location
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-slate-500">Latitude</label>
                <input
                  type="number"
                  step="0.0001"
                  value={liveLat}
                  onChange={e => setLiveLat(Number(e.target.value))}
                  className="w-full mt-0.5 p-1.5 bg-white border border-sky-200 rounded text-slate-900 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-slate-500">Longitude</label>
                <input
                  type="number"
                  step="0.0001"
                  value={liveLong}
                  onChange={e => setLiveLong(Number(e.target.value))}
                  className="w-full mt-0.5 p-1.5 bg-white border border-sky-200 rounded text-slate-900 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ACTIVE DELIVERY ASSIGNMENT */}
        {activeDelivery && (
          <div className="bg-amber-50 rounded-2xl border border-amber-200 p-5 shadow-md space-y-4">
            <div className="flex items-center justify-between border-b border-amber-200 pb-3">
              <div className="flex items-center gap-2">
                <Bike className="w-5 h-5 text-amber-700" />
                <h2 className="font-bold text-amber-950 text-base">Current Active Delivery</h2>
              </div>
              <span className="bg-amber-200 text-amber-900 text-xs font-bold px-3 py-1 rounded-full">
                {activeDelivery.status}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="bg-white p-3 rounded-xl border border-amber-100 space-y-1">
                <p className="font-bold text-slate-800">Pickup Restaurant</p>
                <p className="font-semibold text-slate-900">{activeDelivery.vendor_name}</p>
                <p className="text-slate-500 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400" /> Lat/Long: {activeDelivery.vendor_lat}, {activeDelivery.vendor_long}
                </p>
              </div>

              <div className="bg-white p-3 rounded-xl border border-amber-100 space-y-1">
                <p className="font-bold text-slate-800">Customer Drop-off</p>
                <p className="font-semibold text-slate-900">{activeDelivery.customer_name}</p>
                <p className="text-slate-500 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400" /> Lat/Long: {activeDelivery.delivery_lat}, {activeDelivery.delivery_long}
                </p>
              </div>
            </div>

            <div className="bg-white p-3 rounded-xl border border-amber-100 text-xs space-y-1">
              <span className="font-bold text-slate-800">Items to Deliver:</span>
              <p className="text-slate-600">{activeDelivery.items.map(i => `${i.name} (${i.quantity}x)`).join(', ')}</p>
              <p className="font-bold text-emerald-700 pt-1">Cash on Delivery Amount: ৳{activeDelivery.amount}</p>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2 pt-2">
              {activeDelivery.status !== 'Picked Up' && (
                <button
                  onClick={() => onUpdateOrderStatus(activeDelivery.id, 'Picked Up', currentRider.id)}
                  className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-bold py-2.5 rounded-xl text-xs transition shadow-sm"
                >
                  Confirm Food Picked Up
                </button>
              )}

              <button
                onClick={() => onUpdateOrderStatus(activeDelivery.id, 'Delivered', currentRider.id)}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs transition shadow-sm"
              >
                Mark as Delivered ✅
              </button>
            </div>
          </div>
        )}

        {/* AVAILABLE ORDERS TO ACCEPT */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Clock className="w-4 h-4 text-sky-600" /> Available Delivery Requests ({availableOrders.length})
          </h2>

          {availableOrders.length === 0 ? (
            <div className="bg-white p-6 rounded-xl text-center text-slate-400 border border-slate-200 text-xs">
              No unassigned orders available at the moment.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availableOrders.map(order => (
                <div key={order.id} className="bg-white rounded-xl border border-slate-200 p-4 space-y-3 shadow-sm">
                  <div className="flex justify-between items-start border-b border-slate-100 pb-2">
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">Order #{order.id}</h3>
                      <p className="text-xs text-slate-500">From: <span className="font-semibold">{order.vendor_name}</span></p>
                    </div>
                    <span className="text-emerald-700 font-bold text-sm">৳{order.amount}</span>
                  </div>

                  <p className="text-xs text-slate-600">To Customer: <span className="font-medium">{order.customer_name}</span></p>

                  <button
                    disabled={currentRider.status !== 'Online' || !!activeDelivery}
                    onClick={() => onUpdateOrderStatus(order.id, 'Preparing', currentRider.id)}
                    className="w-full bg-sky-600 hover:bg-sky-700 disabled:bg-slate-300 text-white font-bold py-2 rounded-xl text-xs transition shadow-xs"
                  >
                    {activeDelivery ? 'Complete active delivery first' : 'Accept Order Delivery'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIDER HISTORY */}
        {completedDeliveries.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3 shadow-sm">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Delivered Orders ({completedDeliveries.length})
            </h2>

            <div className="divide-y divide-slate-100 text-xs">
              {completedDeliveries.map(cd => (
                <div key={cd.id} className="py-2 flex justify-between items-center">
                  <div>
                    <p className="font-bold text-slate-800">Order #{cd.id} - {cd.vendor_name}</p>
                    <p className="text-slate-400">Customer: {cd.customer_name}</p>
                  </div>
                  <span className="font-bold text-emerald-700">৳{cd.amount}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
