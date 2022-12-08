import {useState} from 'react';
import type {NextPage} from 'next';
import Head from 'next/head';
import {useRouter} from 'next/router';
import Link from 'next/link';
import {StaticImageData} from 'next/image';
import {useQueryClient} from '@tanstack/react-query';
import {v4 as uuidv4} from 'uuid';
import {useCompany, useEditCompany} from '../../../hooks';
import {Card, SubNav} from '../../../components';

interface ErrorMessage {
  message: string;
  path: string;
}

interface Page {
  page_name: string;
  page_url: string;
  image_url: StaticImageData;
  page_id?: string;
}

const Company: NextPage = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const {data: company, isLoading: loadingCompany} = useCompany(
    router.query.id,
  );
  const [message, setMessage] = useState('');

  const pagesArray = company?.data[0]?.attributes?.pages;

  const {mutate: editCompany, isLoading: creatingCompany} = useEditCompany(
    company?.data[0]?.id,
  );

  const handleSubmit = (e: React.MouseEvent) => {
    e.preventDefault();

    const data = {
      name: company?.data[0]?.attributes?.name,
      url: company?.data[0]?.attributes?.url,
      description: company?.data[0]?.attributes?.description,
      industry: company?.data[0]?.attributes?.industry,
      pages: [
        ...pagesArray.map((page: Page) => ({
          ...page,
          page_id: page.page_id ?? uuidv4(),
        })),
      ],
      slug: company?.data[0]?.attributes?.slug,
      publishedAt: new Date().toISOString(),
    };

    editCompany(
      {data: data},
      {
        onSuccess: () => {
          setMessage('Company published successfully');
          setTimeout(() => {
            queryClient.invalidateQueries([`company-${router.query.id}`]);
            setMessage('');
          }, 2000);
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onError: (error: any) => {
          setMessage(
            error?.response?.data.error.details.errors
              .map((e: ErrorMessage) => `${e.message}  [${e.path}]`)
              .join(' & '),
          );
        },
      },
    );
  };

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
              <a className="flex h-14 items-center rounded-lg bg-white-200 px-5 font-medium text-body outline outline-1 outline-white-200 hover:outline-blue">
                Edit
              </a>
            </Link>
            {company?.data[0]?.attributes?.publishedAt === null ? (
              <button
                disabled={creatingCompany}
                onClick={handleSubmit}
                className="h-14 rounded-lg bg-blue px-5 font-medium text-white"
              >
                Publish
              </button>
            ) : null}

            <a
              className="font-medium text-blue"
              target="_blank"
              rel="noreferrer"
              href={`${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/preview?secret=${process.env.NEXT_PUBLIC_PREVIEW_TOKEN}&slug=/companies/${company?.data[0]?.attributes?.slug}`}
            >
              Preview
            </a>
            {message}
          </div>
        }
      />

      <section className="card mt-14">
        {loadingCompany
          ? '...'
          : pagesArray?.map((page: Page, index: number) => (
              <article key={index} className="flex flex-col gap-5 py-14">
                <h2 className="text-md font-medium text-grey">
                  {page?.page_name}
                </h2>
                <Card
                  image_data={page?.image_url}
                  src={page?.image_url}
                  alt=""
                />
              </article>
            ))}
      </section>
    </>
  );
};

export default Company;
