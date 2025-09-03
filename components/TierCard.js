    import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
    import { Badge } from '@/components/ui/badge';

    export function TierCard({ name, minAmount, perk }) {
      return (
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">{name} <Badge>{minAmount} ETH</Badge></CardTitle>
          </CardHeader>
          <CardContent>
            <p className="body">{perk}</p>
          </CardContent>
        </Card>
      );
    }
  