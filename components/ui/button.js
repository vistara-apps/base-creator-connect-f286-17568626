    import { forwardRef } from 'react';
    import { cn } from '@/lib/utils';

    const buttonVariants = (variant = 'default') => {
      switch (variant) {
        case 'outline':
          return 'border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground';
        case 'ghost':
          return 'hover:bg-accent hover:text-accent-foreground';
        default:
          return 'bg-primary text-primary-foreground shadow hover:bg-primary/90';
      }
    };

    export const Button = forwardRef(({ variant, size = 'default', className, ...props }, ref) => {
      return (
        <button
          className={cn(
            'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
            variant === 'sm' ? 'h-9 px-3' : variant === 'lg' ? 'h-11 px-8' : 'h-10 px-4 ',
            buttonVariants(variant),
            className
          )}
          ref={ref}
          {...props}
        />
      );
    });
    Button.displayName = 'Button';
  