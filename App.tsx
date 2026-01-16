
import React, { useState, useEffect } from 'react';
import { MembershipLevel, UserProfile, Transaction, Reward, AIRewardRecommendation, AuthState } from './types';
import { geminiService } from './services/geminiService';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import RewardsStore from './components/RewardsStore';
import TransactionHistory from './components/TransactionHistory';
import QRScanner from './components/QRScanner';
import AdminPanel from './components/AdminPanel';

const INITIAL_REWARDS: Reward[] = [
  { id: 'r1', title: '$5 Eco-Voucher', description: 'Redeemable at participating sustainable shops.', cost: 500, category: 'voucher', icon: '🌱' },
  { id: 'r2', title: 'Bamboo Straw Set', description: '4-pack with cleaning brush and carrying pouch.', cost: 1200, category: 'product', icon: '🎋' },
  { id: 'r3', title: 'Spotify Premium 1m', description: 'One month of ad-free music.', cost: 3000, category: 'experience', icon: '🎧' },
  { id: 'r4', title: '$25 Amazon Gift Card', description: 'Universal shopping credit.', cost: 5000, category: 'voucher', icon: '💳' },
  { id: 'r5', title: 'Tree Planting', description: 'We plant a tree in a reforestation project in your name.', cost: 8000, category: 'experience', icon: '🌳' },
];

const App: React.FC = () => {
  const [authState, setAuthState] = useState<AuthState>('logged-out');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [rewards, setRewards] = useState<Reward[]>(INITIAL_REWARDS);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'store' | 'history' | 'scan' | 'admin'>('dashboard');
  const [aiReward, setAiReward] = useState<AIRewardRecommendation | null>(null);
  const [loadingAI, setLoadingAI] = useState(false);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleStartAuth = () => setAuthState('account-selection');
  const handleGoToAdminLogin = () => setAuthState('admin-login');
  
  const handleSelectAccount = (selectedUser: { name: string, email: string, avatar: string }) => {
    setAuthState('otp-pending');
    (window as any)._pendingUser = selectedUser;
  };

  const handleVerifyOTP = (otp: string) => {
    if (otp === '1234') {
      const pending = (window as any)._pendingUser || { 
        name: "Eco Enthusiast", 
        email: "eco.warrior@gmail.com",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Eco"
      };
      
      setUser({
        ...pending,
        points: 750,
        level: MembershipLevel.BRONZE,
        totalEarned: 750,
        history: [{ id: 'init', type: 'earn', amount: 750, description: 'Welcome Bonus', timestamp: Date.now() }],
        isAdmin: false
      });
      setAuthState('logged-in');
      setNotification({ message: 'Welcome to Bin Rewards!', type: 'success' });
    } else {
      setNotification({ message: 'Verification failed. Try 1234.', type: 'error' });
    }
  };

  const handleAdminAuth = (user: string, pass: string) => {
    if (user === 'admin' && pass === 'password') {
      setUser({
        name: "System Admin",
        email: "admin@binrewards.com",
        points: 99999,
        level: MembershipLevel.GOLD,
        totalEarned: 99999,
        history: [],
        isAdmin: true,
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin"
      });
      setAuthState('logged-in');
      setActiveTab('admin');
      setNotification({ message: 'Authorized Administrator', type: 'success' });
    } else {
      setNotification({ message: 'Invalid Admin Credentials', type: 'error' });
    }
  };

  const handleSignOut = () => {
    setUser(null);
    setAuthState('logged-out');
    setActiveTab('dashboard');
    setAiReward(null);
  };

  const updatePoints = (amount: number, description: string, type: 'earn' | 'redeem') => {
    if (!user) return;
    
    if (type === 'redeem' && user.points < amount) {
        setNotification({ message: 'Insufficient balance!', type: 'error' });
        return;
    }

    const newTransaction: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      amount,
      description,
      timestamp: Date.now(),
    };

    setUser(prev => {
      if (!prev) return null;
      const newPoints = type === 'earn' ? prev.points + amount : prev.points - amount;
      const newTotalEarned = type === 'earn' ? prev.totalEarned + amount : prev.totalEarned;
      
      let newLevel = prev.level;
      if (newTotalEarned > 5000) newLevel = MembershipLevel.GOLD;
      else if (newTotalEarned > 1000) newLevel = MembershipLevel.SILVER;

      return {
        ...prev,
        points: newPoints,
        totalEarned: newTotalEarned,
        level: newLevel,
        history: [newTransaction, ...prev.history],
      };
    });
    
    setNotification({
      message: `${type === 'earn' ? 'Earned' : 'Redeemed'} ${amount} points`,
      type: 'success'
    });
  };

  const fetchAIReward = async () => {
    if (!user) return;
    setLoadingAI(true);
    try {
      const reward = await geminiService.generatePersonalizedReward(user);
      setAiReward(reward);
    } catch (error) {
      console.error("Gemini Error:", error);
      setNotification({ message: 'AI unavailable. Try again later.', type: 'error' });
    } finally {
      setLoadingAI(false);
    }
  };

  if (authState !== 'logged-in') {
    return (
      <Login 
        authState={authState} 
        onStartAuth={handleStartAuth}
        onGoToAdminLogin={handleGoToAdminLogin}
        onSelectAccount={handleSelectAccount}
        onVerify={handleVerifyOTP}
        onAdminLogin={handleAdminAuth}
        onBack={() => setAuthState('logged-out')}
        setAuthState={setAuthState}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-28 font-sans select-none overflow-x-hidden">
      <header className="bg-white/80 backdrop-blur-lg border-b border-slate-100 sticky top-0 z-30 px-6 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-emerald-500 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-emerald-100">
            B
          </div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">BinRewards</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-1.5 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
              <span className="text-emerald-600 text-sm font-black">✨ {user?.points.toLocaleString()}</span>
            </div>
          </div>
          <button 
              onClick={handleSignOut} 
              className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden border border-slate-200 hover:ring-2 hover:ring-emerald-200 transition-all flex items-center justify-center"
          >
            <img 
              src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`} 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          </button>
        </div>
      </header>

      <main className="max-w-md mx-auto px-5 py-6">
        {activeTab === 'dashboard' && user && <Dashboard user={user} onFetchAI={fetchAIReward} aiReward={aiReward} loadingAI={loadingAI} />}
        {activeTab === 'store' && user && <RewardsStore points={user.points} rewards={rewards} onRedeem={updatePoints} aiReward={aiReward} />}
        {activeTab === 'history' && user && <TransactionHistory history={user.history} />}
        {activeTab === 'scan' && <QRScanner onScanSuccess={() => updatePoints(50, "QR Bin Scan", "earn")} />}
        {activeTab === 'admin' && user?.isAdmin && <AdminPanel rewards={rewards} setRewards={setRewards} />}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 glass border-t border-slate-200 px-4 py-3 pb-8 flex justify-around items-end z-40">
        <NavBtn active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} icon="📊" label="Home" />
        <NavBtn active={activeTab === 'store'} onClick={() => setActiveTab('store')} icon="🎁" label="Shop" />
        <div className="relative -top-5">
          <button 
            onClick={() => setActiveTab('scan')}
            className={`w-16 h-16 rounded-[1.75rem] flex items-center justify-center text-3xl shadow-2xl transition-all active:scale-90 ${activeTab === 'scan' ? 'bg-emerald-600 rotate-12 text-white' : 'bg-emerald-500 text-white hover:scale-105'}`}
          >
            📸
          </button>
        </div>
        <NavBtn active={activeTab === 'history'} onClick={() => setActiveTab('history')} icon="🕒" label="History" />
        {user?.isAdmin ? (
            <NavBtn active={activeTab === 'admin'} onClick={() => setActiveTab('admin')} icon="🛠️" label="Admin" />
        ) : (
            <div className="w-16" /> /* Spacer */
        )}
      </nav>

      {notification && (
        <div className="fixed bottom-32 right-6 left-6 p-4 rounded-2xl shadow-2xl border transition-all z-50 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-6 bg-white border-emerald-100">
          <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${notification.type === 'success' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
            {notification.type === 'success' ? '✓' : '!'}
          </div>
          <p className="text-sm font-bold text-slate-800">{notification.message}</p>
        </div>
      )}
    </div>
  );
};

const NavBtn = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: string, label: string }) => (
  <button onClick={onClick} className={`flex flex-col items-center gap-1.5 w-16 transition-all relative ${active ? 'text-emerald-600 font-extrabold' : 'text-slate-400'}`}>
    <span className={`text-2xl transition-transform ${active ? 'scale-110 -translate-y-0.5' : ''}`}>{icon}</span>
    <span className="text-[10px] uppercase tracking-widest font-bold">{label}</span>
    {active && <div className="absolute -bottom-2 w-1.5 h-1.5 bg-emerald-500 rounded-full active-tab-indicator" />}
  </button>
);

export default App;
