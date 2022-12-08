import type {NextPage} from 'next';
import Head from 'next/head';
import {SubNav} from '../components';
import {useCategories} from '../hooks';

interface Category {
  attributes: {
    industry: string;
  };
}

const Categories: NextPage = () => {
  const {data: categories} = useCategories();
  const industries = categories?.data?.map(
    (category: Category) => category?.attributes?.industry,
  );
  const industryCount = industries?.reduce(
    (acc: {[x: string]: number}, cat: string | number) => {
      acc[cat] = ++acc[cat] || 1;
      return acc;
    },
    {},
  );

  const sortedIndustries =
    industryCount && Object.entries(industryCount).sort();

  return (
    <>
      <Head>
        <title>Categories</title>
      </Head>

      <SubNav text="Categories" />

      <section className="mt-8 flex">
        {sortedIndustries?.map(
          (industry: (string | number | null | undefined)[]) => (
            <p key={Math.random()} className="px-10 py-4 text-md font-medium">
              {industry?.[0]} ({industry?.[1]})
            </p>
          ),
        )}
      </section>
    </>
  );
};

export default Categories;
