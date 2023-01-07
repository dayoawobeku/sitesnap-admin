import React from 'react';
import axios from 'axios';
import Image from 'next/image';
import Lottie from 'lottie-react';
import {v4 as uuidv4} from 'uuid';
import {shapesLottie} from '../assets/lottie';
import {checkmark} from '../assets/images';
import {INDUSTRIES, PAGES} from '../helpers';

const lottieDimension = {
  height: 56,
  width: 56,
};

interface Data {
  name: string;
  url: string;
  description: string;
  industry: string;
}

interface Pages {
  page_name: string;
  page_description: string;
  image_url: string;
  company_name: string;
  upload_status: string;
  page_id: string;
  thumbnail_url: string;
}

interface FormState {
  data: Data;
  pages: Pages[];
  setData: React.Dispatch<React.SetStateAction<Data>>;
  setPages: React.Dispatch<React.SetStateAction<Pages[]>>;
  pageTitle: string;
  disabled: boolean;
  message: string;
  isError: boolean;
  isSuccess: boolean;
  onSubmit: (e: React.MouseEvent<HTMLFormElement, MouseEvent>) => void;
}

export default function Form({
  data,
  setData,
  pages,
  setPages,
  onSubmit,
  pageTitle,
  disabled,
  message,
  isError,
  isSuccess,
}: FormState) {
  const addNewPage = () => {
    setPages([
      ...pages,
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
  };

  const removePage = (index: number) => {
    if (pages.length > 1) {
      setPages(pages.filter((_, i) => i !== index));
    }
  };
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setData({...data, [e.target.name]: e.target.value});
  };

  const handlePageChange = (name: string, value: string, id: number) => {
    setPages(prevState => {
      const newState = [...prevState];
      newState[id][name as keyof Pages] = value;
      return newState;
    });
  };
  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    i: number,
  ) => {
    const file = e.target.files?.[0];
    const formData = new FormData();
    formData.append('file', file as Blob);
    formData.append(
      'upload_preset',
      process.env.NEXT_PUBLIC_UPLOAD_PRESET as string,
    );
    if (!file) return;
    setPages(prevState => {
      const newState = [...prevState];
      newState[i].upload_status = 'loading';
      return newState;
    });
    const res = await axios.post(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_ID}/image/upload`,
      formData,
    );
    if (res) {
      const url = res.data.secure_url.replace(
        'upload/', // cloudinary image optimization
        'upload/q_auto,f_auto/',
      );
      const thumbnail = res.data.secure_url.replace(
        'upload/', // cloudinary thumbnail optimization
        'upload/e_sharpen:100,q_auto,f_auto,w_620,h_411,c_thumb,g_north_west/',
      );

      setPages(prevState => {
        const newState = [...prevState];
        newState[i].image_url = url;
        newState[i].thumbnail_url = thumbnail;
        newState[i].upload_status = 'success';
        return newState;
      });
    }
  };

  return (
    <form onSubmit={onSubmit} className="mx-auto mt-8 mb-14 max-w-[630px]">
      <h2 className="text-md font-medium text-grey">{pageTitle}</h2>
      <div className="mt-8 flex basis-full gap-4">
        <input
          type="text"
          className="basis-[56.98%]"
          placeholder="Company name"
          name="name"
          onChange={handleChange}
          defaultValue={data?.name}
          required
        />
        <input
          type="url"
          className="basis-[43.02%]"
          placeholder="URL"
          name="url"
          onChange={handleChange}
          defaultValue={data?.url}
          required
        />
      </div>
      <textarea
        className="mt-4 flex h-60 w-full py-4"
        placeholder="Company description"
        name="description"
        onChange={handleChange}
        defaultValue={data?.description}
        required
      />
      <select
        id="industry"
        name="industry"
        className="mt-4 w-full"
        onChange={e => {
          setData({...data, industry: e.target.value});
        }}
        defaultValue={data?.industry}
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

      <div className="mt-8 flex flex-col gap-14">
        {pages?.map((item, i) => {
          return (
            <section key={item.page_id ?? i}>
              <div className="flex flex-col gap-4">
                <div className="flex basis-full gap-4">
                  <input
                    type="file"
                    accept=".jpg,.png"
                    className="basis-[48.25%] pt-[14px]"
                    onChange={e => handleFileUpload(e, i)}
                  />
                  {item.upload_status === 'idle' ? (
                    ''
                  ) : item.upload_status === 'loading' ? (
                    (disabled = true) && (
                      <Lottie
                        loop={true}
                        animationData={shapesLottie}
                        style={lottieDimension}
                        className="-ml-2"
                      />
                    )
                  ) : item.upload_status === 'success' ? (
                    <div className="-ml-2 flex h-6 w-6 items-start">
                      <Image src={checkmark} alt="" width={24} height={24} />
                    </div>
                  ) : (
                    ''
                  )}
                  <select
                    name="page_name"
                    required
                    className="basis-[51.75%]"
                    onChange={e =>
                      handlePageChange(e.target.name, e.target.value, i)
                    }
                    defaultValue={item.page_name}
                  >
                    <option disabled>Page category</option>
                    {PAGES.map(page => (
                      <option key={page.value} value={page.value}>
                        {page.label}
                      </option>
                    ))}
                  </select>
                </div>

                {item.thumbnail_url ? (
                  <div className="relative h-[411px] w-full">
                    <Image
                      src={item.thumbnail_url}
                      alt={`${item.company_name} - ${item.page_name}`}
                      layout="fill"
                      objectFit="cover"
                      className="mt-2 w-full rounded-lg"
                    />
                  </div>
                ) : null}

                <textarea
                  className="flex h-20 w-full py-4"
                  placeholder="Page description (optional)"
                  name="page_description"
                  onChange={e =>
                    handlePageChange(e.target.name, e.target.value, i)
                  }
                  defaultValue={item.page_description}
                />
              </div>

              {pages.length > 1 ? (
                <button type="button" onClick={() => removePage(i)}>
                  {pages.length > 1 ? 'remove page' : null}
                </button>
              ) : null}
            </section>
          );
        })}
      </div>

      <div className="mt-8 flex h-14 basis-full gap-2">
        <button
          onClick={addNewPage}
          type="button"
          className="flex basis-[25.71%] items-center justify-center rounded-lg bg-white-200 font-medium text-body outline outline-[2.5px] outline-white-200 focus-within:outline-blue hover:outline-blue focus-visible:outline-blue"
        >
          Add a new page
        </button>
        <button
          disabled={disabled}
          type="submit"
          className="basis-[73.02%] rounded-lg bg-blue font-medium text-white"
        >
          Save company
        </button>
      </div>
      <p
        className={`mt-4 font-medium ${
          isError ? 'text-[#D53F41]' : isSuccess ? 'text-blue' : ''
        }`}
      >
        {message}
      </p>
    </form>
  );
}
