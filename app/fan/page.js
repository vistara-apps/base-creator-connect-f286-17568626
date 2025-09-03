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
    import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
    import { Badge } from '@/components/ui/badge';

    // creatorId from router or prop; for demo, hardcode
    const creatorId = 'example-creator-id'; // Replace with dynamic

    export default function FanTipping() {
      const { user } = usePrivy();
      const { sendTransaction } = useSendTransaction();
      const [tipAmount, setTipAmount] = useState('0.01');
      const [message, setMessage] = useState('');
      const [creator, setCreator] = useState(null);
      const [goals, setGoals] = useState([]);
      const [tiers, setTiers] = useState([]);
      const [loading, setLoading] = useState(false);

      useEffect(() => {
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
        setLoading(true);
        sendTransaction({
          to: creator.walletAddress,
          value: parseEther(tipAmount),
        }, {
          onSuccess: async (hash) => {
            await supabase.from('tips').insert({
              creatorId,
              fanWalletAddress: user.wallet.address,
              amount: tipAmount,
              currency: 'ETH',
              message,
              transactionHash: hash,
              timestamp: new Date().toISOString(),
            });
            // Update goal progress
            const selectedGoal = goals.find(g => parseFloat(tipAmount) > 0); // Simple check
            if (selectedGoal) {
              await supabase.from('tip_goals').update({ currentAmount: selectedGoal.currentAmount + parseFloat(tipAmount) }).eq('id', selectedGoal.id);
            }
            setLoading(false);
            // Optionally generate thank-you note via API
          },
          onError: () => setLoading(false),
        });
      };

      return (
        <div className="container max-w-lg px-4 mx-auto py-8">
          <h1 className="display mb-4">Tip {creator?.username || 'Creator'}</h1>
          <Card className="p-4 shadow-card">
            <Input type="number" value={tipAmount} onChange={(e) => setTipAmount(e.target.value)} placeholder="Tip Amount (ETH)" />
            <Textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Personalized message" />
            <Button onClick={handleTip} disabled={loading}>{loading ? 'Tipping...' : 'Send Tip'}</Button>
          </Card>
          <h2 className="heading mb-4">Goals</h2>
          {goals.map((goal) => (
            <Card key={goal.id} className="mb-4 p-4 shadow-card">
              <CardHeader>
                <CardTitle>{goal.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{goal.description}</p>
                <Progress value={(goal.currentAmount / goal.targetAmount) * 100} />
                <p>{goal.currentAmount} / {goal.targetAmount} ETH</p>
                <Button size="sm" variant="outline" onClick={() => setTipAmount(goal.targetAmount.toString())}>Contribute to Goal</Button>
              </CardContent>
            </Card>
          ))}
          <h2 className="heading mb-4">Tiers</h2>
          {tiers.map((tier) => (
            <Card key={tier.id} className="mb-4 p-4 shadow-card">
              <CardTitle>{tier.name} <Badge>Min {tier.minAmount} ETH</Badge></CardTitle>
              <p>{tier.perkDescription}</p>
              <Button size="sm" variant="outline" onClick={() => setTipAmount(tier.minAmount.toString())}>Select Tier</Button>
            </Card>
          ))}
        </div>
      );
    }
  