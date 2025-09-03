    'use client';

    import { useState, useEffect } from 'react';
    import { usePrivy } from '@privy-io/react-auth';
    import { useSendTransaction } from 'wagmi';
    import { parseEther } from 'viem';
    import { supabase } from '@/lib/supabase';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Textarea } from '@/components/ui/textarea';
    import { Progress } from '@/components/ui/progress';
    import { Card } from '@/components/ui/card';

    // Assume creatorId from query or prop
    const creatorId = 'example-creator'; // Replace with dynamic

    export default function FanTipping() {
      const { user } = usePrivy();
      const { sendTransaction } = useSendTransaction();
      const [tipAmount, setTipAmount] = useState('0.01');
      const [message, setMessage] = useState('');
      const [creator, setCreator] = useState(null);
      const [goals, setGoals] = useState([]);
      const [tiers, setTiers] = useState([]);

      useEffect(() => {
        // Fetch creator, goals, tiers from Supabase
        const fetchData = async () => {
          const { data: creatorData } = await supabase.from('creators').select('*').eq('id', creatorId).single();
          setCreator(creatorData);
          const { data: goalsData } = await supabase.from('tip_goals').select('*').eq('creatorId', creatorId);
          setGoals(goalsData);
          const { data: tiersData } = await supabase.from('tiers').select('*').eq('creatorId', creatorId);
          setTiers(tiersData);
        };
        fetchData();
      }, []);

      const handleTip = async () => {
        if (!creator?.walletAddress || !user?.wallet?.address) return;
        sendTransaction({
          to: creator.walletAddress,
          value: parseEther(tipAmount),
        }, {
          onSuccess: async (hash) => {
            // Save tip to Supabase
            await supabase.from('tips').insert({
              creatorId,
              fanWalletAddress: user.wallet.address,
              amount: tipAmount,
              currency: 'ETH',
              message,
              transactionHash: hash,
            });
            // Update goal progress if applicable
            // Call AI for thank-you note
          },
        });
      };

      return (
        <div className="container max-w-lg px-4 mx-auto py-8">
          <h1 className="text-3xl font-bold mb-4">Tip {creator?.username}</h1>
          <Input type="number" value={tipAmount} onChange={(e) => setTipAmount(e.target.value)} placeholder="Tip Amount (ETH)" />
          <Textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Message" />
          <Button onClick={handleTip}>Send Tip</Button>
          {/* Display goals with Progress */}
          {goals.map(goal => (
            <Card key={goal.id}>
              <h2>{goal.name}</h2>
              <Progress value={(goal.currentAmount / goal.targetAmount) * 100} />
            </Card>
          ))}
          {/* Display tiers */}
          {tiers.map(tier => (
            <Card key={tier.id}>
              <h3>{tier.name}</h3>
              <p>Min: {tier.minAmount} ETH</p>
              <p>{tier.perkDescription}</p>
            </Card>
          ))}
        </div>
      );
    }
  