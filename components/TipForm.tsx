/**
 * TipForm component for Base Creator Connect
 * 
 * This component allows fans to send tips to creators.
 */

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { FanMessageInput } from '@/components/FanMessageInput';
import { TipButton } from '@/components/TipButton';
import { sendTip, DEFAULT_TIP_AMOUNTS, TransactionStatus, getTierForAmount } from '@/lib/transactions';
import { Tier, TipGoal } from '@/types/database';

interface TipFormProps {
  creatorId: string;
  creatorWalletAddress: string;
  fanWalletAddress: string;
  tiers?: Tier[];
  goals?: TipGoal[];
  onSuccess: (hash: string) => void;
  onError: (error: string) => void;
}

export function TipForm({
  creatorId,
  creatorWalletAddress,
  fanWalletAddress,
  tiers = [],
  goals = [],
  onSuccess,
  onError,
}: TipFormProps) {
  const [amount, setAmount] = useState<string>(DEFAULT_TIP_AMOUNTS[1]);
  const [message, setMessage] = useState<string>('');
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const [isCustomAmount, setIsCustomAmount] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Handle amount selection
  const handleAmountSelect = (selectedAmount: string) => {
    setAmount(selectedAmount);
    setIsCustomAmount(false);
  };
  
  // Handle custom amount
  const handleCustomAmount = () => {
    setIsCustomAmount(true);
  };
  
  // Handle message change
  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };
  
  // Handle goal selection
  const handleGoalSelect = (goalId: string) => {
    setSelectedGoalId(selectedGoalId === goalId ? null : goalId);
  };
  
  // Handle tip submission
  const handleSubmit = async (sendTransaction: any) => {
    setIsLoading(true);
    
    try {
      // Get tier ID based on amount
      const tierId = getTierForAmount(tiers, amount);
      
      // Send tip
      const result = await sendTip(sendTransaction, {
        creatorId,
        creatorWalletAddress,
        fanWalletAddress,
        amount,
        message,
        tierId,
        tipGoalId: selectedGoalId || undefined,
      });
      
      if (result.status === TransactionStatus.SUCCESS) {
        onSuccess(result.hash!);
      } else {
        onError(result.error || 'Transaction failed');
      }
    } catch (error: any) {
      onError(error.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Send a Tip</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Amount</label>
          {isCustomAmount ? (
            <div className="flex space-x-2">
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="ETH Amount"
                step="0.001"
                min="0.001"
              />
              <Button variant="outline" onClick={() => setIsCustomAmount(false)}>
                Cancel
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {DEFAULT_TIP_AMOUNTS.map((amt) => (
                <TipButton
                  key={amt}
                  onClick={() => handleAmountSelect(amt)}
                  variant={amount === amt ? 'default' : 'outline'}
                >
                  {amt} ETH
                </TipButton>
              ))}
              <TipButton onClick={handleCustomAmount} variant="outline">
                Custom
              </TipButton>
            </div>
          )}
        </div>
        
        {tiers.length > 0 && (
          <div>
            <label className="text-sm font-medium mb-2 block">Tipping Tiers</label>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {tiers.map((tier) => {
                const isSelected = parseFloat(amount) >= tier.minAmount;
                return (
                  <div
                    key={tier.id}
                    className={`border rounded-md p-2 ${
                      isSelected ? 'border-primary bg-primary/5' : ''
                    }`}
                  >
                    <div className="flex justify-between">
                      <span className="font-medium">{tier.name}</span>
                      <span>{tier.minAmount} ETH</span>
                    </div>
                    {tier.perkDescription && (
                      <p className="text-sm text-gray-500 mt-1">{tier.perkDescription}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
        
        {goals.length > 0 && (
          <div>
            <label className="text-sm font-medium mb-2 block">Contribute to a Goal</label>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {goals.map((goal) => (
                <div
                  key={goal.id}
                  className={`border rounded-md p-2 cursor-pointer ${
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
        
        <div>
          <label className="text-sm font-medium mb-2 block">Message (Optional)</label>
          <FanMessageInput value={message} onChange={handleMessageChange} />
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          disabled={isLoading || !amount || parseFloat(amount) <= 0}
          onClick={() => handleSubmit}
        >
          {isLoading ? 'Processing...' : `Send ${amount} ETH Tip`}
        </Button>
      </CardFooter>
    </Card>
  );
}

