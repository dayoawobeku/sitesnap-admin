import React, {useEffect} from 'react';
import type {NextPage} from 'next';
import Head from 'next/head';
import {useRouter} from 'next/router';
import Link from 'next/link';
import {useSession} from 'next-auth/react';

const Home: NextPage = () => {
  const {data: session} = useSession();
  const {pathname} = useRouter();

  useEffect(() => {
    if (session === null) {
      window.location.href = '/auth/signin';
    }
  }, [session]);

  const categoriesTab = pathname === '/categories' ? 'tab-active' : '';
  const pagesTab = pathname === '/pages' ? 'tab-active' : '';
  const companiesTab = pathname === '/companies' ? 'tab-active' : '';

  return (
    <>
      <Head>
        <title>Admin</title>
      </Head>

      <header className="flex items-center justify-between py-8">
        <h1 className="text-grey text-xl font-medium">Admin</h1>

        <div className="flex items-center gap-4 font-medium">
          <Link href="/categories">
            <a className={`tab ${categoriesTab}`}>25 Categories</a>
          </Link>
          <Link href="/pages">
            <a className={`tab ${pagesTab}`}>254 Pages</a>
          </Link>
          <Link href="/companies">
            <a className={`tab ${companiesTab}`}>23 Companies</a>
          </Link>
        </div>
      </header>
    </>
  );
};

export default Home;
