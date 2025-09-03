    import { cn } from '@/lib/utils';

    export function AppFrame({ variant = 'default', children }: { variant?: 'default' | 'withHeader', children: React.ReactNode }) {
      return (
        <div className={cn('border rounded-xl p-4', variant === 'withHeader' && 'pt-0')}>
          {variant === 'withHeader' && <header className="border-b pb-2 mb-4">Header</header>}
          {children}
        </div>
      );
    }
  