'use client';

import { useState, useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { useWalletClient } from 'wagmi';
import { creatorApi, tierApi, tipGoalApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProfileForm } from '@/components/ProfileForm';
import { TierForm } from '@/components/TierForm';
import { GoalForm } from '@/components/GoalForm';
import { TierCard } from '@/components/TierCard';
import { GoalDisplay } from '@/components/GoalDisplay';
import { EmbedCode } from '@/components/EmbedCode';
import { LoadingState } from '@/components/LoadingState';
import { ErrorDisplay } from '@/components/ErrorDisplay';
import { Creator, Tier, TipGoal } from '@/types/database';

export default function CreatorDashboard() {
  const { user, ready, authenticated, login } = usePrivy();
  const { data: walletClient } = useWalletClient();
  
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [creator, setCreator] = useState<Creator | null>(null);
  const [tiers, setTiers] = useState<Tier[]>([]);
  const [goals, setGoals] = useState<TipGoal[]>([]);
  const [showTierForm, setShowTierForm] = useState<boolean>(false);
  const [showGoalForm, setShowGoalForm] = useState<boolean>(false);
  const [editingTier, setEditingTier] = useState<Tier | null>(null);
  const [editingGoal, setEditingGoal] = useState<TipGoal | null>(null);
  const [embedCode, setEmbedCode] = useState<string>('');
  const [farcasterFrameCode, setFarcasterFrameCode] = useState<string>('');
  
  // Base URL for the app
  const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://base-creator-connect.vercel.app';
  
  // Load creator data
  useEffect(() => {
    const loadCreatorData = async () => {
      if (!ready || !authenticated || !user?.wallet?.address) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        
        // Get or create creator
        const creatorData = await creatorApi.getOrCreateFromWallet(
          user.wallet.address,
          user.id
        );
        
        if (creatorData) {
          setCreator(creatorData);
          
          // Load tiers
          const tiersData = await tierApi.getActiveTiers(creatorData.id);
          if (tiersData) {
            setTiers(tiersData);
          }
          
          // Load goals
          const goalsData = await tipGoalApi.getActiveGoals(creatorData.id);
          if (goalsData) {
            setGoals(goalsData);
          }
          
          // Generate embed codes
          setEmbedCode(`<iframe
  src="${BASE_URL}/widget/${creatorData.id}"
  width="100%"
  height="400px"
  frameborder="0"
  allow="clipboard-write; encrypted-media"
  style="border-radius: 10px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);"
></iframe>`);
          
          setFarcasterFrameCode(`<meta property="fc:frame" content="vNext" />
<meta property="fc:frame:image" content="${BASE_URL}/api/og?creatorId=${creatorData.id}" />
<meta property="fc:frame:post_url" content="${BASE_URL}/api/frame?creatorId=${creatorData.id}" />
<meta property="fc:frame:button:1" content="Tip Creator" />`);
        }
      } catch (error: any) {
        console.error('Error loading creator data:', error);
        setError(error.message || 'Failed to load creator data');
      } finally {
        setLoading(false);
      }
    };
    
    loadCreatorData();
  }, [ready, authenticated, user]);
  
  // Handle profile update
  const handleProfileUpdate = async () => {
    if (creator) {
      // Reload creator data
      const updatedCreator = await creatorApi.getOrCreateFromWallet(
        creator.walletAddress,
        creator.farcasterId
      );
      
      if (updatedCreator) {
        setCreator(updatedCreator);
      }
    }
  };
  
  // Handle tier save
  const handleTierSave = async () => {
    if (creator) {
      setShowTierForm(false);
      setEditingTier(null);
      
      // Reload tiers
      const tiersData = await tierApi.getActiveTiers(creator.id);
      if (tiersData) {
        setTiers(tiersData);
      }
    }
  };
  
  // Handle goal save
  const handleGoalSave = async () => {
    if (creator) {
      setShowGoalForm(false);
      setEditingGoal(null);
      
      // Reload goals
      const goalsData = await tipGoalApi.getActiveGoals(creator.id);
      if (goalsData) {
        setGoals(goalsData);
      }
    }
  };
  
  // Handle edit tier
  const handleEditTier = (tier: Tier) => {
    setEditingTier(tier);
    setShowTierForm(true);
  };
  
  // Handle edit goal
  const handleEditGoal = (goal: TipGoal) => {
    setEditingGoal(goal);
    setShowGoalForm(true);
  };
  
  // If not authenticated, show login button
  if (!authenticated && !loading) {
    return (
      <div className="container max-w-lg px-4 mx-auto py-8">
        <h1 className="text-3xl font-bold mb-4">Creator Dashboard</h1>
        <p className="mb-4">Connect your wallet to access the creator dashboard.</p>
        <Button onClick={() => login()}>Connect Wallet</Button>
      </div>
    );
  }
  
  // If loading, show loading state
  if (loading) {
    return (
      <div className="container max-w-lg px-4 mx-auto py-8">
        <h1 className="text-3xl font-bold mb-4">Creator Dashboard</h1>
        <LoadingState message="Loading your creator profile..." />
      </div>
    );
  }
  
  // If error, show error state
  if (error) {
    return (
      <div className="container max-w-lg px-4 mx-auto py-8">
        <h1 className="text-3xl font-bold mb-4">Creator Dashboard</h1>
        <ErrorDisplay
          title="Error Loading Profile"
          message={error}
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }
  
  return (
    <div className="container max-w-lg px-4 mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4">Creator Dashboard</h1>
      
      <Tabs defaultValue="profile">
        <TabsList className="mb-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="tiers">Tiers</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
          <TabsTrigger value="embed">Embed</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          {creator && (
            <ProfileForm creator={creator} onUpdate={handleProfileUpdate} />
          )}
        </TabsContent>
        
        <TabsContent value="tiers">
          <div className="space-y-4">
            {showTierForm ? (
              <TierForm
                creatorId={creator?.id || ''}
                tier={editingTier || undefined}
                onSave={handleTierSave}
                onCancel={() => {
                  setShowTierForm(false);
                  setEditingTier(null);
                }}
              />
            ) : (
              <Button onClick={() => setShowTierForm(true)}>Add New Tier</Button>
            )}
            
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Your Tiers</h3>
              {tiers.length === 0 ? (
                <p className="text-gray-500">No tiers created yet. Create your first tier to offer special perks to your supporters.</p>
              ) : (
                <div className="space-y-2">
                  {tiers.map(tier => (
                    <div key={tier.id} className="border rounded-md p-3">
                      <TierCard
                        name={tier.name}
                        minAmount={tier.minAmount}
                        perk={tier.perkDescription || ''}
                      />
                      <div className="mt-2 flex justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditTier(tier)}
                        >
                          Edit
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="goals">
          <div className="space-y-4">
            {showGoalForm ? (
              <GoalForm
                creatorId={creator?.id || ''}
                goal={editingGoal || undefined}
                onSave={handleGoalSave}
                onCancel={() => {
                  setShowGoalForm(false);
                  setEditingGoal(null);
                }}
              />
            ) : (
              <Button onClick={() => setShowGoalForm(true)}>Add New Goal</Button>
            )}
            
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Your Goals</h3>
              {goals.length === 0 ? (
                <p className="text-gray-500">No goals created yet. Create a goal to motivate your supporters to help you reach a target.</p>
              ) : (
                <div className="space-y-4">
                  {goals.map(goal => (
                    <div key={goal.id} className="border rounded-md p-3">
                      <h4 className="font-medium">{goal.name}</h4>
                      {goal.description && <p className="text-sm text-gray-600 mt-1">{goal.description}</p>}
                      <div className="flex justify-between text-sm mt-2 mb-1">
                        <span>{((goal.currentAmount / goal.targetAmount) * 100).toFixed(0)}% Complete</span>
                        <span>{goal.currentAmount} / {goal.targetAmount} ETH</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-primary h-2.5 rounded-full"
                          style={{ width: `${Math.min((goal.currentAmount / goal.targetAmount) * 100, 100)}%` }}
                        ></div>
                      </div>
                      <div className="mt-2 flex justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditGoal(goal)}
                        >
                          Edit
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="embed">
          {creator && (
            <EmbedCode
              creatorId={creator.id}
              embedCode={embedCode}
              farcasterFrameCode={farcasterFrameCode}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
