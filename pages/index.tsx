import {useEffect} from 'react';
import type {NextPage} from 'next';
import Head from 'next/head';
import {useSession} from 'next-auth/react';
import SubNav from '../components/SubNav';
import Image from 'next/image';
import {upload} from '../assets/images/images';

const Home: NextPage = () => {
  const {data: session} = useSession();

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

      <SubNav text="Admin" />

      <form className="mt-8 max-w-[630px] mx-auto mb-14">
        <h2 className="text-grey text-md font-medium">Add a new company</h2>
        <div className="flex gap-4 mt-8 basis-full">
          <input
            type="text"
            className="basis-[56.98%]"
            placeholder="Company name"
            id="companyName"
            required
          />
          <input
            type="text"
            className="basis-[43.02%]"
            placeholder="URL"
            id="url"
            required
          />
        </div>
        <textarea
          className="w-full mt-4 py-4 h-60 flex"
          placeholder="Company description"
          id="description"
          required
        />
        <select
          id="category"
          defaultValue={'DEFAULT'}
          required
          className="w-full mt-4"
        >
          <option value="DEFAULT" disabled>
            Category (Industry)
          </option>
          <option value="">Category 1</option>
          <option value="">Category 2</option>
          <option value="">Category 3</option>
        </select>
        <button className="mt-2 text-body font-medium">
          Add a new category
        </button>

        <div className="mt-8 flex flex-col gap-14">
          <div>
            <div className="flex gap-4 basis-full">
              <label
                htmlFor="upload-photo"
                className="basis-[48.25%] flex items-center gap-2 pl-4 outline-1 outline-dashed outline-body rounded-lg cursor-pointer"
              >
                <Image alt="" src={upload} width={20} height={20} />
                <span className="text-body">Upload image</span>
              </label>
              <input
                type="file"
                name="photo"
                id="upload-photo"
                accept="image/*"
                className="basis-[48.25%] "
              />
              <select
                id="category"
                defaultValue={'DEFAULT'}
                required
                className="basis-[51.75%]"
              >
                <option value="DEFAULT" disabled>
                  Page category
                </option>
                <option value="">Category 1</option>
                <option value="">Category 2</option>
                <option value="">Category 3</option>
              </select>
            </div>
            <textarea
              className="w-full mt-4 py-4 h-20 flex"
              placeholder="Page description (optional)"
              id="page-description"
            />
          </div>
          <div>
            <div className="flex gap-4 basis-full">
              <label
                htmlFor="upload-photo"
                className="basis-[48.25%] flex items-center gap-2 pl-4 outline-1 outline-dashed outline-body rounded-lg cursor-pointer"
              >
                <Image alt="" src={upload} width={20} height={20} />
                <span className="text-body">Upload image</span>
              </label>
              <input
                type="file"
                name="photo"
                id="upload-photo"
                accept="image/*"
                className="basis-[48.25%]"
              />
              <select
                id="category"
                defaultValue={'DEFAULT'}
                required
                className="basis-[51.75%]"
              >
                <option value="DEFAULT" disabled>
                  Page category
                </option>
                <option value="">Category 1</option>
                <option value="">Category 2</option>
                <option value="">Category 3</option>
              </select>
            </div>
            <textarea
              className="w-full mt-4 py-4 h-20 flex"
              placeholder="Page description (optional)"
              id="page-description"
            />
          </div>
        </div>

        <div className="mt-8 flex basis-full gap-2 h-14">
          <button className="basis-[25.71%] flex items-center justify-center bg-white-200 text-body font-medium rounded-lg">
            Add a new page
          </button>
          <button className="basis-[74.29%] bg-blue text-white font-medium rounded-lg">
            Save company
          </button>
        </div>
      </form>
    </>
  );
};

export default Home;
