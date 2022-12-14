import {useEffect, useState} from 'react';
import type {NextPage} from 'next';
import Head from 'next/head';
import {useSession} from 'next-auth/react';
import {v4 as uuidv4} from 'uuid';
import {useCreateCompany} from '../hooks';
import {useRouter} from 'next/router';
import {Form, SubNav} from '../components';

interface ErrorMessage {
  message: string;
  path: string;
}

const AddCompany: NextPage = () => {
  const {data: session} = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session === null) {
      window.location.href = '/auth/signin';
    }
  }, [session]);

  const [companyData, setCompanyData] = useState({
    name: '',
    url: '',
    description: '',
    industry: 'Fintech',
  });
  const [pages, setPages] = useState([
    {
      page_name: 'Homepage & Landing page',
      page_description: '',
      image_url: '',
      company_name: '',
      upload_status: 'idle',
      page_id: uuidv4().slice(0, 8),
      thumbnail_url: '',
    },
  ]);
  const [message, setMessage] = useState('');
  const {
    mutate: createCompany,
    isLoading: creatingCompany,
    isError,
    isSuccess,
  } = useCreateCompany();

  const handleSubmit = (e: React.MouseEvent) => {
    e.preventDefault();

    const data = {
      name: companyData.name.trim(),
      url: companyData.url,
      description: companyData.description,
      industry: companyData.industry,
      pages: [
        ...pages.map(page => ({
          ...page,
          company_name: companyData.name,
        })),
      ],
      slug: companyData.name.trim().toLowerCase().replace(/ /g, '-'),
      publishedAt: null,
    };

    createCompany(
      {data: data},
      {
        onSuccess: () => {
          setMessage('Company created successfully');
          setTimeout(() => {
            router.push(`/companies/${data.slug}`);
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
        <title>Add company</title>
      </Head>

      <SubNav text="Add a new company" />

      <Form
        disabled={creatingCompany}
        pageTitle="Add a new company"
        onSubmit={handleSubmit}
        data={companyData}
        pages={pages}
        setData={setCompanyData}
        setPages={setPages}
        message={message}
        isError={isError}
        isSuccess={isSuccess}
      />
    </>
  );
};

export default AddCompany;
