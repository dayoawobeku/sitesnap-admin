import type {NextPage} from 'next';
import Head from 'next/head';
import SubNav from '../components/SubNav';
import {usePages} from '../hooks';

interface Pages {
  page_name: string;
  attributes: {
    pages: string[];
  };
  0: string;
  1: number;
}

const Pages: NextPage = () => {
  const {data: pages} = usePages();

  const pagesArray = pages?.data?.map((page: Pages) => page.attributes.pages);

  const flattenedPages = pagesArray?.flat();

  const pagesCount = flattenedPages?.map((page: Pages) => page.page_name);

  const allPages = pagesCount?.reduce(
    (acc: {[x: string]: number}, page: string | number) => {
      acc[page] = ++acc[page] || 1;
      return acc;
    },
    {},
  );

  const sortedPages = allPages && Object.entries(allPages).sort();

  return (
    <>
      <Head>
        <title>Pages</title>
      </Head>

      <SubNav text="Pages" />

      <section className="mt-8 flex">
        {sortedPages?.map((page: Pages) => (
          <p key={Math.random()} className="px-10 py-4 text-md font-medium">
            {page?.[0]} ({page?.[1]})
          </p>
        ))}
      </section>
    </>
  );
};

export default Pages;
