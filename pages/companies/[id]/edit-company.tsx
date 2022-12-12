import {useEffect, useState} from 'react';
import type {NextPage} from 'next';
import Head from 'next/head';
import {useRouter} from 'next/router';
import {v4 as uuidv4} from 'uuid';
import {useCompany, useEditCompany} from '../../../hooks';
import {Form, SubNav} from '../../../components';

interface Page {
  thumbnail_url: string;
  image_url: string;
  page_id: string;
  page_name: string;
}
interface ErrorMessage {
  message: string;
  path: string;
}

const EditCompany: NextPage = () => {
  const router = useRouter();
  const {data: company, isSuccess: successfullyFetchedCompany} = useCompany(
    router.query.id,
  );
  const companyId = company?.data[0]?.id;
  const {
    mutate: editCompany,
    isLoading: editingCompany,
    isError,
    isSuccess,
  } = useEditCompany(companyId);

  const [companyData, setCompanyData] = useState({
    name: company?.data[0]?.attributes?.name ?? '',
    url: company?.data[0]?.attributes?.url ?? '',
    description: company?.data[0]?.attributes?.description ?? '',
    industry: company?.data[0]?.attributes?.industry ?? '',
  });

  const [pages, setPages] = useState(company?.data[0]?.attributes?.pages);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (successfullyFetchedCompany) {
      setCompanyData({
        name: company?.data[0]?.attributes?.name,
        url: company?.data[0]?.attributes?.url,
        description: company?.data[0]?.attributes?.description,
        industry: company?.data[0]?.attributes?.industry,
      });
      setPages(company?.data[0]?.attributes?.pages);
    }
  }, [company?.data, successfullyFetchedCompany]);

  const handleSubmit = (e: React.MouseEvent) => {
    e.preventDefault();

    const data = {
      name: companyData.name,
      url: companyData.url,
      description: companyData.description,
      industry: companyData.industry,
      pages: [
        ...pages.map((page: Page) => ({
          ...page,
          page_id: page.page_id
            ? page.page_id.slice(0, 8)
            : uuidv4().slice(0, 8),
          company_name: companyData.name,
          image_url: page.image_url.includes('upload/q_auto,f_auto')
            ? page.image_url
            : page.image_url.replace('upload/', 'upload/q_auto,f_auto/'),
          thumbnail_url:
            page.thumbnail_url &&
            page.thumbnail_url.includes(
              'upload/e_sharpen:200,q_auto,f_auto,w_620,h_411,c_thumb,g_north_west/',
            )
              ? page.thumbnail_url
              : page.image_url.replace(
                  'upload/',
                  'upload/e_sharpen:200,q_auto,f_auto,w_620,h_411,c_thumb,g_north_west/',
                ),
        })),
      ],
      slug: companyData.name.toLowerCase().replace(/ /g, '-'),
    };

    editCompany(
      {data: data},
      {
        onSuccess: () => {
          setMessage('Company updated successfully.');
          setTimeout(() => {
            router.push(`/companies/${data.slug}`);
          }, 2000);
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onError: (error: any) => {
          setMessage(
            error.response.data.error.details.errors
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
        <title>Edit company</title>
      </Head>

      <SubNav text={company?.data[0]?.attributes?.name ?? '-'} />

      <Form
        disabled={editingCompany}
        onSubmit={handleSubmit}
        pageTitle="Edit company"
        key={company?.data[0]?.id}
        data={companyData}
        pages={pages}
        setData={setCompanyData}
        setPages={setPages}
        isError={isError}
        isSuccess={isSuccess}
        message={message}
      />
    </>
  );
};

export default EditCompany;
