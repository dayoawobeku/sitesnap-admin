import {useEffect} from 'react';
import type {NextPage} from 'next';
import Head from 'next/head';
import {useSession} from 'next-auth/react';
import SubNav from '../components/SubNav';
import ImageTest from '../components/ImageTest';

const AddCompany: NextPage = () => {
  const {data: session} = useSession();

  useEffect(() => {
    if (session === null) {
      window.location.href = '/auth/signin';
    }
  }, [session]);

  return (
    <>
      <Head>
        <title>Add company</title>
      </Head>

      <SubNav text="Add a new company" />

      <div className="mt-8 max-w-[630px] mx-auto mb-14">
        <h2 className="text-grey text-md font-medium">Add a new company</h2>
        <div className="flex gap-4 mt-8 basis-full">
          <input
            type="text"
            className="basis-[56.98%]"
            placeholder="Company name"
            id="companyName"
          />
          <input
            type="text"
            className="basis-[43.02%]"
            placeholder="URL"
            id="url"
          />
        </div>
        <textarea
          className="w-full mt-4 py-4 h-60 flex"
          placeholder="Company description"
          id="description"
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
            Save company
          </button>
        </div>
      </div>
    </>
  );
};

export default AddCompany;
