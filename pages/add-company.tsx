import {useEffect, useState} from 'react';
import type {NextPage} from 'next';
import Head from 'next/head';
import {useSession} from 'next-auth/react';
import SubNav from '../components/SubNav';
import ImageUpload from '../components/ImageUpload';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import axios from 'axios';

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

const AddCompany: NextPage = () => {
  const {data: session} = useSession();
  const [companyName, setCompanyName] = useState('');
  const [companyUrl, setCompanyUrl] = useState('');
  const [companyDescription, setCompanyDescription] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState(INDUSTRIES[0]);
  const [message, setMessage] = useState('');
  const [dynamicallyGeneratedFiles, setDGF] = useState([
    {
      name: 'file-1',
      previewSrc: '',
      page_name: 'Landing page',
      page_description: '',
    },
  ]);

  useEffect(() => {
    if (session === null) {
      window.location.href = '/auth/signin';
    }
  }, [session]);

  const {mutate: createCompany, isLoading: isCreatingCompany} =
    useCreateCompany();

  const handleSubmit = (e: React.MouseEvent) => {
    e.preventDefault();

    const data = {
      name: companyName || '',
      url: companyUrl || '',
      description: companyDescription || '',
      industry: selectedIndustry.value || INDUSTRIES[0].value,
      pages: dynamicallyGeneratedFiles || [],
      slug: companyName.toLowerCase().replace(/ /g, '-'),
    };

    console.log(data, 'data');

    createCompany(
      {data: data},
      {
        onSuccess: () => {
          setCompanyName('');
          setCompanyUrl('');
          setCompanyDescription('');
          setMessage('Company added successfully');
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
        <title>Add company</title>
      </Head>

      <SubNav text="Add a new company" />

      <div className="mx-auto mt-8 mb-14 max-w-[630px]">
        <h2 className="text-md font-medium text-grey">Add a new company</h2>
        <div className="mt-8 flex basis-full gap-4">
          <input
            type="text"
            className="basis-[56.98%]"
            placeholder="Company name"
            id="companyName"
            value={companyName}
            onChange={e => setCompanyName(e.target.value)}
          />
          <input
            type="url"
            className="basis-[43.02%]"
            placeholder="URL"
            id="url"
            value={companyUrl}
            onChange={e => setCompanyUrl(e.target.value)}
          />
        </div>
        <textarea
          className="mt-4 flex h-60 w-full py-4"
          placeholder="Company description"
          id="description"
          value={companyDescription}
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
            disabled={isCreatingCompany}
          >
            Save company
          </button>
        </div>

        {message && <p className="mt-4 text-blue">{message}</p>}
      </div>
    </>
  );
};

export default AddCompany;

function useCreateCompany() {
  const queryClient = useQueryClient();
  return useMutation(
    (values: object) =>
      axios
        .post(`${process.env.NEXT_PUBLIC_STRAPI_URL}/companies`, values)
        .then(res => res.data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['companies']);
      },
    },
  );
}
