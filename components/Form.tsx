import React, {useState} from 'react';
import axios from 'axios';

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
  const [uploadStatus, setUploadStatus] = useState({
    status: 'idle',
    id: 'image-1',
  });
  const addNewSection = () => {
    setPages([
      ...pages,
      {
        page_name: 'Landing page',
        page_description: '',
        image_url: '',
      },
    ]);

    setUploadStatus({
      ...uploadStatus,
      status: 'idle',
      id: `image-${pages.length + 1}`,
    });
  };

  const idle = uploadStatus.status === 'idle';
  const uploading = uploadStatus.status === 'uploading';
  const success = uploadStatus.status === 'success';

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setData({...data, [e.target.name]: e.target.value});
  };

  const handleSectionChange = (name: string, value: string, id: number) => {
    const updatedSections = pages;
    updatedSections[id] = {...updatedSections[id], [name]: value};
    setPages(updatedSections);
  };

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    i: number,
  ) => {
    setUploadStatus({
      ...uploadStatus,
      status: 'uploading',
      id: `image-${i + 1}`,
    });
    const file = e.target.files?.[0];
    const formData = new FormData();
    formData.append('file', file as Blob);
    formData.append('upload_preset', 'omoui-uploads');
    if (!file) return;
    const res = await axios.post(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_ID}/image/upload`,
      formData,
    );
    setUploadStatus({
      ...uploadStatus,
      status: 'success',
      id: `image-${i + 1}`,
    });
    if (res) {
      handleSectionChange('image_url', res.data.secure_url, i);
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
            <section key={i}>
              <div className="flex flex-col gap-4">
                <div className="flex basis-full gap-4">
                  <input
                    type="file"
                    accept=".jpg,.png"
                    className="basis-[48.25%] pt-[14px]"
                    onChange={e => handleFileUpload(e, i)}
                  />
                  {uploadStatus.id === `image-${i + 1}` && uploading ? (
                    <p>Uploading</p>
                  ) : uploadStatus.id === `image-${i + 1}` && idle ? (
                    ''
                  ) : uploadStatus.id === `image-${i + 1}` && success ? (
                    <p>Success</p>
                  ) : null}
                  <select
                    name="page_name"
                    required
                    className="basis-[51.75%]"
                    onChange={e =>
                      handleSectionChange(e.target.name, e.target.value, i)
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

                {/* <img
                  src={item.image_url}
                  alt={name}
                  className="mt-2 w-full rounded-lg"
                /> */}

                <textarea
                  className="flex h-20 w-full py-4"
                  placeholder="Page description (optional)"
                  name="page_description"
                  onChange={e =>
                    handleSectionChange(e.target.name, e.target.value, i)
                  }
                  defaultValue={item.page_description}
                />
              </div>
            </section>
          );
        })}
      </div>

      <div className="mt-8 flex h-14 basis-full gap-2">
        <button
          onClick={addNewSection}
          type="button"
          className="flex h-14 basis-[25.71%] items-center justify-center rounded-lg bg-white-200 font-medium text-body"
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
