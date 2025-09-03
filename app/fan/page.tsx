'use client';

import { useState, useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { useSendTransaction } from 'wagmi';
import { parseEther } from 'viem';
import { creatorOperations, tierOperations, tipGoalOperations } from '@/lib/supabase';
import { sendTip, TransactionStatus } from '@/lib/transactions';
import { getCachedOrGenerateThankYouNote } from '@/lib/ai';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TipForm } from '@/components/TipForm';
import { TierSelector } from '@/components/TierSelector';
import { GoalDisplay } from '@/components/GoalDisplay';
import { LoadingState } from '@/components/LoadingState';
import { ErrorDisplay } from '@/components/ErrorDisplay';
import { Creator, Tier, TipGoal } from '@/types/database';

export default function FanTipping({ searchParams }: { searchParams: { creatorId?: string } }) {
  const { creatorId } = searchParams;
  const { ready, authenticated, login, user } = usePrivy();
  const { sendTransaction } = useSendTransaction();
  
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [creator, setCreator] = useState<Creator | null>(null);
  const [tiers, setTiers] = useState<Tier[]>([]);
  const [goals, setGoals] = useState<TipGoal[]>([]);
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const [tipAmount, setTipAmount] = useState<string>('0.01');
  const [message, setMessage] = useState<string>('');
  const [transactionStatus, setTransactionStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [transactionHash, setTransactionHash] = useState<string | null>(null);
  const [thankYouNote, setThankYouNote] = useState<string | null>(null);
  
  // Load creator data
  useEffect(() => {
    const loadCreatorData = async () => {
      if (!creatorId) {
        setError('Creator ID is required');
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        
        // Get creator
        const { data: creatorData, error: creatorError } = await creatorOperations.getById(creatorId);
        
        if (creatorError || !creatorData) {
          setError('Creator not found');
          setLoading(false);
          return;
        }
        
        setCreator(creatorData);
        
        // Load tiers
        const { data: tiersData } = await tierOperations.getActiveByCreatorId(creatorId);
        if (tiersData) {
          setTiers(tiersData);
        }
        
        // Load goals
        const { data: goalsData } = await tipGoalOperations.getActiveByCreatorId(creatorId);
        if (goalsData) {
          setGoals(goalsData);
        }
      } catch (error: any) {
        console.error('Error loading creator data:', error);
        setError(error.message || 'Failed to load creator data');
      } finally {
        setLoading(false);
      }
    };
    
    loadCreatorData();
  }, [creatorId]);
  
  // Handle tip submission
  const handleTip = async () => {
    if (!creator || !user?.wallet?.address) {
      setError('Creator or wallet not found');
      return;
    }
    
    setTransactionStatus('processing');
    
    try {
      // Get tier ID based on amount
      const qualifyingTiers = tiers
        .filter(tier => parseFloat(tipAmount) >= tier.minAmount)
        .sort((a, b) => b.minAmount - a.minAmount);
      
      const tierId = qualifyingTiers.length > 0 ? qualifyingTiers[0].id : undefined;
      
      // Send tip
      const result = await sendTip(sendTransaction, {
        creatorId: creator.id,
        creatorWalletAddress: creator.walletAddress,
        fanWalletAddress: user.wallet.address,
        amount: tipAmount,
        message,
        tierId,
        tipGoalId: selectedGoalId || undefined,
      });
      
      if (result.status === TransactionStatus.SUCCESS) {
        setTransactionHash(result.hash);
        
        // Generate thank-you note
        const tierName = qualifyingTiers.length > 0 ? qualifyingTiers[0].name : undefined;
        const note = await getCachedOrGenerateThankYouNote(message, tipAmount, tierName);
        setThankYouNote(note);
        
        setTransactionStatus('success');
      } else {
        setError(result.error || 'Transaction failed');
        setTransactionStatus('error');
      }
    } catch (error: any) {
      console.error('Error sending tip:', error);
      setError(error.message || 'Failed to send tip');
      setTransactionStatus('error');
    }
  };
  
  // Handle goal selection
  const handleGoalSelect = (goalId: string) => {
    setSelectedGoalId(selectedGoalId === goalId ? null : goalId);
  };
  
  // Handle reset
  const handleReset = () => {
    setTipAmount('0.01');
    setMessage('');
    setSelectedGoalId(null);
    setTransactionHash(null);
    setThankYouNote(null);
    setTransactionStatus('idle');
    setError(null);
  };
  
  // If not authenticated, show login button
  if (!authenticated && !loading) {
    return (
      <div className="container max-w-lg px-4 mx-auto py-8">
        <h1 className="text-3xl font-bold mb-4">Tip Creator</h1>
        <p className="mb-4">Connect your wallet to tip this creator.</p>
        <Button onClick={() => login()}>Connect Wallet</Button>
      </div>
    );
  }
  
  // If loading, show loading state
  if (loading) {
    return (
      <div className="container max-w-lg px-4 mx-auto py-8">
        <h1 className="text-3xl font-bold mb-4">Tip Creator</h1>
        <LoadingState message="Loading creator profile..." />
      </div>
    );
  }
  
  // If error, show error state
  if (error && transactionStatus !== 'error') {
    return (
      <div className="container max-w-lg px-4 mx-auto py-8">
        <h1 className="text-3xl font-bold mb-4">Tip Creator</h1>
        <ErrorDisplay
          title="Error"
          message={error}
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }
  
  // If transaction is successful, show success state
  if (transactionStatus === 'success' && transactionHash) {
    return (
      <div className="container max-w-lg px-4 mx-auto py-8">
        <h1 className="text-3xl font-bold mb-4">Tip Sent Successfully!</h1>
        
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Thank You!</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">You sent {tipAmount} ETH to {creator?.username || 'Creator'}</p>
            
            {thankYouNote && (
              <div className="border-l-4 border-primary pl-4 italic mb-4">
                <p>{thankYouNote}</p>
              </div>
            )}
            
            <div className="flex space-x-2 mt-4">
              <Button
                as="a"
                href={`https://basescan.org/tx/${transactionHash}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                View Transaction
              </Button>
              <Button variant="outline" onClick={handleReset}>
                Tip Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // If transaction failed, show error state
  if (transactionStatus === 'error') {
    return (
      <div className="container max-w-lg px-4 mx-auto py-8">
        <h1 className="text-3xl font-bold mb-4">Tip Failed</h1>
        <ErrorDisplay
          title="Transaction Failed"
          message={error || 'An error occurred while processing your tip'}
          onRetry={handleReset}
        />
      </div>
    );
  }
  
  // If transaction is processing, show loading state
  if (transactionStatus === 'processing') {
    return (
      <div className="container max-w-lg px-4 mx-auto py-8">
        <h1 className="text-3xl font-bold mb-4">Processing Tip</h1>
        <LoadingState message="Processing your transaction..." />
      </div>
    );
  }
  
  return (
    <div className="container max-w-lg px-4 mx-auto py-8">
      <div className="flex items-center mb-6">
        {creator?.profileImageUrl && (
          <img
            src={creator.profileImageUrl}
            alt={creator.username || 'Creator'}
            className="w-12 h-12 rounded-full mr-4"
          />
        )}
        <div>
          <h1 className="text-2xl font-bold">Tip {creator?.username || 'Creator'}</h1>
          {creator?.bio && <p className="text-gray-600">{creator.bio}</p>}
        </div>
      </div>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Send a Tip</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Amount (ETH)</label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    value={tipAmount}
                    onChange={(e) => setTipAmount(e.target.value)}
                    placeholder="0.01"
                    step="0.001"
                    min="0.001"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Message (Optional)</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Add a message or reaction"
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
              
              {tiers.length > 0 && (
                <TierSelector
                  tiers={tiers}
                  amount={tipAmount}
                  onSelect={() => {}}
                />
              )}
              
              {goals.length > 0 && (
                <div>
                  <label className="text-sm font-medium mb-1 block">Contribute to a Goal (Optional)</label>
                  <div className="space-y-2">
                    {goals.map(goal => (
                      <div
                        key={goal.id}
                        className={`border rounded-md p-3 cursor-pointer ${
                          selectedGoalId === goal.id ? 'border-primary bg-primary/5' : ''
                        }`}
                        onClick={() => handleGoalSelect(goal.id)}
                      >
                        <div className="flex justify-between">
                          <span className="font-medium">{goal.name}</span>
                          <span>
                            {goal.currentAmount} / {goal.targetAmount} ETH
                          </span>
                        </div>
                        {goal.description && (
                          <p className="text-sm text-gray-500 mt-1">{goal.description}</p>
                        )}
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                          <div
                            className="bg-primary h-2.5 rounded-full"
                            style={{
                              width: `${Math.min(
                                (goal.currentAmount / goal.targetAmount) * 100,
                                100
                              )}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <Button
                className="w-full"
                onClick={handleTip}
                disabled={!tipAmount || parseFloat(tipAmount) <= 0}
              >
                Send Tip
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
