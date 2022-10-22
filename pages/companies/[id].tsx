import type {NextPage} from 'next';
import Head from 'next/head';
import {useRouter} from 'next/router';
import Image from 'next/image';
import {useQuery} from '@tanstack/react-query';
import axios from 'axios';
import SubNav from '../../components/SubNav';
import ImageTest from '../../components/ImageTest';
import {filler} from '../../assets/images/images';

interface Slug {
  slug: string | string[] | undefined;
}

interface Page {
  page_name: string;
  page_url: string;
  id: number;
}

const Company: NextPage = () => {
  const router = useRouter();
  const {data: company, isLoading: loadingCompany} = useCompany(
    router.query.id,
  );

  const pagesArray = company?.data[0]?.attributes?.pages;

  return (
    <>
      <Head>
        <title>Company</title>
      </Head>

      <SubNav
        customHeading={
          <div className="flex items-center gap-4">
            <h1 className="text-grey text-xl font-medium">
              {loadingCompany ? '-' : company.data[0]?.attributes.name}
            </h1>
            <button className="h-14 bg-white-200 px-5 rounded-lg text-body font-medium">
              Add a new page
            </button>
          </div>
        }
      />

      <section className="mt-14 grid grid-cols-2 gap-x-12">
        {loadingCompany
          ? '...'
          : pagesArray?.map((page: Page) => (
              <article key={page.id} className="flex flex-col gap-5 py-14">
                <h2 className="text-md font-medium text-grey">
                  {page?.page_name}
                </h2>
                <div className="relative">
                  <Image
                    alt="wise"
                    src={filler}
                    width={620}
                    height={411}
                    layout="responsive"
                    placeholder="blur"
                    blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8Xg8AAnMBeJQW2OIAAAAASUVORK5CYII="
                    className="rounded-2xl"
                  />
                </div>
              </article>
            ))}
      </section>

      {/* <ImageTest /> */}
    </>
  );
};

export default Company;

function useCompany(slug: Slug['slug']) {
  return useQuery([`company-${slug}`], () =>
    axios
      .get(
        `${process.env.NEXT_PUBLIC_STRAPI_URL}/companies?filters[slug][$eq]=${slug}`,
      )
      .then(res => res.data),
  );
}
