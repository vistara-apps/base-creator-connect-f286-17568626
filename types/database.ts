/**
 * TypeScript type definitions for database entities
 * 
 * These types correspond to the database schema defined in lib/schema.ts
 */

// Creator entity
export interface Creator {
  id: string;
  farcasterId?: string;
  username?: string;
  bio?: string;
  profileImageUrl?: string;
  walletAddress: string;
  socialLinks?: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

// Fan entity
export interface Fan {
  id: string;
  farcasterId?: string;
  walletAddress: string;
  createdAt: string;
  updatedAt: string;
}

// Tip entity
export interface Tip {
  id: string;
  creatorId: string;
  fanWalletAddress: string;
  amount: number;
  currency: string;
  message?: string;
  reaction?: string;
  transactionHash: string;
  tierId?: string;
  tipGoalId?: string;
  createdAt: string;
}

// TipGoal entity
export interface TipGoal {
  id: string;
  creatorId: string;
  name: string;
  description?: string;
  targetAmount: number;
  currentAmount: number;
  imageUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Tier entity
export interface Tier {
  id: string;
  creatorId: string;
  name: string;
  minAmount: number;
  perkDescription?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Database insert types (for creating new records)
export type CreatorInsert = Omit<Creator, 'id' | 'createdAt' | 'updatedAt'>;
export type FanInsert = Omit<Fan, 'id' | 'createdAt' | 'updatedAt'>;
export type TipInsert = Omit<Tip, 'id' | 'createdAt'>;
export type TipGoalInsert = Omit<TipGoal, 'id' | 'currentAmount' | 'createdAt' | 'updatedAt'> & { currentAmount?: number };
export type TierInsert = Omit<Tier, 'id' | 'createdAt' | 'updatedAt'>;

// Database update types (for updating existing records)
export type CreatorUpdate = Partial<Omit<Creator, 'id' | 'createdAt' | 'updatedAt'>>;
export type FanUpdate = Partial<Omit<Fan, 'id' | 'createdAt' | 'updatedAt'>>;
export type TipGoalUpdate = Partial<Omit<TipGoal, 'id' | 'creatorId' | 'createdAt' | 'updatedAt'>>;
export type TierUpdate = Partial<Omit<Tier, 'id' | 'creatorId' | 'createdAt' | 'updatedAt'>>;

// Extended types with relationships
export interface CreatorWithRelations extends Creator {
  tiers?: Tier[];
  tipGoals?: TipGoal[];
  tips?: Tip[];
}

export interface TipWithRelations extends Tip {
  creator?: Creator;
  tier?: Tier;
  tipGoal?: TipGoal;
}

// Response types for API endpoints
export interface ApiResponse<T> {
  data?: T;
  error?: {
    message: string;
    code?: string;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

