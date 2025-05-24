import React, { useContext, useState } from 'react';
import { createService } from '../../apis/serviceApi';
import axiosInstance from '../../config/axiosInstance';
import { AuthContext } from '../../contexts/AuthProvider';


const image_hosting_key = import.meta.env.VITE_Image_Upload_token;
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;



const AddServiceForm = () => {
  const { user } = useContext(AuthContext);    //ei user jeta firebase e save hoye ace
  const user_email = user.email;

  const [previewUrl, setPreviewUrl] = useState(null);

  const handleServiceAdd = async (e) => {
    e.preventDefault();

    // get the form data
    const form = new FormData(e.target);
    const service_title = form.get('service_title');
    const service_category = form.get('service_category')
    const service_listing_type = form.get('service_listing_type')
    const service_condition = form.get('service_condition')
    const service_pricing_type = form.get('service_pricing_type')
    const service_visibility = form.get('service_visibility')
    const user_uni = form.get('user_uni')
    const service_price = form.get('service_price')
    const user_phone = form.get('user_phone')


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

    const service = {
      service_title,
      service_category,
      service_listing_type,
      service_condition,
      service_pricing_type,
      service_visibility,
      user_uni,
      service_price,
      user_phone,
      service_image,
      posted_by: user_email
    };

    console.log(service)
    const res2 = await createService(service);

  }


  return (
    <div className=''>
      <div className='w-full mb-14 p-5 '>
        {/* form */}
        <form onSubmit={handleServiceAdd} className="mt-4">
          <div className='flex justify-center gap-8'>
            {/* Left div lefttttttttttt */}
          <div className='sm:w-[400px] md:w-[600px] shadow-2xl py-8 px-6'>
            {/* Title */}
            <fieldset className="form-control mb-3">
              <label className="label mb-1">
                <span className="label-text">Title</span>
              </label>
              <input name="service_title" type="text" placeholder="Enter title" className="input w-full" required />
            </fieldset>

            {/* Category */}
            <div className='w-full flex gap-2 justify-between'>
              <fieldset className="form-control mb-3 w-[48%] ">
                <label className="label mb-1">
                  <span className="label-text">Category</span>
                </label>
                <select name="service_category" className="input w-full" required>
                  <option value="">Select category</option>
                  <option value="electronics">Electronics</option>
                  <option value="books">Books</option>
                  <option value="furniture">Furniture</option>
                  <option value="clothing">Clothing</option>
                </select>
              </fieldset>

              {/* Listing Type */}
              <fieldset className="form-control mb-3 w-[48%]">
                <label className="label mb-1">
                  <span className="label-text">Listing Type</span>
                </label>
                <select name="service_listing_type" className="input w-full" required>
                  <option value="">Select listing type</option>
                  <option value="sell">Sell</option>
                  <option value="rent">Rent</option>
                  <option value="donate">Donate</option>
                </select>
              </fieldset>
            </div>

            {/* Item Condition */}
            <div  className='w-full flex gap-2 justify-between'>
              <fieldset className="form-control mb-3 w-[48%] ">
                <label className="label mb-1">
                  <span className="label-text">Item Condition</span>
                </label>
                <select name="service_condition" className="input w-full" required>
                  <option value="">Select condition</option>
                  <option value="new">New</option>
                  <option value="used_like_new">Used - Like New</option>
                  <option value="used_good">Used - Good</option>
                  <option value="used_fair">Used - Fair</option>
                </select>
              </fieldset>

              {/* Pricing Type */}
              <fieldset className="form-control mb-3 w-[48%] ">
                <label className="label mb-1">
                  <span className="label-text">Pricing Type</span>
                </label>
                <select name="service_pricing_type" className="input w-full" required>
                  <option value="">Select pricing type</option>
                  <option value="fixed">Fixed</option>
                  <option value="negotiable">Negotiable</option>
                  <option value="free">Free</option>
                </select>
              </fieldset>
            </div>

            <div  className='w-full flex gap-2 justify-between'>
              {/* visibility */}
            <fieldset className="form-control mb-3 w-[48%] ">
              <label className="label mb-1">
                <span className="label-text">Visibility</span>
              </label>
              <select name="service_visibility" className="input w-full" required>
                <option value="">Select visibility</option>
                <option value="public">Public</option>
                <option value="university_only">University Only</option>
              </select>
            </fieldset>

            {/* University */}
            <fieldset className="form-control mb-3 w-[48%] ">
              <label className="label mb-1">
                <span className="label-text">University</span>
              </label>
              <input name="user_uni" type="text" placeholder="Enter university name" className="input w-full" required />
            </fieldset>
            </div>
            

            {/* Price */}
            <div  className='w-full flex gap-2 justify-between'>
              <fieldset className="form-control mb-3 w-[48%] ">
                <label className="label mb-1">
                  <span className="label-text">Price</span>
                </label>
                <input name="service_price" type="number" placeholder="Enter price" className="input w-full" required />
              </fieldset>

              {/* Phone Number */}
              <fieldset className="form-control mb-3 w-[48%] ">
                <label className="label mb-1">
                  <span className="label-text">Phone Number</span>
                </label>
                <input name="user_phone" type="tel" placeholder="Enter phone number" className="input w-full" required />
              </fieldset>
            </div>
          </div>

          {/* right div rightttttttttt */}
          <div className='w-[40%] '>
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
          </div>
          </div>

          {/* Submit */}
          <button type="submit" className="bg-pastle text-white btn w-full mt-4">Submit</button>
        </form>


      </div>
    </div>
  );
};

export default AddServiceForm;
