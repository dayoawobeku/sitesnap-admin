import React from 'react';

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

export default function Form() {
  return (
    <div className="mx-auto mt-8 mb-14 max-w-[630px]">
      <h2 className="text-md font-medium text-grey">Add a new company</h2>
      <div className="mt-8 flex basis-full gap-4">
        <input
          type="text"
          className="basis-[56.98%]"
          placeholder="Company name"
          id="companyName"
        />
        <input
          type="url"
          className="basis-[43.02%]"
          placeholder="URL"
          id="url"
        />
      </div>
      <textarea
        className="mt-4 flex h-60 w-full py-4"
        placeholder="Company description"
        id="description"
      />
      <select id="category" className="mt-4 w-full">
        <option value="DEFAULT" disabled>
          Category (Industry)
        </option>
        {INDUSTRIES.map(industry => (
          <option key={industry.value} value={industry.value}>
            {industry.label}
          </option>
        ))}
      </select>

      {/* this is for the dynamic part that has the image, the description, and the image type e.g landing page */}
      <form>
        <div className="mt-4 flex flex-col gap-14">
          <div className="flex flex-col gap-4">
            <div className="flex basis-full gap-4">
              <input
                type="file"
                accept=".jpg,.png"
                className="basis-[48.25%] pt-3"
              />
              <select id="category" required className="basis-[51.75%]">
                <option disabled>Page category</option>
                {PAGES.map(page => (
                  <option key={page.value} value={page.value}>
                    {page.label}
                  </option>
                ))}
              </select>
            </div>

            {/* this is the preview image to see what was uploaded */}
            {/* <img
              src={previewSrc}
              alt={name}
              className="mt-2 w-full rounded-lg"
            /> */}

            <textarea
              className="flex h-20 w-full py-4"
              placeholder="Page description (optional)"
              id="page-description"
              name="page-description"
            />
          </div>
        </div>

        <div className="mt-4 flex basis-full gap-2">
          <button
            type="button"
            className="flex h-14 basis-[25.71%] items-center justify-center rounded-lg bg-white-200 font-medium text-body"
          >
            Add a new page
          </button>
          <button
            type="submit"
            className="h-14 basis-[74.29%] rounded-lg border border-grey bg-white font-medium text-grey"
          >
            Upload all images
          </button>
        </div>
      </form>

      <div className="mt-8 flex h-14 basis-full gap-2">
        <button className="basis-full rounded-lg bg-blue font-medium text-white">
          Save company
        </button>
      </div>
    </div>
  );
}

// API endpoint: https://api.cloudinary.com/v1_1/dspbvhlt6/image/upload
// "dspbvhlt6" is my own key, so you can use it for testing

// then you need to append the "upload_preset" to the request as in:
// formData.append('upload_preset', 'omoui-uploads');
