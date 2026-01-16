
import React from 'react';
import { Transaction } from '../types';

interface TransactionHistoryProps {
  history: Transaction[];
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ history }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">Transaction History</h2>
      
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {history.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <p>No transactions yet. Start earning points!</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {history.map(tx => (
              <div key={tx.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${tx.type === 'earn' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                    {tx.type === 'earn' ? '↓' : '↑'}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">{tx.description}</h4>
                    <p className="text-xs text-slate-400">{new Date(tx.timestamp).toLocaleString()}</p>
                  </div>
                </div>
                <div className={`text-lg font-black ${tx.type === 'earn' ? 'text-emerald-600' : 'text-slate-800'}`}>
                  {tx.type === 'earn' ? '+' : '-'}{tx.amount.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionHistory;
