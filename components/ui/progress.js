    import { cn } from '@/lib/utils';

    export const Progress = ({ value, className }) => (
      <div className={cn('relative h-4 w-full overflow-hidden rounded-full bg-secondary', className)}>
        <div className="h-full w-full flex-1 bg-primary transition-all" style={{ transform: `translateX(-${100 - (value || 0)}%)` }} />
      </div>
    );
  