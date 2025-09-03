    'use client';

    import { useState, useEffect } from 'react';
    import { usePrivy } from '@privy-io/react-auth';
    import { supabase } from '@/lib/supabase';
    import { Button } from '@/components/ui/button';
    import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
    import { Input } from '@/components/ui/input';
    import { Textarea } from '@/components/ui/textarea';
    import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
    import { Label } from '@/components/ui/label';

    export default function CreatorDashboard() {
      const { user } = usePrivy();
      const [profile, setProfile] = useState({ bio: '', profileImageUrl: '', socialLinks: '' });
      const [tiers, setTiers] = useState([]);
      const [goals, setGoals] = useState([]);
      const [loading, setLoading] = useState(false);

      useEffect(() => {
        if (!user?.id) return;
        // Fetch existing profile
        const fetchProfile = async () => {
          const { data } = await supabase.from('creators').select('*').eq('farcasterId', user.id).single();
          if (data) setProfile({ bio: data.bio, profileImageUrl: data.profileImageUrl, socialLinks: data.socialLinks });
          // Fetch tiers and goals
          const { data: tiersData } = await supabase.from('tiers').select('*').eq('creatorId', data?.id);
          setTiers(tiersData || []);
          const { data: goalsData } = await supabase.from('tip_goals').select('*').eq('creatorId', data?.id);
          setGoals(goalsData || []);
        };
        fetchProfile();
      }, [user]);

      const saveProfile = async () => {
        if (!user?.wallet?.address) return;
        setLoading(true);
        await supabase.from('creators').upsert({
          farcasterId: user.id,
          bio: profile.bio,
          profileImageUrl: profile.profileImageUrl,
          walletAddress: user.wallet.address,
          socialLinks: profile.socialLinks,
        });
        setLoading(false);
      };

      const addTier = () => {
        setTiers([...tiers, { name: '', minAmount: 0, perkDescription: '' }]);
      };

      const saveTiers = async () => {
        // Assume creatorId is set in profile
        const creatorId = user?.id; // Or fetch from profile
        for (const tier of tiers) {
          await supabase.from('tiers').upsert({ ...tier, creatorId });
        }
      };

      const addGoal = () => {
        setGoals([...goals, { name: '', targetAmount: 0, description: '', imageUrl: '', currentAmount: 0 }]);
      };

      const saveGoals = async () => {
        const creatorId = user?.id;
        for (const goal of goals) {
          await supabase.from('tip_goals').upsert({ ...goal, creatorId });
        }
      };

      return (
        <div className="container max-w-lg px-4 mx-auto py-8">
          <h1 className="display mb-4">Creator Dashboard</h1>
          <Tabs defaultValue="profile">
            <TabsList>
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="tiers">Tiers</TabsTrigger>
              <TabsTrigger value="goals">Goals</TabsTrigger>
            </TabsList>
            <TabsContent value="profile">
              <Card className="p-4 shadow-card">
                <Label htmlFor="bio">Bio</Label>
                <Textarea id="bio" value={profile.bio} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} />
                <Label htmlFor="profileImageUrl">Profile Image URL</Label>
                <Input id="profileImageUrl" value={profile.profileImageUrl} onChange={(e) => setProfile({ ...profile, profileImageUrl: e.target.value })} />
                <Label htmlFor="socialLinks">Social Links</Label>
                <Textarea id="socialLinks" value={profile.socialLinks} onChange={(e) => setProfile({ ...profile, socialLinks: e.target.value })} />
                <Button onClick={saveProfile} disabled={loading}>{loading ? 'Saving...' : 'Save Profile'}</Button>
              </Card>
            </TabsContent>
            <TabsContent value="tiers">
              <Button onClick={addTier}>Add Tier</Button>
              {tiers.map((tier, index) => (
                <Card key={index} className="mb-4">
                  <CardContent>
                    <Input value={tier.name} onChange={(e) => setTiers(tiers.map((t, i) => i === index ? { ...t, name: e.target.value } : t))} placeholder="Tier Name" />
                    <Input type="number" value={tier.minAmount} onChange={(e) => setTiers(tiers.map((t, i) => i === index ? { ...t, minAmount: parseFloat(e.target.value) } : t))} placeholder="Min Amount ETH" />
                    <Textarea value={tier.perkDescription} onChange={(e) => setTiers(tiers.map((t, i) => i === index ? { ...t, perkDescription: e.target.value } : t))} placeholder="Perk Description" />
                  </CardContent>
                </Card>
              ))}
              <Button onClick={saveTiers}>Save Tiers</Button>
            </TabsContent>
            <TabsContent value="goals">
              <Button onClick={addGoal}>Add Goal</Button>
              {goals.map((goal, index) => (
                <Card key={index} className="mb-4">
                  <CardContent>
                    <Input value={goal.name} onChange={(e) => setGoals(goals.map((g, i) => i === index ? { ...g, name: e.target.value } : g))} placeholder="Goal Name" />
                    <Input type="number" value={goal.targetAmount} onChange={(e) => setGoals(goals.map((g, i) => i === index ? { ...g, targetAmount: parseFloat(e.target.value) } : g))} placeholder="Target Amount ETH" />
                    <Textarea value={goal.description} onChange={(e) => setGoals(goals.map((g, i) => i === index ? { ...g, description: e.target.value } : g))} placeholder="Description" />
                    <Input value={goal.imageUrl} onChange={(e) => setGoals(goals.map((g, i) => i === index ? { ...g, imageUrl: e.target.value } : g))} placeholder="Image URL" />
                  </CardContent>
                </Card>
              ))}
              <Button onClick={saveGoals}>Save Goals</Button>
            </TabsContent>
          </Tabs>
        </div>
      );
    }
  