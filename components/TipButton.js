    'use client';

    import { Button } from '@/components/ui/button';
    import { cn } from '@/lib/utils';

    export function TipButton({ variant = 'default', onClick, children }) {
      return (
        <Button
          variant={variant === 'iconOnly' ? 'ghost' : 'default'}
          onClick={onClick}
          className={cn('rounded-lg transition-all duration-200', variant === 'iconOnly' && 'p-2')}
        >
          {children}
        </Button>
      );
    }
  