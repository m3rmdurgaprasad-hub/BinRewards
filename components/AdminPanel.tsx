
import React, { useState } from 'react';
import { Reward } from '../types';

interface AdminPanelProps {
  rewards: Reward[];
  setRewards: React.Dispatch<React.SetStateAction<Reward[]>>;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ rewards, setRewards }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newReward, setNewReward] = useState<Partial<Reward>>({
    title: '',
    description: '',
    cost: 500,
    category: 'voucher',
    icon: '📦'
  });

  const handleAdd = () => {
    if (newReward.title && newReward.cost) {
      const reward: Reward = {
        id: Math.random().toString(36).substr(2, 9),
        title: newReward.title,
        description: newReward.description || '',
        cost: Number(newReward.cost),
        category: newReward.category as any,
        icon: newReward.icon || '📦'
      };
      setRewards([reward, ...rewards]);
      setNewReward({ title: '', description: '', cost: 500, category: 'voucher', icon: '📦' });
    }
  };

  const removeReward = (id: string) => {
    if (confirm('Are you sure you want to remove this reward?')) {
      setRewards(rewards.filter(r => r.id !== id));
    }
  };

  const updateRewardValue = (id: string, field: keyof Reward, value: any) => {
    setRewards(rewards.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-black text-slate-800">Admin Control Panel</h2>
        <p className="text-slate-400 text-sm font-medium uppercase tracking-wider">Inventory Management</p>
      </div>

      {/* Add Section */}
      <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 space-y-4">
        <h3 className="font-bold text-slate-700 flex items-center gap-2">
          <span className="w-6 h-6 bg-emerald-100 text-emerald-600 rounded flex items-center justify-center text-xs">+</span>
          Create New Entry
        </h3>
        <input 
          type="text" 
          placeholder="Reward Title" 
          className="w-full p-4 rounded-xl bg-slate-50 border border-transparent focus:border-indigo-200 outline-none font-bold transition-all"
          value={newReward.title}
          onChange={e => setNewReward({...newReward, title: e.target.value})}
        />
        <div className="grid grid-cols-2 gap-3">
          <div className="relative">
             <input 
              type="number" 
              placeholder="Price (PTS)" 
              className="w-full p-4 rounded-xl bg-slate-50 border border-transparent focus:border-emerald-200 outline-none font-bold text-emerald-600 pl-10"
              value={newReward.cost}
              onChange={e => setNewReward({...newReward, cost: Number(e.target.value)})}
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-300">✨</span>
          </div>
          <select 
             className="w-full p-4 rounded-xl bg-slate-50 border border-transparent focus:border-indigo-200 outline-none font-bold appearance-none cursor-pointer"
             value={newReward.category}
             onChange={e => setNewReward({...newReward, category: e.target.value as any})}
          >
            <option value="voucher">🎫 Voucher</option>
            <option value="product">📦 Product</option>
            <option value="experience">🌍 Exp.</option>
          </select>
        </div>
        <button 
          onClick={handleAdd}
          className="w-full bg-slate-900 text-white py-4 rounded-xl font-black hover:bg-slate-800 transition-all shadow-lg active:scale-[0.98]"
        >
          PUBLISH TO STORE
        </button>
      </div>

      {/* Edit List */}
      <div className="space-y-4">
        <h3 className="font-bold text-slate-700 px-2 flex justify-between items-center">
          <span>Current Catalog</span>
          <span className="text-[10px] text-slate-400 uppercase tracking-widest">{rewards.length} ITEMS</span>
        </h3>
        <div className="space-y-3">
          {rewards.map(r => (
            <div key={r.id} className="bg-white p-4 rounded-2xl border border-slate-100 group transition-all">
              {editingId === r.id ? (
                <div className="space-y-3 animate-in fade-in duration-200">
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={r.title}
                      onChange={e => updateRewardValue(r.id, 'title', e.target.value)}
                      className="flex-1 bg-slate-50 p-2 rounded-lg font-bold outline-none border border-indigo-100"
                    />
                    <input 
                      type="number" 
                      value={r.cost}
                      onChange={e => updateRewardValue(r.id, 'cost', Number(e.target.value))}
                      className="w-24 bg-slate-50 p-2 rounded-lg font-black text-emerald-600 outline-none border border-emerald-100 text-right"
                    />
                  </div>
                  <textarea 
                    value={r.description}
                    onChange={e => updateRewardValue(r.id, 'description', e.target.value)}
                    className="w-full bg-slate-50 p-2 rounded-lg text-xs outline-none border border-slate-100 min-h-[60px]"
                  />
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => setEditingId(null)}
                      className="text-xs font-bold text-indigo-600 bg-indigo-50 px-4 py-2 rounded-lg hover:bg-indigo-100 transition-all"
                    >
                      Done Editing
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                      {r.icon}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 text-sm leading-tight">{r.title}</p>
                      <p className="text-emerald-600 font-black text-xs mt-0.5">{r.cost.toLocaleString()} PTS</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => setEditingId(r.id)}
                      className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center font-bold hover:bg-indigo-50 hover:text-indigo-600"
                      title="Edit Reward"
                    >
                      ✏️
                    </button>
                    <button 
                      onClick={() => removeReward(r.id)}
                      className="w-8 h-8 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center font-bold hover:bg-rose-100"
                      title="Delete Reward"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
