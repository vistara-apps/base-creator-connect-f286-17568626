    'use client';

    import { OnchainKitProvider } from '@coinbase/onchainkit';
    import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
    import { WagmiProvider } from 'wagmi';
    import { base } from 'viem/chains';
    import { createConfig, http } from 'viem';
    import { type ReactNode, useState } from 'react';
    import { PrivyProvider } from '@privy-io/react-auth';

    const config = createConfig({
      chains: [base],
      transports: {
        [base.id]: http(),
      },
    });

    export function Providers(props: { children: ReactNode }) {
      const [queryClient] = useState(() => new QueryClient());

      return (
        <PrivyProvider
          appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
          config={{
            loginMethods: ['wallet'],
            appearance: {
              theme: 'dark',
            },
            defaultChain: base,
          }}
        >
          <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
              <OnchainKitProvider
                apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
                chain={base}
                config={{
                  appearance: {
                    mode: 'dark',
                    theme: 'default',
                    name: 'Base Creator Connect',
                  },
                }}
              >
                {props.children}
              </OnchainKitProvider>
            </QueryClientProvider>
          </WagmiProvider>
        </PrivyProvider>
      );
    }
  