    import { forwardRef, useState } from 'react';
    import { cn } from '@/lib/utils';

    export const Dialog = ({ open, onOpenChange, children }) => (
      <div className={cn('fixed inset-0 z-50 flex items-center justify-center', !open && 'hidden')}>
        <div className="fixed inset-0 bg-black/80" onClick={() => onOpenChange(false)} />
        {children}
      </div>
    );

    export const DialogContent = forwardRef(({ className, children, ...props }, ref) => (
      <div ref={ref} className={cn('relative z-50 grid w-full max-w-lg gap-4 border bg-background p-6 shadow-lg duration-200 sm:rounded-lg', className)} {...props}>
        {children}
      </div>
    ));

    export const DialogHeader = ({ className, ...props }) => <div className={cn('flex flex-col space-y-1.5 text-center sm:text-left', className)} {...props} />;

    export const DialogTitle = ({ className, ...props }) => <h3 className={cn('text-lg font-semibold leading-none tracking-tight', className)} {...props} />;

    export const DialogDescription = ({ className, ...props }) => <p className={cn('text-sm text-muted-foreground', className)} {...props} />;
  