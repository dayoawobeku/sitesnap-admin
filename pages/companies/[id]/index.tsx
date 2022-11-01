import type {NextPage} from 'next';
import Head from 'next/head';
import {useRouter} from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import SubNav from '../../../components/SubNav';
import {filler} from '../../../assets/images/images';
import {useCompany} from '../../../hooks';

interface Page {
  page_name: string;
  page_url: string;
  image_url: string;
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
          <div className="flex items-center gap-6">
            <h1 className="text-xl font-medium text-grey">
              {loadingCompany ? '-' : company.data[0]?.attributes.name}
            </h1>
            <div className="rounded-full bg-blue px-4 py-2 font-medium text-white">
              {loadingCompany ? '-' : company.data[0]?.attributes.industry}
            </div>
            <Link href={`/companies/${router.query.id}/edit-company`}>
              <a className="flex h-14 items-center rounded-lg bg-white-200 px-5 font-medium text-body">
                Edit
              </a>
            </Link>
          </div>
        }
      />

      <section className="mt-14 grid grid-cols-2 gap-x-12">
        {loadingCompany
          ? '...'
          : pagesArray?.map((page: Page) => (
              <article
                key={page.image_url}
                className="flex flex-col gap-5 py-14"
              >
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
    </>
  );
};

export default Company;
