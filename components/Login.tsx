
import React, { useState } from 'react';
import { AuthState } from '../types';

interface LoginProps {
  authState: AuthState;
  onStartAuth: () => void;
  onGoToAdminLogin: () => void;
  onSelectAccount: (user: { name: string, email: string, avatar: string }) => void;
  onVerify: (otp: string) => void;
  onAdminLogin: (user: string, pass: string) => void;
  onBack: () => void;
  setAuthState: (state: AuthState) => void;
}

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.26 1.07-3.71 1.07-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.11c-.22-.66-.35-1.36-.35-2.11s.13-1.45.35-2.11V7.05H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.95l3.66-2.84z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.05l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);

const Login: React.FC<LoginProps> = ({ authState, onStartAuth, onGoToAdminLogin, onSelectAccount, onVerify, onAdminLogin, onBack, setAuthState }) => {
  const [otp, setOtp] = useState('');
  const [adminUser, setAdminUser] = useState('');
  const [adminPass, setAdminPass] = useState('');
  
  // Custom account fields
  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');

  const mockAccounts = [
    { name: 'Eco Enthusiast', email: 'eco.warrior@gmail.com', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Eco' },
    { name: 'S. Planet-Lover', email: 'sam@earth.org', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sam' }
  ];

  if (authState === 'account-selection') {
    return (
      <div className="min-h-screen bg-[#f0f2f5] flex items-center justify-center p-4">
        <div className="w-full max-w-[400px] bg-white rounded-lg shadow-xl overflow-hidden border border-gray-200 animate-in zoom-in-95 duration-200">
          <div className="p-8 text-center border-b border-gray-100 relative">
            <button onClick={onBack} className="absolute left-4 top-4 text-gray-400 hover:text-gray-600">✕</button>
            <div className="flex justify-center mb-3">
              <GoogleIcon />
            </div>
            <h2 className="text-xl font-medium text-gray-900">Choose an account</h2>
            <p className="text-gray-600 text-sm mt-1">to continue to <span className="font-medium text-gray-900">Bin Rewards</span></p>
          </div>
          <div className="p-2">
            <p className="px-4 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Accounts detected on this device</p>
            {mockAccounts.map((acc) => (
              <button 
                key={acc.email}
                onClick={() => onSelectAccount(acc)}
                className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors text-left border-b border-gray-50 last:border-0 group"
              >
                <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden border border-gray-100 group-hover:border-blue-400 transition-all shrink-0">
                  <img src={acc.avatar} className="w-full h-full" alt="" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{acc.name}</p>
                  <p className="text-xs text-gray-500 truncate">{acc.email}</p>
                </div>
              </button>
            ))}
            <button 
                onClick={() => setAuthState('add-account')}
                className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors text-left"
            >
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 shrink-0">
                👤
              </div>
              <p className="text-sm font-medium text-gray-700">Use another account</p>
            </button>
          </div>
          <div className="p-6 bg-gray-50 text-[11px] text-gray-500 leading-normal border-t border-gray-100">
            To continue, Google will share your name, email address, language preference, and profile picture with Bin Rewards.
          </div>
        </div>
      </div>
    );
  }

  if (authState === 'add-account') {
    return (
      <div className="min-h-screen bg-[#f0f2f5] flex items-center justify-center p-4">
        <div className="w-full max-w-[400px] bg-white rounded-lg shadow-xl overflow-hidden border border-gray-200 animate-in zoom-in-95 duration-200 p-8">
           <div className="text-center mb-8">
            <div className="flex justify-center mb-4"><GoogleIcon /></div>
            <h2 className="text-2xl font-normal text-gray-900">Sign in</h2>
            <p className="text-gray-600 mt-2">Enter your details to create an account</p>
          </div>
          
          <div className="space-y-4">
             <input 
              type="text" 
              placeholder="Full Name" 
              className="w-full px-4 py-3 rounded-md border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
            />
            <input 
              type="email" 
              placeholder="Email address" 
              className="w-full px-4 py-3 rounded-md border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
              value={customEmail}
              onChange={(e) => setCustomEmail(e.target.value)}
            />
          </div>

          <div className="flex justify-between items-center mt-12">
            <button onClick={() => setAuthState('account-selection')} className="text-blue-600 text-sm font-semibold hover:bg-blue-50 px-3 py-2 rounded-md transition-colors">Back</button>
            <button 
              disabled={!customEmail || !customName}
              onClick={() => onSelectAccount({ 
                  name: customName, 
                  email: customEmail, 
                  avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${customName}` 
              })}
              className="bg-blue-600 text-white px-8 py-2.5 rounded-md font-semibold hover:bg-blue-700 transition-all disabled:bg-gray-200 disabled:text-gray-400"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (authState === 'otp-pending') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="w-full max-w-[450px] border border-gray-200 rounded-xl p-6 md:p-10 text-center animate-in fade-in duration-300">
          <div className="flex justify-center mb-4">
            <GoogleIcon />
          </div>
          <h2 className="text-2xl font-normal text-gray-900 mb-2">2-Step Verification</h2>
          <p className="text-gray-600 text-sm mb-8 leading-relaxed">
            Google wants to make sure it's really you. Enter the 4-digit code sent to your device.
          </p>
          
          <div className="relative mb-8">
            <input 
              type="text" 
              placeholder="0000" 
              maxLength={4}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
              className="w-full text-center text-4xl tracking-[0.4em] py-4 rounded-xl border-2 border-gray-200 focus:border-blue-500 outline-none transition-all font-mono placeholder:text-gray-200"
            />
            <p className="text-left text-[10px] font-bold text-blue-600 uppercase tracking-wider mt-4">Hint: Use code 1234</p>
          </div>

          <div className="flex justify-between items-center">
            <button onClick={onBack} className="text-blue-600 text-sm font-semibold hover:bg-blue-50 px-3 py-2 rounded-md transition-colors">Back</button>
            <button 
              disabled={otp.length < 4}
              onClick={() => onVerify(otp)}
              className="bg-blue-600 text-white px-10 py-2.5 rounded-md font-semibold hover:bg-blue-700 transition-all disabled:bg-gray-200 disabled:text-gray-400 shadow-md shadow-blue-100"
            >
              Verify
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (authState === 'admin-login') {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="w-full max-w-[400px] bg-slate-800 rounded-3xl p-8 shadow-2xl border border-slate-700 animate-in zoom-in-95 duration-300">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-indigo-500 rounded-2xl flex items-center justify-center text-white text-3xl font-black mx-auto mb-4 shadow-xl shadow-indigo-500/20">
              A
            </div>
            <h2 className="text-2xl font-black text-white italic">Admin Portal</h2>
            <p className="text-slate-400 text-sm mt-2">Manage the Bin Rewards inventory</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Username</label>
              <input 
                type="text" 
                value={adminUser}
                onChange={(e) => setAdminUser(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none transition-all font-medium"
                placeholder="admin"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Password</label>
              <input 
                type="password" 
                value={adminPass}
                onChange={(e) => setAdminPass(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none transition-all font-medium"
                placeholder="••••••••"
              />
            </div>
            
            <button 
              onClick={() => onAdminLogin(adminUser, adminPass)}
              className="w-full bg-indigo-600 text-white py-4 rounded-xl font-black uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/20 mt-4 active:scale-95"
            >
              Initialize System
            </button>
            <button 
              onClick={onBack}
              className="w-full text-slate-500 text-xs font-bold hover:text-slate-300 transition-colors py-2"
            >
              Cancel
            </button>
          </div>
          <p className="text-center text-[9px] text-slate-600 mt-8 font-medium">Hint: admin / password</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col p-8 items-center justify-center">
      <div className="mb-12 flex flex-col items-center animate-in slide-in-from-top-4 duration-700">
        <div className="w-24 h-24 bg-emerald-500 rounded-[2.5rem] flex items-center justify-center text-white text-5xl font-black shadow-2xl shadow-emerald-200 mb-8">
          B
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Bin Rewards</h1>
        <p className="text-slate-500 font-medium text-center mt-3 max-w-[280px]">
          Turn your recycling into real value. Join the movement today.
        </p>
      </div>

      <div className="space-y-4 w-full max-w-xs animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <button 
          onClick={onStartAuth}
          className="w-full flex items-center justify-center gap-3 bg-white py-4 rounded-full border border-gray-300 shadow-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all hover:shadow-md active:scale-[0.98]"
        >
          <GoogleIcon />
          Sign in with Google
        </button>
        
        <div className="relative py-2">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-slate-50 px-2 text-slate-400 font-black tracking-widest">or</span></div>
        </div>

        <button 
          onClick={onGoToAdminLogin}
          className="w-full flex items-center justify-center gap-3 bg-slate-800 py-4 rounded-full text-white font-bold hover:bg-slate-900 transition-all shadow-lg shadow-slate-200 active:scale-[0.98]"
        >
          <span className="text-xl">🛡️</span>
          Admin Access
        </button>
      </div>

      <div className="mt-16 text-center animate-in fade-in duration-1000 delay-500">
        <div className="flex gap-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
          <span>Privacy</span>
          <span className="opacity-20">|</span>
          <span>Terms</span>
          <span className="opacity-20">|</span>
          <span>Help</span>
        </div>
      </div>
    </div>
  );
};

export default Login;
