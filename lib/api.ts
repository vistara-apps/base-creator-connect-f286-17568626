/**
 * API utilities for Base Creator Connect
 * 
 * This file contains utility functions for API operations and data fetching.
 */

import { 
  creatorOperations, 
  fanOperations, 
  tipOperations, 
  tipGoalOperations, 
  tierOperations 
} from './supabase';
import { 
  Creator, CreatorInsert, CreatorUpdate,
  Fan, FanInsert,
  Tip, TipInsert,
  TipGoal, TipGoalInsert, TipGoalUpdate,
  Tier, TierInsert, TierUpdate
} from '@/types/database';

// Creator API
export const creatorApi = {
  // Get or create creator from wallet
  getOrCreateFromWallet: async (walletAddress: string, farcasterId?: string): Promise<Creator | null> => {
    // Try to get existing creator
    const { data: existingCreator } = await creatorOperations.getByWalletAddress(walletAddress);
    
    if (existingCreator) {
      return existingCreator;
    }
    
    // Create new creator
    const newCreator: CreatorInsert = {
      walletAddress,
      farcasterId,
    };
    
    const { data: createdCreator, error } = await creatorOperations.upsert(newCreator);
    
    if (error || !createdCreator) {
      console.error('Failed to create creator:', error);
      return null;
    }
    
    return createdCreator;
  },
  
  // Update creator profile
  updateProfile: async (
    id: string, 
    updates: { username?: string; bio?: string; profileImageUrl?: string; socialLinks?: Record<string, string> }
  ): Promise<Creator | null> => {
    const { data: updatedCreator, error } = await creatorOperations.update(id, updates);
    
    if (error || !updatedCreator) {
      console.error('Failed to update creator profile:', error);
      return null;
    }
    
    return updatedCreator;
  },
  
  // Get creator with all related data
  getWithRelations: async (id: string) => {
    const { data, error } = await creatorOperations.getWithRelations(id);
    
    if (error || !data) {
      console.error('Failed to get creator with relations:', error);
      return null;
    }
    
    return data;
  }
};

// Fan API
export const fanApi = {
  // Get or create fan from wallet
  getOrCreateFromWallet: async (walletAddress: string, farcasterId?: string): Promise<Fan | null> => {
    // Try to get existing fan
    const { data: existingFan } = await fanOperations.getByWalletAddress(walletAddress);
    
    if (existingFan) {
      return existingFan;
    }
    
    // Create new fan
    const newFan: FanInsert = {
      walletAddress,
      farcasterId,
    };
    
    const { data: createdFan, error } = await fanOperations.upsert(newFan);
    
    if (error || !createdFan) {
      console.error('Failed to create fan:', error);
      return null;
    }
    
    return createdFan;
  }
};

// Tip API
export const tipApi = {
  // Create a new tip
  createTip: async (tip: TipInsert): Promise<Tip | null> => {
    const { data: createdTip, error } = await tipOperations.create(tip);
    
    if (error || !createdTip) {
      console.error('Failed to create tip:', error);
      return null;
    }
    
    // If tip is associated with a goal, update goal progress
    if (tip.tipGoalId) {
      await tipGoalOperations.updateProgress(tip.tipGoalId, Number(tip.amount));
    }
    
    return createdTip;
  },
  
  // Get tips by creator
  getByCreator: async (creatorId: string, page = 1, pageSize = 10): Promise<Tip[] | null> => {
    const { data: tips, error } = await tipOperations.getByCreatorId(creatorId, page, pageSize);
    
    if (error || !tips) {
      console.error('Failed to get tips by creator:', error);
      return null;
    }
    
    return tips;
  },
  
  // Get tips by fan
  getByFan: async (walletAddress: string, page = 1, pageSize = 10): Promise<Tip[] | null> => {
    const { data: tips, error } = await tipOperations.getByFanWalletAddress(walletAddress, page, pageSize);
    
    if (error || !tips) {
      console.error('Failed to get tips by fan:', error);
      return null;
    }
    
    return tips;
  }
};

// TipGoal API
export const tipGoalApi = {
  // Create a new tip goal
  createGoal: async (goal: TipGoalInsert): Promise<TipGoal | null> => {
    const { data: createdGoal, error } = await tipGoalOperations.create(goal);
    
    if (error || !createdGoal) {
      console.error('Failed to create tip goal:', error);
      return null;
    }
    
    return createdGoal;
  },
  
  // Update a tip goal
  updateGoal: async (id: string, updates: TipGoalUpdate): Promise<TipGoal | null> => {
    const { data: updatedGoal, error } = await tipGoalOperations.update(id, updates);
    
    if (error || !updatedGoal) {
      console.error('Failed to update tip goal:', error);
      return null;
    }
    
    return updatedGoal;
  },
  
  // Get active goals for a creator
  getActiveGoals: async (creatorId: string): Promise<TipGoal[] | null> => {
    const { data: goals, error } = await tipGoalOperations.getActiveByCreatorId(creatorId);
    
    if (error || !goals) {
      console.error('Failed to get active goals:', error);
      return null;
    }
    
    return goals;
  }
};

// Tier API
export const tierApi = {
  // Create a new tier
  createTier: async (tier: TierInsert): Promise<Tier | null> => {
    const { data: createdTier, error } = await tierOperations.create(tier);
    
    if (error || !createdTier) {
      console.error('Failed to create tier:', error);
      return null;
    }
    
    return createdTier;
  },
  
  // Update a tier
  updateTier: async (id: string, updates: TierUpdate): Promise<Tier | null> => {
    const { data: updatedTier, error } = await tierOperations.update(id, updates);
    
    if (error || !updatedTier) {
      console.error('Failed to update tier:', error);
      return null;
    }
    
    return updatedTier;
  },
  
  // Get active tiers for a creator
  getActiveTiers: async (creatorId: string): Promise<Tier[] | null> => {
    const { data: tiers, error } = await tierOperations.getActiveByCreatorId(creatorId);
    
    if (error || !tiers) {
      console.error('Failed to get active tiers:', error);
      return null;
    }
    
    return tiers;
  }
};

