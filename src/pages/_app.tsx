import '@/styles/globals.css'
import type { AppProps } from 'next/app'

import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import { QueryClient, QueryClientProvider, Hydrate } from "@tanstack/react-query";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';
import ErrorBoundary from '@/components/error-boundary/error-boundary';

import { AppStateContext } from '@/store/context';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

export default function App({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient());
  const [appState, setAppState] = useState({ myData: 0 });
  return (
    <ErrorBoundary>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <AppStateContext.Provider value={{ appState, setAppState }}>
          <QueryClientProvider client={queryClient}>
            <Hydrate state={pageProps.dehydratedState}>
              <Component {...pageProps} />
              <ReactQueryDevtools initialIsOpen={false} />
              </Hydrate>
          </QueryClientProvider>
        </AppStateContext.Provider>
      </ThemeProvider>
    </ErrorBoundary>
  )
}
