import React, {useState} from 'react';
import type {AppProps} from 'next/app';
import {SessionProvider} from 'next-auth/react';
import {Session} from 'next-auth';
import {QueryClientProvider, QueryClient} from '@tanstack/react-query';
import {ReactQueryDevtools} from '@tanstack/react-query-devtools';
import '../styles/globals.css';
import {Layout} from '../components';

function MyApp({
  Component,
  pageProps,
  ...appProps
}: AppProps<{session: Session}>) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  const isLayoutNeeded = ['/auth/signin', '/404'].includes(
    appProps.router.pathname,
  );

  const LayoutComponent = !isLayoutNeeded ? Layout : React.Fragment;

  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider session={pageProps.session}>
        <LayoutComponent>
          <Component {...pageProps} />
        </LayoutComponent>
      </SessionProvider>
      <ReactQueryDevtools initialIsOpen />
    </QueryClientProvider>
  );
}

export default MyApp;
