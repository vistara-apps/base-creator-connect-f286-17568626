import { createClient } from '@supabase/supabase-js';
import { TABLES } from './schema';
import {
  Creator, CreatorInsert, CreatorUpdate,
  Fan, FanInsert, FanUpdate,
  Tip, TipInsert,
  TipGoal, TipGoalInsert, TipGoalUpdate,
  Tier, TierInsert, TierUpdate,
  ApiResponse, PaginatedResponse
} from '@/types/database';

// Create Supabase client
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Helper function to handle Supabase responses
const handleResponse = async <T>(promise: Promise<any>): Promise<ApiResponse<T>> => {
  try {
    const { data, error } = await promise;
    if (error) {
      return { error: { message: error.message, code: error.code } };
    }
    return { data: data as T };
  } catch (error: any) {
    return { error: { message: error.message || 'Unknown error occurred' } };
  }
};

// Creator operations
export const creatorOperations = {
  // Get creator by ID
  getById: (id: string) => 
    handleResponse<Creator>(supabase.from(TABLES.CREATORS).select('*').eq('id', id).single()),
  
  // Get creator by wallet address
  getByWalletAddress: (walletAddress: string) => 
    handleResponse<Creator>(supabase.from(TABLES.CREATORS).select('*').eq('walletAddress', walletAddress).single()),
  
  // Get creator by Farcaster ID
  getByFarcasterId: (farcasterId: string) => 
    handleResponse<Creator>(supabase.from(TABLES.CREATORS).select('*').eq('farcasterId', farcasterId).single()),
  
  // Create or update creator
  upsert: (creator: CreatorInsert) => 
    handleResponse<Creator>(supabase.from(TABLES.CREATORS).upsert(creator).select().single()),
  
  // Update creator
  update: (id: string, updates: CreatorUpdate) => 
    handleResponse<Creator>(supabase.from(TABLES.CREATORS).update(updates).eq('id', id).select().single()),
  
  // Get creator with relations
  getWithRelations: async (id: string) => {
    const { data: creator, error } = await supabase
      .from(TABLES.CREATORS)
      .select('*')
      .eq('id', id)
      .single();
    
    if (error || !creator) {
      return { error: { message: error?.message || 'Creator not found' } };
    }
    
    const [tiersResult, goalsResult] = await Promise.all([
      supabase.from(TABLES.TIERS).select('*').eq('creatorId', id).eq('isActive', true),
      supabase.from(TABLES.TIP_GOALS).select('*').eq('creatorId', id).eq('isActive', true)
    ]);
    
    return {
      data: {
        ...creator,
        tiers: tiersResult.data || [],
        tipGoals: goalsResult.data || []
      }
    };
  }
};

// Fan operations
export const fanOperations = {
  // Get fan by wallet address
  getByWalletAddress: (walletAddress: string) => 
    handleResponse<Fan>(supabase.from(TABLES.FANS).select('*').eq('walletAddress', walletAddress).single()),
  
  // Create or update fan
  upsert: (fan: FanInsert) => 
    handleResponse<Fan>(supabase.from(TABLES.FANS).upsert(fan).select().single()),
  
  // Update fan
  update: (id: string, updates: FanUpdate) => 
    handleResponse<Fan>(supabase.from(TABLES.FANS).update(updates).eq('id', id).select().single())
};

// Tip operations
export const tipOperations = {
  // Create tip
  create: (tip: TipInsert) => 
    handleResponse<Tip>(supabase.from(TABLES.TIPS).insert(tip).select().single()),
  
  // Get tips by creator ID
  getByCreatorId: (creatorId: string, page = 1, pageSize = 10) => 
    handleResponse<Tip[]>(
      supabase.from(TABLES.TIPS)
        .select('*')
        .eq('creatorId', creatorId)
        .order('createdAt', { ascending: false })
        .range((page - 1) * pageSize, page * pageSize - 1)
    ),
  
  // Get tips by fan wallet address
  getByFanWalletAddress: (walletAddress: string, page = 1, pageSize = 10) => 
    handleResponse<Tip[]>(
      supabase.from(TABLES.TIPS)
        .select('*')
        .eq('fanWalletAddress', walletAddress)
        .order('createdAt', { ascending: false })
        .range((page - 1) * pageSize, page * pageSize - 1)
    ),
  
  // Get tip by transaction hash
  getByTransactionHash: (hash: string) => 
    handleResponse<Tip>(supabase.from(TABLES.TIPS).select('*').eq('transactionHash', hash).single())
};

// TipGoal operations
export const tipGoalOperations = {
  // Create tip goal
  create: (goal: TipGoalInsert) => 
    handleResponse<TipGoal>(supabase.from(TABLES.TIP_GOALS).insert(goal).select().single()),
  
  // Update tip goal
  update: (id: string, updates: TipGoalUpdate) => 
    handleResponse<TipGoal>(supabase.from(TABLES.TIP_GOALS).update(updates).eq('id', id).select().single()),
  
  // Get active goals by creator ID
  getActiveByCreatorId: (creatorId: string) => 
    handleResponse<TipGoal[]>(
      supabase.from(TABLES.TIP_GOALS)
        .select('*')
        .eq('creatorId', creatorId)
        .eq('isActive', true)
        .order('createdAt', { ascending: false })
    ),
  
  // Update goal progress
  updateProgress: async (id: string, amount: number) => {
    const { data: goal, error } = await supabase
      .from(TABLES.TIP_GOALS)
      .select('currentAmount')
      .eq('id', id)
      .single();
    
    if (error || !goal) {
      return { error: { message: error?.message || 'Goal not found' } };
    }
    
    const newAmount = Number(goal.currentAmount) + Number(amount);
    
    return handleResponse<TipGoal>(
      supabase.from(TABLES.TIP_GOALS)
        .update({ currentAmount: newAmount })
        .eq('id', id)
        .select()
        .single()
    );
  }
};

// Tier operations
export const tierOperations = {
  // Create tier
  create: (tier: TierInsert) => 
    handleResponse<Tier>(supabase.from(TABLES.TIERS).insert(tier).select().single()),
  
  // Update tier
  update: (id: string, updates: TierUpdate) => 
    handleResponse<Tier>(supabase.from(TABLES.TIERS).update(updates).eq('id', id).select().single()),
  
  // Get active tiers by creator ID
  getActiveByCreatorId: (creatorId: string) => 
    handleResponse<Tier[]>(
      supabase.from(TABLES.TIERS)
        .select('*')
        .eq('creatorId', creatorId)
        .eq('isActive', true)
        .order('minAmount', { ascending: true })
    ),
  
  // Get tier by ID
  getById: (id: string) => 
    handleResponse<Tier>(supabase.from(TABLES.TIERS).select('*').eq('id', id).single())
};
