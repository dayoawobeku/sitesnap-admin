import axios from 'axios';
import React from 'react';

export default function ImageUpload({
  dynamicallyGeneratedFiles,
  setDGF,
  PAGES,
}) {
  function addToListOfFiles() {
    setDGF(prev => {
      return [
        ...prev,
        {
          name: 'file-' + (prev.length + 1),
          previewSrc: '',
          page_description: '',
          page_name: PAGES[0].value,
        },
      ];
    });
  }

  function updateDescriptionValue(index: number, value: string) {
    const clone = dynamicallyGeneratedFiles.slice();
    clone.splice(index, 1, {
      ...clone[index],
      page_description: value,
    });
    setDGF(clone);
  }

  function updatePageValue(index: number, value: string) {
    const clone = dynamicallyGeneratedFiles.slice();
    clone.splice(index, 1, {
      ...clone[index],
      page_name: value,
    });
    setDGF(clone);
  }

  function setPreviewSrc(
    changeEvent: React.ChangeEvent<HTMLInputElement>,
    name: string,
  ) {
    const reader = new FileReader();
    const file = changeEvent.target.files[0];

    reader.onload = function (onLoadEvent) {
      const indexToUpdate = dynamicallyGeneratedFiles.findIndex(
        item => item.name === name,
      );
      if (indexToUpdate === -1) {
        // we couldn't find the item in the list of files, abort
        return;
      }
      const clone = dynamicallyGeneratedFiles.slice();
      clone[indexToUpdate] = {
        previewSrc: onLoadEvent?.target?.result,
        name,
      };
      setDGF(clone);
    };
    if (file) {
      reader.readAsDataURL(file);
    } else {
      // no file was selected, abort
      return;
    }
  }

  async function handleOnSubmit(event: {
    preventDefault: () => void;
    currentTarget: HTMLFormElement;
  }) {
    event.preventDefault();

    const form = event.currentTarget;

    const inputs = Array.from(form.querySelectorAll('input[type="file"]'));

    const requests = inputs.map(input => {
      const file = input.files[0];
      const formData = new FormData();
      if (file) {
        formData.append('file', file);
      } else {
        return Promise.resolve();
      }
      formData.append('upload_preset', 'omoui-uploads');
      return axios.post(
        'https://api.cloudinary.com/v1_1/dspbvhlt6/image/upload',
        formData,
      );
    });

    const resolved = await Promise.all(requests);

    const updatedFiles = resolved.map((response, index) => {
      const file = dynamicallyGeneratedFiles[index];
      // if the file was not uploaded, return the original file
      if (!response) {
        return file;
      } else {
        return {
          ...file,
          image_url: response?.data.secure_url,
          page_name: file.page_name,
          page_description: file.page_description,
          id: response?.data.public_id,
          name: response?.data.original_filename,
          previewSrc: response?.data.secure_url,
        };
      }
    });

    setDGF(updatedFiles);
    console.log(updatedFiles, 'updatedFiles');
  }

  return (
    <>
      <form onSubmit={handleOnSubmit}>
        <div className="mt-4 flex flex-col gap-14">
          {dynamicallyGeneratedFiles?.map(
            ({name, page_description, page_name, previewSrc}, index) => (
              <div key={name} className="flex flex-col gap-4">
                <div className="flex basis-full gap-4">
                  <input
                    type="file"
                    name={name}
                    accept=".jpg,.png"
                    onChange={e => setPreviewSrc(e, name)}
                    className="basis-[48.25%] pt-3"
                  />
                  <select
                    id="category"
                    required
                    value={page_name || PAGES[0].value}
                    onChange={e => {
                      updatePageValue(index, e.target.value);
                    }}
                    className="basis-[51.75%]"
                  >
                    <option disabled>Page category</option>
                    {PAGES.map(page => (
                      <option key={page.value} value={page.value}>
                        {page.label}
                      </option>
                    ))}
                  </select>
                </div>
                <img
                  src={previewSrc}
                  alt={name}
                  className="mt-2 w-full rounded-lg"
                />
                <textarea
                  className="flex h-20 w-full py-4"
                  placeholder="Page description (optional)"
                  id="page-description"
                  name="page-description"
                  value={page_description || ''}
                  onChange={e => {
                    updateDescriptionValue(index, e.target.value);
                  }}
                />
              </div>
            ),
          )}
        </div>

        <div className="mt-4 flex basis-full gap-2">
          <button
            type="button"
            className="flex h-14 basis-[25.71%] items-center justify-center rounded-lg bg-white-200 font-medium text-body"
            onClick={() => addToListOfFiles()}
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
    </>
  );
}
