import React, { useState } from 'react';
import axiosInstance from '../../config/axiosInstance';

const image_hosting_key = import.meta.env.VITE_Image_Upload_token;
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;



const AddServiceImage = ({ setService_image }) => {
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleImageAdd = async (e) => {
    e.preventDefault();

    const form = new FormData(e.target);
    const image = form.get('photo');
    const imageFormData = new FormData();
    imageFormData.append('image', image);

    // Set preview
    const localUrl = URL.createObjectURL(image);
    setPreviewUrl(localUrl);

    // Upload to imgbb
    const res = await axiosInstance.post(image_hosting_api, imageFormData, {
      headers: {
        "content-type": "multipart/form-data",
      }
    });

    const service_image = res.data?.data?.url;
    console.log('image url:', service_image);
    setService_image(service_image);
  };



  return (
    <div className='w-[35%] '>
      <form onSubmit={handleImageAdd}>
        <fieldset className="form-control mb-3">
          <label className="label mb-1"> <span className="label-text">Select an image</span> </label>
          <input name="photo" type="file" accept="image/*" className="input w-full" required
            onChange={(e) => {
              const file = e.target.files[0];
              if(file) {
                setPreviewUrl(URL.createObjectURL(file));
              }
            }}
          />
        </fieldset>

        {previewUrl && (
          <div className="mb-3"> <img src={previewUrl} alt="Preview" className="w-full h-auto rounded" /> </div>
        )}

        {/* Submit */}
        <button type="submit" className="bg-pastle text-white btn w-full mt-4 "> Upload image </button>

      </form>
    </div>
  );
};

export default AddServiceImage;
