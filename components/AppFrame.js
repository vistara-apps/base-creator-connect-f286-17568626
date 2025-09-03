    import { cn } from '@/lib/utils';

    export function AppFrame({ variant = 'default', children }) {
      return (
        <div className={cn('border rounded-xl p-4 bg-surface', variant === 'withHeader' && 'pt-0')}>
          {variant === 'withHeader' && <header className="border-b pb-2 mb-4 font-semibold">Base Creator Connect</header>}
          {children}
        </div>
      );
    }
  