/**
 * Embeddable widget for Base Creator Connect
 * 
 * This file implements the embeddable widget for tipping creators.
 */

'use client';

import { useState, useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { useSendTransaction } from 'wagmi';
import { parseEther } from 'viem';
import { creatorOperations, tipOperations } from '@/lib/supabase';
import { sendTip, DEFAULT_TIP_AMOUNTS, TransactionStatus } from '@/lib/transactions';
import { getCachedOrGenerateThankYouNote } from '@/lib/ai';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AppFrame } from '@/components/AppFrame';
import { TipButton } from '@/components/TipButton';
import { FanMessageInput } from '@/components/FanMessageInput';
import { GoalProgressBar } from '@/components/GoalProgressBar';
import { TierCard } from '@/components/TierCard';

// Widget states
enum WidgetState {
  LOADING = 'loading',
  CONNECT = 'connect',
  SELECT_AMOUNT = 'select_amount',
  CUSTOM_AMOUNT = 'custom_amount',
  ADD_MESSAGE = 'add_message',
  PROCESSING = 'processing',
  SUCCESS = 'success',
  ERROR = 'error'
}

export default function Widget({ params }: { params: { creatorId: string } }) {
  const { creatorId } = params;
  const { ready, authenticated, login, user } = usePrivy();
  const { sendTransaction } = useSendTransaction();
  
  const [state, setState] = useState<WidgetState>(WidgetState.LOADING);
  const [creator, setCreator] = useState<any>(null);
  const [amount, setAmount] = useState<string>(DEFAULT_TIP_AMOUNTS[1]);
  const [message, setMessage] = useState<string>('');
  const [transactionHash, setTransactionHash] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [thankYouNote, setThankYouNote] = useState<string>('');
  
  // Load creator data
  useEffect(() => {
    const loadCreator = async () => {
      try {
        const { data } = await creatorOperations.getWithRelations(creatorId);
        if (data) {
          setCreator(data);
          setState(authenticated ? WidgetState.SELECT_AMOUNT : WidgetState.CONNECT);
        } else {
          setError('Creator not found');
          setState(WidgetState.ERROR);
        }
      } catch (error) {
        console.error('Error loading creator:', error);
        setError('Failed to load creator');
        setState(WidgetState.ERROR);
      }
    };
    
    if (ready) {
      loadCreator();
    }
  }, [creatorId, ready, authenticated]);
  
  // Handle connect wallet
  const handleConnect = async () => {
    try {
      await login();
    } catch (error) {
      console.error('Error connecting wallet:', error);
      setError('Failed to connect wallet');
      setState(WidgetState.ERROR);
    }
  };
  
  // Handle amount selection
  const handleSelectAmount = (selectedAmount: string) => {
    setAmount(selectedAmount);
    setState(WidgetState.ADD_MESSAGE);
  };
  
  // Handle custom amount
  const handleCustomAmount = () => {
    setState(WidgetState.CUSTOM_AMOUNT);
  };
  
  // Handle custom amount submission
  const handleCustomAmountSubmit = () => {
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    
    setState(WidgetState.ADD_MESSAGE);
  };
  
  // Handle message change
  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };
  
  // Handle tip submission
  const handleSubmitTip = async () => {
    if (!creator || !user?.wallet?.address) {
      setError('Creator or wallet not found');
      setState(WidgetState.ERROR);
      return;
    }
    
    setState(WidgetState.PROCESSING);
    
    try {
      const result = await sendTip(sendTransaction, {
        creatorId: creator.id,
        creatorWalletAddress: creator.walletAddress,
        fanWalletAddress: user.wallet.address,
        amount,
        message,
        // Add tier and goal IDs if applicable
      });
      
      if (result.status === TransactionStatus.SUCCESS) {
        setTransactionHash(result.hash!);
        
        // Generate thank-you note
        const note = await getCachedOrGenerateThankYouNote(message, amount);
        setThankYouNote(note);
        
        setState(WidgetState.SUCCESS);
      } else {
        setError(result.error || 'Transaction failed');
        setState(WidgetState.ERROR);
      }
    } catch (error: any) {
      console.error('Error sending tip:', error);
      setError(error.message || 'Failed to send tip');
      setState(WidgetState.ERROR);
    }
  };
  
  // Handle reset
  const handleReset = () => {
    setAmount(DEFAULT_TIP_AMOUNTS[1]);
    setMessage('');
    setTransactionHash('');
    setError('');
    setThankYouNote('');
    setState(WidgetState.SELECT_AMOUNT);
  };
  
  // Render based on state
  const renderContent = () => {
    switch (state) {
      case WidgetState.LOADING:
        return (
          <div className="flex flex-col items-center justify-center p-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
            <p>Loading...</p>
          </div>
        );
      
      case WidgetState.CONNECT:
        return (
          <div className="flex flex-col items-center justify-center p-4">
            <h2 className="text-xl font-semibold mb-4">Connect Wallet to Tip</h2>
            <Button onClick={handleConnect}>Connect Wallet</Button>
          </div>
        );
      
      case WidgetState.SELECT_AMOUNT:
        return (
          <div className="flex flex-col p-4">
            <h2 className="text-xl font-semibold mb-4">Select Tip Amount</h2>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {DEFAULT_TIP_AMOUNTS.map((amt) => (
                <TipButton key={amt} onClick={() => handleSelectAmount(amt)}>
                  {amt} ETH
                </TipButton>
              ))}
              <TipButton onClick={handleCustomAmount}>Custom</TipButton>
            </div>
            
            {creator?.tiers && creator.tiers.length > 0 && (
              <div className="mt-4">
                <h3 className="text-lg font-medium mb-2">Tipping Tiers</h3>
                <div className="space-y-2">
                  {creator.tiers.map((tier: any) => (
                    <TierCard
                      key={tier.id}
                      name={tier.name}
                      minAmount={tier.minAmount}
                      perk={tier.perkDescription}
                    />
                  ))}
                </div>
              </div>
            )}
            
            {creator?.tipGoals && creator.tipGoals.length > 0 && (
              <div className="mt-4">
                <h3 className="text-lg font-medium mb-2">Creator Goals</h3>
                <div className="space-y-4">
                  {creator.tipGoals.map((goal: any) => (
                    <div key={goal.id} className="border rounded p-3">
                      <div className="flex justify-between mb-1">
                        <span>{goal.name}</span>
                        <span>{goal.currentAmount} / {goal.targetAmount} ETH</span>
                      </div>
                      <GoalProgressBar value={(goal.currentAmount / goal.targetAmount) * 100} />
                      {goal.description && <p className="text-sm mt-2">{goal.description}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      
      case WidgetState.CUSTOM_AMOUNT:
        return (
          <div className="flex flex-col p-4">
            <h2 className="text-xl font-semibold mb-4">Enter Custom Amount</h2>
            <div className="flex space-x-2 mb-4">
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="ETH Amount"
                step="0.001"
                min="0.001"
              />
              <Button onClick={handleCustomAmountSubmit}>Next</Button>
            </div>
            <Button variant="outline" onClick={() => setState(WidgetState.SELECT_AMOUNT)}>
              Back
            </Button>
          </div>
        );
      
      case WidgetState.ADD_MESSAGE:
        return (
          <div className="flex flex-col p-4">
            <h2 className="text-xl font-semibold mb-4">Add a Message (Optional)</h2>
            <div className="mb-4">
              <FanMessageInput value={message} onChange={handleMessageChange} />
            </div>
            <div className="flex space-x-2">
              <Button onClick={handleSubmitTip}>Send {amount} ETH</Button>
              <Button variant="outline" onClick={() => setState(WidgetState.SELECT_AMOUNT)}>
                Back
              </Button>
            </div>
          </div>
        );
      
      case WidgetState.PROCESSING:
        return (
          <div className="flex flex-col items-center justify-center p-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
            <p>Processing your tip...</p>
          </div>
        );
      
      case WidgetState.SUCCESS:
        return (
          <div className="flex flex-col p-4">
            <h2 className="text-xl font-semibold mb-4">Tip Sent Successfully!</h2>
            <p className="mb-4">You sent {amount} ETH to {creator?.username || 'Creator'}</p>
            
            {thankYouNote && (
              <Card className="mb-4">
                <CardHeader>
                  <CardTitle>Thank You Note</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{thankYouNote}</p>
                </CardContent>
              </Card>
            )}
            
            <div className="flex space-x-2">
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
          </div>
        );
      
      case WidgetState.ERROR:
        return (
          <div className="flex flex-col p-4">
            <h2 className="text-xl font-semibold mb-4 text-red-500">Error</h2>
            <p className="mb-4">{error}</p>
            <Button onClick={handleReset}>Try Again</Button>
          </div>
        );
      
      default:
        return null;
    }
  };
  
  return (
    <AppFrame variant="withHeader">
      <div className="flex flex-col">
        {creator && (
          <div className="flex items-center mb-4">
            {creator.profileImageUrl && (
              <img
                src={creator.profileImageUrl}
                alt={creator.username || 'Creator'}
                className="w-10 h-10 rounded-full mr-3"
              />
            )}
            <div>
              <h1 className="text-lg font-semibold">{creator.username || 'Creator'}</h1>
              {creator.bio && <p className="text-sm text-gray-500">{creator.bio}</p>}
            </div>
          </div>
        )}
        
        {renderContent()}
      </div>
    </AppFrame>
  );
}

