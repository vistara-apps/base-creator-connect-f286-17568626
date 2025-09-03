    import { createContext, useContext, useState } from 'react';
    import { cn } from '@/lib/utils';

    const TabContext = createContext();

    export const Tabs = ({ value, defaultValue, onValueChange, children }) => {
      const [active, setActive] = useState(defaultValue);
      const currentValue = value || active;
      const change = onValueChange || setActive;
      return (
        <TabContext.Provider value={{ value: currentValue, onChange: change }}>
          <div>{children}</div>
        </TabContext.Provider>
      );
    };

    export const TabsContent = ({ value, children }) => {
      const { value: active } = useContext(TabContext);
      if (active !== value) return null;
      return <div>{children}</div>;
    };

    export const TabsList = ({ className, children }) => (
      <div className={cn('inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground', className)}>
        {children}
      </div>
    );

    export const TabsTrigger = ({ value, className, children, ...props }) => {
      const { value: active, onChange } = useContext(TabContext);
      return (
        <button
          className={cn(
            'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
            active === value && 'bg-background text-foreground shadow-sm',
            className
          )}
          onClick={() => onChange(value)}
          {...props}
        >
          {children}
        </button>
      );
    };
  