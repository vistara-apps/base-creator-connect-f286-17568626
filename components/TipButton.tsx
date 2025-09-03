    'use client';

    import { Button } from '@/components/ui/button';
    import { cn } from '@/lib/utils';

    export function TipButton({ variant = 'default', onClick, children }: { variant?: 'default' | 'iconOnly', onClick: () => void, children: React.ReactNode }) {
      return (
        <Button
          variant={variant === 'iconOnly' ? 'ghost' : 'default'}
          onClick={onClick}
          className={cn('rounded-lg', variant === 'iconOnly' && 'p-2')}
        >
          {children}
        </Button>
      );
    }
  