import {useEffect} from 'react';
import type {NextPage} from 'next';
import Head from 'next/head';
import Image, {StaticImageData} from 'next/image';
import Link from 'next/link';
import {useSession} from 'next-auth/react';
import {useCompanies} from '../hooks';
import {Card, SubNav} from '../components';

interface Company {
  id: string;
  attributes: {
    name: string;
    slug: string;
    pages: {
      image_url: StaticImageData;
    }[];
    publishedAt: string;
  };
}

const Home: NextPage = () => {
  const {data: session} = useSession();
  const {data: companies, isLoading: loadingCompanies} = useCompanies();

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

      <SubNav
        customHeading={
          <div className="flex items-center gap-6">
            <h1 className="text-xl font-medium text-grey">All companies</h1>
            <Link href="/add-company">
              <a className="grey-btn flex h-14 items-center rounded-lg bg-white-200 px-5 font-medium text-body">
                Add a new company
              </a>
            </Link>
          </div>
        }
      />

      <section className="card mt-14">
        {loadingCompanies
          ? '...'
          : companies?.data?.map((company: Company) => (
              <Link
                href={`/companies/${company.attributes?.slug?.toLowerCase()}`}
                key={company.id}
              >
                <a>
                  <article className="flex flex-col gap-5 py-14">
                    <div className="flex items-center gap-3">
                      <h2 className="text-md font-medium text-grey">
                        {company.attributes.name}
                      </h2>
                      {company.attributes.publishedAt === null ? (
                        <span className="rounded-lg bg-blue p-1 text-[10px] text-white">
                          {company.attributes.publishedAt === null
                            ? 'Draft'
                            : ''}
                        </span>
                      ) : null}
                    </div>
                    <Card
                      image_data={company.attributes.pages[0].image_url}
                      src={company.attributes.pages[0].image_url}
                      alt=""
                    />
                  </article>
                </a>
              </Link>
            ))}
      </section>
    </>
  );
};

export default Home;
