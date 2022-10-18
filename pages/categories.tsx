import React from 'react';
import type {NextPage} from 'next';
import Head from 'next/head';

const Categories: NextPage = () => {
  return (
    <>
      <Head>
        <title>Admin</title>
      </Head>

      <header className="flex items-center justify-between py-8">
        <h1 className="text-grey text-xl font-medium">Admin</h1>
      </header>
    </>
  );
};

export default Categories;
