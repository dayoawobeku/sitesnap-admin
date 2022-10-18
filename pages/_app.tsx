import '../styles/globals.css';
import type {AppProps} from 'next/app';
import {SessionProvider} from 'next-auth/react';
import {Session} from 'next-auth';
import Layout from '../components/Layout';
import React from 'react';

function MyApp({
  Component,
  pageProps,
  ...appProps
}: AppProps<{session: Session}>) {
  const isLayoutNeeded = ['/auth/signin'].includes(appProps.router.pathname);

  const LayoutComponent = !isLayoutNeeded ? Layout : React.Fragment;

  return (
    <SessionProvider session={pageProps.session}>
      <LayoutComponent>
        <Component {...pageProps} />
      </LayoutComponent>
    </SessionProvider>
  );
}

export default MyApp;
