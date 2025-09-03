/**
 * LoadingState component for Base Creator Connect
 * 
 * This component displays loading states with customizable messages.
 */

import { Card, CardContent } from '@/components/ui/card';

interface LoadingStateProps {
  message?: string;
  size?: 'small' | 'medium' | 'large';
  fullPage?: boolean;
}

export function LoadingState({
  message = 'Loading...',
  size = 'medium',
  fullPage = false,
}: LoadingStateProps) {
  const spinnerSizes = {
    small: 'h-4 w-4',
    medium: 'h-8 w-8',
    large: 'h-12 w-12',
  };
  
  const content = (
    <div className="flex flex-col items-center justify-center">
      <div className={`animate-spin rounded-full border-b-2 border-primary ${spinnerSizes[size]} mb-2`}></div>
      {message && <p className="text-gray-600">{message}</p>}
    </div>
  );
  
  if (fullPage) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 z-50">
        {content}
      </div>
    );
  }
  
  return <Card className="p-6 flex justify-center">{content}</Card>;
}

