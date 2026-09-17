import React, { useState } from 'react';
import { ShoppingBag, Store, Bike, ShieldCheck, FileCode, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [activePortal, setActivePortal] = useState<'customer' | 'vendor' | 'rider' | 'admin'>('customer');

  const htmlFiles = {
    customer: '/customer.html',
    vendor: '/vendor.html',
    rider: '/rider.html',
    admin: '/admin.html',
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* Portal Switcher Header */}
      <div className="bg-slate-950 text-white border-b border-slate-800 px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 z-30">
        <div className="flex items-center space-x-2">
          <span className="font-bold text-xs text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2.5 py-1 rounded-lg flex items-center gap-1.5">
            <FileCode className="w-3.5 h-3.5" /> 4 Standalone Repos Ready
          </span>
          <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> 1-File HTML Sites
          </span>
        </div>

        {/* Portal Tabs */}
        <div className="flex items-center space-x-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActivePortal('customer')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activePortal === 'customer' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" /> customer.html
          </button>
          <button
            onClick={() => setActivePortal('vendor')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activePortal === 'vendor' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Store className="w-3.5 h-3.5" /> vendor.html
          </button>
          <button
            onClick={() => setActivePortal('rider')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activePortal === 'rider' ? 'bg-sky-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Bike className="w-3.5 h-3.5" /> rider.html
          </button>
          <button
            onClick={() => setActivePortal('admin')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activePortal === 'admin' ? 'bg-amber-500 text-slate-950 shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" /> admin.html
          </button>
        </div>
      </div>

      {/* Main Preview Frame */}
      <div className="flex-1 w-full bg-slate-200 p-2">
        <iframe
          key={activePortal}
          src={htmlFiles[activePortal]}
          className="w-full h-[88vh] bg-white rounded-xl shadow-lg border border-slate-300"
          title={`${activePortal} portal`}
        />
      </div>
    </div>
  );
}

