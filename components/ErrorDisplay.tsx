/**
 * ErrorDisplay component for Base Creator Connect
 * 
 * This component displays error messages with optional retry functionality.
 */

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface ErrorDisplayProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export function ErrorDisplay({ title = 'Error', message, onRetry }: ErrorDisplayProps) {
  return (
    <Card className="border-red-200 bg-red-50">
      <CardHeader className="pb-2">
        <CardTitle className="text-red-600">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-red-700">{message}</p>
      </CardContent>
      {onRetry && (
        <CardFooter>
          <Button variant="outline" onClick={onRetry}>
            Try Again
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}

