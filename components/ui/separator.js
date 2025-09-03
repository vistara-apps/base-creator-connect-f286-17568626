    import { cn } from '@/lib/utils';

    export const Separator = ({ className, orientation = 'horizontal', ...props }) => (
      <div
        className={cn(
          'shrink-0 bg-border',
          orientation === 'horizontal' ? 'h-[1px] w-full' : 'h-full w-[1px]',
          className
        )}
        {...props}
      />
    );
  