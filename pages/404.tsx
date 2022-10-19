import type {NextPage} from 'next';
import Head from 'next/head';

const NotFound: NextPage = () => {
  return (
    <>
      <Head>
        <title>404 Not found</title>
      </Head>

      <div className="flex items-center justify-between py-8">
        <h1 className="text-grey text-xl font-medium">404 Not found</h1>
      </div>
    </>
  );
};

export default NotFound;
