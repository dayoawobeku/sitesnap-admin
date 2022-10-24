import React, {useState} from 'react';

export default function ImageTest() {
  const [selectedCategory, setSelectedCategory] = useState('Select Category');
  const [pageDescription, setPageDescription] = useState('');
  const [dynamicallyGeneratedFiles, setDGF] = useState([
    {
      name: 'file-1',
      previewSrc: '',
    },
  ]);

  function addToListOfFiles() {
    setDGF(prev => {
      return [
        ...prev,
        {
          name: 'file-' + (prev.length + 1),
          previewSrc: '',
        },
      ];
    });
  }

  function setPreviewSrc(changeEvent, name) {
    const reader = new FileReader();

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

    reader.readAsDataURL(changeEvent.target.files[0]);
  }

  async function handleOnSubmit(event) {
    event.preventDefault();

    const form = event.currentTarget;
    // Instead of grabbing one input, we get all dynamically-added inputs
    const fileInputs = Array.from(form.elements).filter(({name}) =>
      name?.includes('file'),
    );

    if (fileInputs?.filter(file => file?.files.length) === 0) {
      // pseudo validation
      console.error('All inputs are required');
      return;
    }

    // we prepare the requests here
    const uploadRequests = fileInputs.map(file => {
      const formData = new FormData();
      formData.append('file', file.files[0]);
      formData.append('upload_preset', 'omoui-uploads');
      return fetch('https://api.cloudinary.com/v1_1/dspbvhlt6/image/upload', {
        method: 'POST',
        body: formData,
      }).then(r => r.json());
    });

    // Why Promise.all? Parallel processing, that's why. We want to send
    // all files at once, instead of one after the other
    const resolved = await Promise.all(uploadRequests);
    console.log({resolved}); // your answer
  }

  return (
    <>
      <form onSubmit={handleOnSubmit}>
        <div className="flex flex-col gap-14 mt-4">
          {dynamicallyGeneratedFiles?.map(name => (
            <div key={name} className="flex flex-col gap-4">
              <div className="flex gap-4 basis-full">
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
                  className="basis-[51.75%]"
                  value={selectedCategory}
                  onChange={e => setSelectedCategory(e.target.value)}
                >
                  <option value="DEFAULT" disabled>
                    Page category
                  </option>
                  <option value="category-1">Category 1</option>
                  <option value="category-2">Category 2</option>
                  <option value="category-3">Category 3</option>
                </select>
              </div>
              <textarea
                className="w-full py-4 h-20 flex"
                placeholder="Page description (optional)"
                id="page-description"
                value={pageDescription}
                onChange={e => setPageDescription(e.target.value)}
              />
            </div>
          ))}
        </div>

        <div className="flex basis-full gap-2 mt-4">
          <button
            className="basis-[25.71%] flex items-center justify-center bg-white-200 text-body font-medium rounded-lg h-14"
            onClick={addToListOfFiles}
          >
            Add a new page
          </button>
          <button className="basis-[74.29%] bg-white border border-grey text-grey font-medium rounded-lg h-14">
            Upload all images
          </button>
        </div>
      </form>
    </>
  );
}
