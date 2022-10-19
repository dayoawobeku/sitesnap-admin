import {useEffect} from 'react';
import type {NextPage} from 'next';
import Head from 'next/head';
import {useSession} from 'next-auth/react';
import SubNav from '../components/SubNav';

const Home: NextPage = () => {
  const {data: session} = useSession();

  useEffect(() => {
    if (session === null) {
      window.location.href = '/auth/signin';
    }
  }, [session]);

  return (
    <>
      <Head>
        <title>Admin</title>
      </Head>

      <SubNav text="Admin" />
    </>
  );
};

export default Home;
