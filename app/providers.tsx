'use client';

import { HeroUIProvider, ToastProvider } from '@heroui/react';
import { ThemeProvider } from 'next-themes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        refetchOnWindowFocus: false,
        retry: 1,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
        <HeroUIProvider>
          <ToastProvider placement="top-center" />
          {children}
        </HeroUIProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
