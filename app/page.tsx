    'use client';

    import { usePrivy } from '@privy-io/react-auth';
    import Link from 'next/link';
    import { Button } from '@/components/ui/button';

    export default function Home() {
      const { ready, authenticated, login } = usePrivy();

      if (!ready) return <div>Loading...</div>;

      return (
        <div className="container max-w-lg px-4 mx-auto py-8">
          <h1 className="text-3xl font-bold mb-4">Base Creator Connect</h1>
          <p className="text-base mb-6">Tip, connect, and grow with your fans on Base.</p>
          {authenticated ? (
            <div className="space-y-4">
              <Link href="/creator">
                <Button variant="default">Go to Creator Dashboard</Button>
              </Link>
              <Link href="/fan">
                <Button variant="outline">Go to Fan Tipping</Button>
              </Link>
            </div>
          ) : (
            <Button onClick={login}>Connect Wallet</Button>
          )}
        </div>
      );
    }
  