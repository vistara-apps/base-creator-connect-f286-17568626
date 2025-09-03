    import { cn } from '@/lib/utils';

    export const Avatar = ({ className, ...props }) => (
      <div className={cn('relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full', className)} {...props} />
    );

    export const AvatarImage = ({ src, alt, ...props }) => (
      <img src={src} alt={alt} className="aspect-square h-full w-full" {...props} />
    );

    export const AvatarFallback = ({ className, ...props }) => (
      <div className={cn('flex h-full w-full items-center justify-center rounded-full bg-muted', className)} {...props} />
    );
  