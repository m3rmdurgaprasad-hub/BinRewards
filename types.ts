
export enum MembershipLevel {
  BRONZE = 'BRONZE',
  SILVER = 'SILVER',
  GOLD = 'GOLD'
}

export interface Transaction {
  id: string;
  type: 'earn' | 'redeem';
  amount: number;
  description: string;
  timestamp: number;
}

export interface Reward {
  id: string;
  title: string;
  description: string;
  cost: number;
  category: 'voucher' | 'product' | 'experience' | 'ai-special';
  icon: string;
}

export interface UserProfile {
  name: string;
  email: string;
  points: number;
  level: MembershipLevel;
  totalEarned: number;
  history: Transaction[];
  isAdmin: boolean;
  avatar?: string;
}

export interface AIRewardRecommendation {
  title: string;
  description: string;
  cost: number;
  reasoning: string;
}

export type AuthState = 'logged-out' | 'account-selection' | 'add-account' | 'otp-pending' | 'admin-login' | 'logged-in';
