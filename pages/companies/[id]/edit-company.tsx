import type {NextPage} from 'next';
import Head from 'next/head';
import {useRouter} from 'next/router';
import {useQuery} from '@tanstack/react-query';
import axios from 'axios';
import SubNav from '../../../components/SubNav';
import ImageTest from '../../../components/ImageTest';

interface Slug {
  slug: string | string[] | undefined;
}

const EditCompany: NextPage = () => {
  const router = useRouter();
  const {data: company, isLoading: loadingCompany} = useCompany(
    router.query.id,
  );

  return (
    <>
      <Head>
        <title>Edit company</title>
      </Head>

      <SubNav text={loadingCompany ? '-' : company?.data[0]?.attributes.name} />

      <div className="mt-8 max-w-[630px] mx-auto mb-14">
        <h2 className="text-grey text-md font-medium">Edit company</h2>
        <div className="flex gap-4 mt-8 basis-full">
          <input
            type="text"
            className="basis-[56.98%]"
            placeholder="Company name"
            id="companyName"
            defaultValue={
              loadingCompany ? '-' : company?.data[0]?.attributes.name
            }
          />
          <input
            type="text"
            className="basis-[43.02%]"
            placeholder="URL"
            id="url"
            defaultValue={
              loadingCompany ? '-' : company?.data[0]?.attributes.url
            }
          />
        </div>
        <textarea
          className="w-full mt-4 py-4 h-60 flex"
          placeholder="Company description"
          id="description"
          defaultValue={
            loadingCompany ? '-' : company?.data[0]?.attributes.description
          }
        />
        <select id="category" defaultValue={'DEFAULT'} className="w-full mt-4">
          <option value="DEFAULT" disabled>
            Category (Industry)
          </option>
          <option value="">Category 1</option>
          <option value="">Category 2</option>
          <option value="">Category 3</option>
        </select>

        <ImageTest />

        <div className="mt-8 flex basis-full gap-2 h-14">
          <button className="basis-full bg-blue text-white font-medium rounded-lg">
            Save changes
          </button>
        </div>
      </div>
    </>
  );
};

export default EditCompany;

function useCompany(slug: Slug['slug']) {
  return useQuery([`company-${slug}`], () =>
    axios
      .get(
        `${process.env.NEXT_PUBLIC_STRAPI_URL}/companies?filters[slug][$eq]=${slug}`,
      )
      .then(res => res.data),
  );
}
