import type {NextPage} from 'next';
import Head from 'next/head';
import {useQuery} from '@tanstack/react-query';
import axios from 'axios';
import SubNav from '../components/SubNav';

interface Category {
  attributes: {
    industry: string;
  };
}

const Categories: NextPage = () => {
  const {data: categories} = useCategories();

  // count the number of times each industry appears
  const industries = categories?.data?.map(
    (category: Category) => category?.attributes?.industry,
  );

  const industryCount = industries?.reduce(
    (acc: {[x: string]: number}, curr: string | number) => {
      if (typeof acc[curr] == 'undefined') {
        acc[curr] = 1;
      } else {
        acc[curr] += 1;
      }

      return acc;
    },
    {},
  );

  // sort the industries by the number of times they appear
  const sortedIndustries =
    industryCount && Object.entries(industryCount).sort();

  return (
    <>
      <Head>
        <title>Categories</title>
      </Head>

      <SubNav
        customHeading={
          <div className="flex items-center gap-4">
            <h1 className="text-grey text-xl font-medium">Categories</h1>
            <button className="h-14 bg-white-200 px-5 rounded-lg text-body font-medium">
              Add a new category
            </button>
          </div>
        }
      />

      <section className="mt-8 flex">
        {sortedIndustries?.map(
          (industry: (string | number | null | undefined)[]) => {
            return (
              <p key={Math.random()} className="px-10 py-4 text-md font-medium">
                {industry?.[0]} ({industry?.[1]})
              </p>
            );
          },
        )}
      </section>
    </>
  );
};

export default Categories;

function useCategories() {
  return useQuery(['categories'], () =>
    axios
      .get(`${process.env.NEXT_PUBLIC_STRAPI_URL}/companies?fields=industry`)
      .then(res => res.data),
  );
}
