    'use client';

    import { useState } from 'react';
    import { usePrivy } from '@privy-io/react-auth';
    import { useWalletClient } from 'wagmi';
    import { supabase } from '@/lib/supabase';
    import { Input } from '@/components/ui/input';
    import { Textarea } from '@/components/ui/textarea';
    import { Button } from '@/components/ui/button';
    import { Card } from '@/components/ui/card';
    import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

    // ... (Implement creator setup: profile, tiers, goals)

    export default function CreatorDashboard() {
      const { user } = usePrivy();
      const { data: walletClient } = useWalletClient();
      const [profile, setProfile] = useState({ bio: '', profileImageUrl: '', socialLinks: '' });
      const [tiers, setTiers] = useState([]);
      const [goals, setGoals] = useState([]);

      // Function to save profile to Supabase
      const saveProfile = async () => {
        if (!user?.wallet?.address) return;
        const { data, error } = await supabase.from('creators').upsert({
          farcasterId: user.id,
          bio: profile.bio,
          profileImageUrl: profile.profileImageUrl,
          walletAddress: user.wallet.address,
          socialLinks: profile.socialLinks,
        });
        if (error) console.error(error);
      };

      // Similar functions for tiers and goals

      return (
        <div className="container max-w-lg px-4 mx-auto py-8">
          <h1 className="text-3xl font-bold mb-4">Creator Dashboard</h1>
          <Tabs defaultValue="profile">
            <TabsList>
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="tiers">Tiers</TabsTrigger>
              <TabsTrigger value="goals">Goals</TabsTrigger>
            </TabsList>
            <TabsContent value="profile">
              <Card className="p-4">
                <Input placeholder="Bio" value={profile.bio} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} />
                <Input placeholder="Profile Image URL" value={profile.profileImageUrl} onChange={(e) => setProfile({ ...profile, profileImageUrl: e.target.value })} />
                <Textarea placeholder="Social Links" value={profile.socialLinks} onChange={(e) => setProfile({ ...profile, socialLinks: e.target.value })} />
                <Button onClick={saveProfile}>Save Profile</Button>
              </Card>
            </TabsContent>
            {/* Similar for tiers and goals */}
          </Tabs>
          {/* Generate embeddable widget URL */}
        </div>
      );
    }
  