/**
 * Transaction utilities for Base Creator Connect
 * 
 * This file contains utility functions for handling blockchain transactions.
 */

import { parseEther, formatEther } from 'viem';
import { tipApi } from './api';
import { TipInsert } from '@/types/database';

// Default tip amounts in ETH
export const DEFAULT_TIP_AMOUNTS = ['0.001', '0.005', '0.01', '0.05', '0.1'];

// Transaction status
export enum TransactionStatus {
  PENDING = 'pending',
  SUCCESS = 'success',
  FAILED = 'failed'
}

// Transaction result
export interface TransactionResult {
  status: TransactionStatus;
  hash?: string;
  error?: string;
}

// Send tip transaction
export const sendTip = async (
  sendTransaction: any,
  {
    creatorId,
    creatorWalletAddress,
    fanWalletAddress,
    amount,
    message,
    reaction,
    tierId,
    tipGoalId
  }: {
    creatorId: string;
    creatorWalletAddress: string;
    fanWalletAddress: string;
    amount: string;
    message?: string;
    reaction?: string;
    tierId?: string;
    tipGoalId?: string;
  }
): Promise<TransactionResult> => {
  try {
    // Convert amount to wei
    const valueInWei = parseEther(amount);
    
    // Send transaction
    const hash = await sendTransaction({
      to: creatorWalletAddress,
      value: valueInWei,
    });
    
    if (!hash) {
      return { status: TransactionStatus.FAILED, error: 'Transaction failed' };
    }
    
    // Create tip record in database
    const tipData: TipInsert = {
      creatorId,
      fanWalletAddress,
      amount: parseFloat(amount),
      currency: 'ETH',
      message,
      reaction,
      transactionHash: hash,
      tierId,
      tipGoalId
    };
    
    await tipApi.createTip(tipData);
    
    return { status: TransactionStatus.SUCCESS, hash };
  } catch (error: any) {
    console.error('Transaction error:', error);
    return { 
      status: TransactionStatus.FAILED, 
      error: error.message || 'Transaction failed' 
    };
  }
};

// Get tier for amount
export const getTierForAmount = (tiers: Array<{ id: string; minAmount: number }>, amount: string): string | undefined => {
  const amountValue = parseFloat(amount);
  
  // Sort tiers by minAmount in descending order
  const sortedTiers = [...tiers].sort((a, b) => b.minAmount - a.minAmount);
  
  // Find the highest tier that the amount qualifies for
  const matchingTier = sortedTiers.find(tier => amountValue >= tier.minAmount);
  
  return matchingTier?.id;
};

// Format amount with currency
export const formatAmount = (amount: number | string, currency = 'ETH'): string => {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (currency === 'ETH') {
    return `${numAmount} ETH`;
  }
  
  return `${numAmount} ${currency}`;
};

// Estimate gas for transaction
export const estimateGas = async (
  client: any,
  { to, value }: { to: string; value: bigint }
): Promise<bigint | null> => {
  try {
    const gasEstimate = await client.estimateGas({
      to,
      value,
    });
    
    return gasEstimate;
  } catch (error) {
    console.error('Gas estimation error:', error);
    return null;
  }
};

