import React from 'react';

const image_hosting_key = import.meta.env.VITE_Image_Upload_token;
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;


const AddServiceImage = () => {
  return (
    <div>
      <fieldset className="form-control mb-3">
        <label className="label mb-1">
          <span className="label-text"> Select an image </span>
        </label>
        <input
          name="photo"
          type="file"
          accept="image/*"
          className="input w-full"
          required
        />
      </fieldset>

    </div>
  );
};

export default AddServiceImage;