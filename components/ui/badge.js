    import { cn } from '@/lib/utils';

    export const Badge = ({ variant = 'default', className, ...props }) => (
      <div
        className={cn(
          'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
          variant === 'secondary' ? 'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80' : 'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
          className
        )}
        {...props}
      />
    );
  