import {useEffect, useState} from 'react';
import type {NextPage} from 'next';
import Head from 'next/head';
import {useSession} from 'next-auth/react';
import SubNav from '../components/SubNav';
import Form from '../components/Form';
import {useCreateCompany} from '../hooks';

interface ErrorMessage {
  message: string;
  path: string;
}

const AddCompany: NextPage = () => {
  const {data: session} = useSession();

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
      page_name: 'Landing page',
      page_description: '',
      image_url: '',
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
      name: companyData.name,
      url: companyData.url,
      description: companyData.description,
      industry: companyData.industry,
      pages: pages,
      slug: companyData.name.toLowerCase().replace(/ /g, '-'),
    };

    createCompany(
      {data: data},
      {
        onSuccess: () => {
          setCompanyData({
            name: '',
            url: '',
            description: '',
            industry: '',
          });
          setPages([
            {
              page_name: 'Landing page',
              page_description: '',
              image_url: '',
            },
          ]);
          setMessage('Company created successfully!');
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
