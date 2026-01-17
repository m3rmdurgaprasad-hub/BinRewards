
import React, { useRef } from 'react';
import { MembershipLevel, UserProfile, AIRewardRecommendation } from '../types';

interface DashboardProps {
  user: UserProfile;
  onFetchAI: () => void;
  aiReward: AIRewardRecommendation | null;
  loadingAI: boolean;
  onUpdateProfile: (updates: Partial<UserProfile>) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onFetchAI, aiReward, loadingAI, onUpdateProfile }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const nextLevelMap = {
    [MembershipLevel.BRONZE]: { name: MembershipLevel.SILVER, goal: 1000 },
    [MembershipLevel.SILVER]: { name: MembershipLevel.GOLD, goal: 5000 },
    [MembershipLevel.GOLD]: { name: 'ECO WARRIOR', goal: 5000 },
  };

  const nextInfo = nextLevelMap[user.level];
  const progress = Math.min(100, (user.totalEarned / nextInfo.goal) * 100);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdateProfile({ avatar: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const userAvatar = user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`;

  return (
    <div className="space-y-6">
      {/* Welcome Card with Avatar Upload */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex items-center gap-4">
        <div className="relative group shrink-0">
          <button 
            onClick={handleAvatarClick}
            className="w-16 h-16 rounded-full bg-slate-100 overflow-hidden border-2 border-emerald-400 block relative transition-transform active:scale-90"
          >
            <img 
              src={userAvatar} 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <span className="text-lg">📷</span>
            </div>
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*" 
            onChange={handleFileChange}
          />
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center text-[10px] text-white shadow-sm pointer-events-none">
            ✏️
          </div>
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900 leading-tight">Welcome, {user.name.split(' ')[0]}</h2>
          <p className="text-slate-400 text-xs font-medium">{user.email}</p>
        </div>
      </div>

      {/* Mini Tier Card */}
      <div className={`rounded-[2.5rem] p-6 text-white shadow-xl ${
        user.level === MembershipLevel.BRONZE ? 'bg-gradient-to-br from-slate-700 to-slate-900' :
        user.level === MembershipLevel.SILVER ? 'bg-gradient-to-br from-emerald-500 to-teal-700' :
        'bg-gradient-to-br from-amber-400 to-orange-600'
      }`}>
        <div className="flex justify-between items-center mb-6">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60">Tier Level</p>
            <h2 className="text-2xl font-black italic">{user.level}</h2>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl">
            {user.level === MembershipLevel.GOLD ? '🏆' : user.level === MembershipLevel.SILVER ? '🌿' : '🥉'}
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-[10px] font-black uppercase text-white/80">
            <span>Progress to {nextInfo.name}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full h-2 bg-black/20 rounded-full overflow-hidden">
            <div className="h-full bg-white rounded-full transition-all duration-1000" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm text-center group active:scale-95 transition-all">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Available</p>
            <p className="text-2xl font-black text-emerald-600">{user.points.toLocaleString()}</p>
            <p className="text-[8px] font-bold text-slate-300">POINTS</p>
        </div>
        <div className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm text-center">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Impact</p>
            <p className="text-2xl font-black text-slate-800">{user.totalEarned.toLocaleString()}</p>
            <p className="text-[8px] font-bold text-slate-300">LIFETIME</p>
        </div>
      </div>

      {/* AI Mystery Offer */}
      <div className="bg-slate-900 rounded-[2.5rem] p-6 text-white overflow-hidden relative group shadow-2xl shadow-slate-200">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-emerald-500 text-[10px] font-black px-2 py-0.5 rounded-full">GEMINI AI</span>
          </div>
          <h3 className="text-lg font-black mb-2 tracking-tight">Personalized Reward</h3>
          <p className="text-slate-400 text-xs mb-6 leading-relaxed">Analyzing your recycling patterns to find a perfect match.</p>
          
          {!aiReward ? (
            <button 
              onClick={onFetchAI}
              disabled={loadingAI}
              className="w-full bg-white text-slate-900 py-3 rounded-2xl font-black text-sm hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-white/5"
            >
              {loadingAI ? 'ANALYZING...' : 'DISCOVER NOW'}
            </button>
          ) : (
            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl animate-in fade-in slide-in-from-bottom-4">
              <p className="text-sm font-black text-emerald-400">{aiReward.title}</p>
              <p className="text-[10px] text-slate-400 mt-1">{aiReward.description}</p>
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-white/10">
                <span className="font-black text-sm">{aiReward.cost} PTS</span>
                <span className="text-[8px] italic text-slate-500">Based on your activity</span>
              </div>
            </div>
          )}
        </div>
        <div className="absolute -right-4 -bottom-4 text-7xl opacity-10 select-none blur-sm group-hover:rotate-12 transition-transform duration-700">♻️</div>
      </div>
    </div>
  );
};

export default Dashboard;
