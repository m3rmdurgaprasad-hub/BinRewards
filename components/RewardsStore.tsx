
import React, { useState } from 'react';
import { Reward, AIRewardRecommendation } from '../types';

interface RewardsStoreProps {
  points: number;
  rewards: Reward[];
  onRedeem: (amount: number, description: string, type: 'earn' | 'redeem') => void;
  aiReward: AIRewardRecommendation | null;
}

const RewardsStore: React.FC<RewardsStoreProps> = ({ points, rewards, onRedeem, aiReward }) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'voucher' | 'product' | 'experience'>('all');

  const filteredRewards = selectedCategory === 'all' 
    ? rewards 
    : rewards.filter(r => r.category === selectedCategory);

  const handleRedeem = (reward: Reward | AIRewardRecommendation) => {
    if (points >= reward.cost) {
      onRedeem(reward.cost, reward.title, 'redeem');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-slate-800">Rewards Store</h2>
        <div className="flex overflow-x-auto pb-2 sm:pb-0 gap-2 no-scrollbar">
          {(['all', 'voucher', 'product', 'experience'] as const).map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                selectedCategory === cat 
                  ? 'bg-indigo-600 text-white shadow-md' 
                  : 'bg-white text-slate-500 border border-slate-200 hover:border-indigo-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Render AI Reward if it exists and matches category filters (AI rewards are basically experiences/special) */}
        {aiReward && (selectedCategory === 'all' || selectedCategory === 'experience') && (
           <div className="bg-indigo-50 border-2 border-indigo-200 rounded-3xl p-6 shadow-xl relative overflow-hidden group transition-all hover:scale-[1.02]">
            <div className="absolute top-3 right-3 bg-indigo-600 text-[10px] text-white px-2 py-1 rounded-full font-black uppercase tracking-tighter">AI PICK</div>
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-2xl shadow-sm mb-4">🔮</div>
            <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{aiReward.title}</h3>
            <p className="text-slate-500 text-sm mt-2 line-clamp-2">{aiReward.description}</p>
            <div className="mt-6 pt-6 border-t border-indigo-100 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase">Cost</p>
                <p className="text-lg font-black text-indigo-700">{aiReward.cost.toLocaleString()} <span className="text-[10px] font-medium text-indigo-400">PTS</span></p>
              </div>
              <button
                disabled={points < aiReward.cost}
                onClick={() => handleRedeem(aiReward)}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                  points >= aiReward.cost 
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-100' 
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}
              >
                {points >= aiReward.cost ? 'Redeem' : 'Locked'}
              </button>
            </div>
          </div>
        )}

        {/* Regular Rewards */}
        {filteredRewards.map(reward => (
          <div key={reward.id} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all hover:scale-[1.01] group">
            <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-2xl shadow-inner mb-4">
              {reward.icon}
            </div>
            <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{reward.title}</h3>
            <p className="text-slate-500 text-sm mt-2 line-clamp-2">{reward.description}</p>
            <div className="mt-6 pt-6 border-t border-slate-50 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase">Cost</p>
                <p className="text-lg font-black text-slate-800">{reward.cost.toLocaleString()} <span className="text-[10px] font-medium text-slate-400">PTS</span></p>
              </div>
              <button
                disabled={points < reward.cost}
                onClick={() => handleRedeem(reward)}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                  points >= reward.cost 
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-100' 
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}
              >
                {points >= reward.cost ? 'Redeem' : 'Locked'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RewardsStore;
