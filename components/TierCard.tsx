    import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

    export function TierCard({ name, minAmount, perk }: { name: string, minAmount: number, perk: string }) {
      return (
        <Card>
          <CardHeader>
            <CardTitle>{name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Min: {minAmount} ETH</p>
            <p>{perk}</p>
          </CardContent>
        </Card>
      );
    }
  