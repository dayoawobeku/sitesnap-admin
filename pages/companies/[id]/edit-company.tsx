import type {NextPage} from 'next';
import Head from 'next/head';
import {useRouter} from 'next/router';
import {useMutation, useQuery} from '@tanstack/react-query';
import axios from 'axios';
import SubNav from '../../../components/SubNav';
import ImageUpload from '../../../components/ImageUpload';
import {useEffect, useState} from 'react';

const PAGES = [
  {value: 'Landing page', label: 'Landing page'},
  {value: 'About page', label: 'About page'},
  {value: 'Contact page', label: 'Contact page'},
];

const INDUSTRIES = [
  {value: 'Fintech', label: 'Fintech'},
  {value: 'Healthtech', label: 'Healthtech'},
  {value: 'Onboarding', label: 'Onboarding'},
];

interface File {
  page_description: string;
  page_name: string;
}

interface Slug {
  slug: string | string[] | undefined;
}

const EditCompany: NextPage = () => {
  const router = useRouter();
  const [companyName, setCompanyName] = useState('');
  const [companyUrl, setCompanyUrl] = useState('');
  const [companyDescription, setCompanyDescription] = useState('');

  const {data: company, status} = useCompany(router.query.id);
  const companyId = company?.data[0]?.id;
  const {mutate: editCompany} = useEditCompany(companyId);
  const [dynamicallyGeneratedFiles, setDGF] = useState([
    {
      name: 'file-1',
      previewSrc: '',
      page_name: 'Landing page',
      page_description: '',
    },
  ]);
  const [selectedIndustry, setSelectedIndustry] = useState(INDUSTRIES[0]);

  console.log(dynamicallyGeneratedFiles, 'dynamicallyGeneratedFiles');

  useEffect(() => {
    const dataFromApi =
      status === 'success' ? company?.data[0]?.attributes?.pages : [];

    const files = dataFromApi?.map((file: File) => {
      return {
        ...file,
        page_description: file.page_description || '',
        page_name: file.page_name || '',
      };
    });

    setDGF(files);

    console.log(files);

    setSelectedIndustry({
      value: company?.data[0]?.attributes?.industry,
      label: company?.data[0]?.attributes?.industry,
    });
  }, [company?.data, status]);

  const handleSubmit = (e: React.MouseEvent) => {
    e.preventDefault();

    const data = {
      name: companyName || company?.data[0]?.attributes?.name,
      url: companyUrl || company?.data[0]?.attributes?.url,
      description:
        companyDescription || company?.data[0]?.attributes?.description,
      industry:
        selectedIndustry.value || company?.data[0]?.attributes?.industry,
      pages: dynamicallyGeneratedFiles || company?.data[0]?.attributes?.pages,
    };

    editCompany(
      {data: data},
      {
        onSuccess: res => {
          setCompanyName('');
          setCompanyUrl('');
          setCompanyDescription('');
          console.log(res, 'res');
        },
        onError: res => {
          // setMessage(res);
          console.log(res);
        },
      },
    );
  };

  return (
    <>
      <Head>
        <title>Edit company</title>
      </Head>

      <SubNav text={company?.data[0]?.attributes.name ?? '-'} />

      <div className="mx-auto mt-8 mb-14 max-w-[630px]">
        <h2 className="text-md font-medium text-grey">Edit company</h2>
        <div className="mt-8 flex basis-full gap-4">
          <input
            type="text"
            className="basis-[56.98%]"
            placeholder="Company name"
            id="companyName"
            defaultValue={company?.data[0]?.attributes.name ?? '-'}
            onChange={e => setCompanyName(e.target.value)}
          />
          <input
            type="url"
            className="basis-[43.02%]"
            placeholder="URL"
            id="url"
            defaultValue={company?.data[0]?.attributes.url ?? '-'}
            onChange={e => setCompanyUrl(e.target.value)}
          />
        </div>
        <textarea
          className="mt-4 flex h-60 w-full py-4"
          placeholder="Company description"
          id="description"
          defaultValue={company?.data[0]?.attributes.description ?? '-'}
          onChange={e => setCompanyDescription(e.target.value)}
        />
        <select
          id="category"
          onChange={e =>
            setSelectedIndustry({
              value: e.target.value,
              label: e.target.value,
            })
          }
          defaultValue={company?.data[0]?.attributes.industry ?? '-'}
          className="mt-4 w-full"
        >
          <option value="DEFAULT" disabled>
            Category (Industry)
          </option>
          {INDUSTRIES.map(industry => (
            <option key={industry.value} value={industry.value}>
              {industry.label}
            </option>
          ))}
        </select>

        <ImageUpload
          PAGES={PAGES}
          dynamicallyGeneratedFiles={dynamicallyGeneratedFiles}
          setDGF={setDGF}
        />

        <div className="mt-8 flex h-14 basis-full gap-2">
          <button
            className="basis-full rounded-lg bg-blue font-medium text-white"
            onClick={handleSubmit}
          >
            Save changes
          </button>
        </div>
      </div>
    </>
  );
};

export default EditCompany;

function useCompany(slug: Slug['slug']) {
  return useQuery(
    [`company-${slug}`],
    () =>
      axios
        .get(
          `${process.env.NEXT_PUBLIC_STRAPI_URL}/companies?filters[slug][$eq]=${slug}`,
        )
        .then(res => res.data),
    {
      enabled: !!slug,
    },
  );
}

function useEditCompany(id: Slug['slug']) {
  return useMutation((values: object) =>
    axios
      .put(`${process.env.NEXT_PUBLIC_STRAPI_URL}/companies/${id}`, values)
      .then(res => res.data),
  );
}
