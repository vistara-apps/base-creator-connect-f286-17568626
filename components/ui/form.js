    // Simplified form components
    export const Form = ({ children, ...props }) => <form {...props}>{children}</form>;

    export const FormField = ({ children, ...props }) => <div {...props}>{children}</div>;

    export const FormItem = ({ className, ...props }) => <div className={cn('space-y-2', className)} {...props} />;

    export const FormLabel = ({ className, ...props }) => <label className={cn('text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70', className)} {...props} />;

    export const FormControl = ({ children }) => children;
  