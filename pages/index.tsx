import {useEffect} from 'react';
import type {GetServerSideProps, NextPage} from 'next';
import Head from 'next/head';
import Link from 'next/link';
import {signOut, useSession, getSession} from 'next-auth/react';

const Home: NextPage = () => {
  const {data: session} = useSession();

  useEffect(() => {
    if (session == null) return;
  }, [session]);

  return (
    <div>
      <Head>
        <title>Strapi - Next - NextAuth</title>
      </Head>

      <h1>{session ? 'Authenticated' : 'Not Authenticated'}</h1>
      {session && (
        <div style={{marginBottom: 10}}>
          <h3>Session Data</h3>
          <div>Email: {session?.user?.email}</div>
          <div>JWT from Strapi: Check console</div>
        </div>
      )}
      {session ? (
        <button onClick={() => signOut({callbackUrl: '/auth'})}>
          Sign out
        </button>
      ) : (
        <Link href="/auth">
          <button>Sign In</button>
        </Link>
      )}
    </div>
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps = async context => {
  const session = await getSession(context);
  if (session == null) {
    return {
      redirect: {
        destination: '/auth',
        permanent: true,
      },
    };
  }
  return {
    props: {},
  };
};
