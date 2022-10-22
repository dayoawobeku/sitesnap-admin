import Image from 'next/image';
import React, {useState} from 'react';
import {upload} from '../assets/images/images';

function Page({imageUrls, setImageUrls}) {
  const [selectedCategory, setSelectedCategory] = useState('Select Category');
  const [pageDescription, setPageDescription] = useState('');
  const [img, setImg] = useState(null);

  const [selectedFile, setSelectedFile] = useState();

  const changeHandler = event => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmission = async () => {
    const reader = new FileReader();
    const formData = new FormData();
    reader.onload = () => {
      const url = 'https://api.cloudinary.com/v1_1/dspbvhlt6/image/upload';

      formData.append('file', selectedFile);
      formData.append('upload_preset', 'omoui-uploads');

      fetch(url, {
        method: 'POST',
        body: formData,
      })
        .then(response => response.json())
        .then(result => {
          console.log('Success:', result);
          setImg(result.secure_url);
          setImageUrls({
            ...imageUrls,
            page_description: pageDescription,
            image_url: result.secure_url,
            id: result.public_id,
            category: selectedCategory,
          });
        })
        .catch(error => {
          console.error('Error:', error);
        });
    };

    reader.readAsBinaryString(selectedFile);
  };
  return (
    <>
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
            onChange={changeHandler}
            className="basis-[48.25%]"
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
          className="w-full mt-4 py-4 h-20 flex"
          placeholder="Page description (optional)"
          id="page-description"
          value={pageDescription}
          onChange={e => setPageDescription(e.target.value)}
        />
        <button
          onClick={handleSubmission}
          className="rounded-lg p-2 bg-blue text-white mt-4"
        >
          Upload
        </button>
      </div>
      {img}
    </>
  );
}

export default function ImageTest() {
  const [imageUrls, setImageUrls] = useState({});

  console.log(imageUrls);

  const [data, setData] = useState([]);

  return (
    <>
      <div className="mt-8 flex flex-col gap-14 mb-20">
        <Page imageUrls={imageUrls} setImageUrls={setImageUrls} />
        <Page imageUrls={imageUrls} setImageUrls={setImageUrls} />
      </div>
    </>
  );
}
