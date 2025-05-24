import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { toast } from 'react-toastify';
import { AuthContext } from '../../contexts/AuthProvider';
import { PiEye, PiEyeClosed } from "react-icons/pi";
import { FcGoogle } from "react-icons/fc";
import { createUser } from '../../apis/userApi';
import { createToken } from '../../apis/authApi';

// utils import
import { validPassword } from '../../Utils/Validators/passValidator';
import axiosInstance from '../../config/axiosInstance';

const image_hosting_key = import.meta.env.VITE_Image_Upload_token;
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

const RegisterForm = () => {
  const navigate = useNavigate();
  const { createNewUser, updateUserProfile, signInWithGoogle } = useContext(AuthContext);

  const [error, setError] = useState('');
  const [passwordType, setPasswordType] = useState('password');

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    // get the form data
    const form = new FormData(e.target);
    const user_name = form.get('name');
    const user_email = form.get('email');
    const image = form.get('photo');
    const password = form.get('password');
    const user_role = 'student';
    const course_enrollment = 0;

    const passError = validPassword(password);
    if (passError) {
      setError(passError);
      return;
    }

    try {
      // Upload image to imgbb
      const imageFormData = new FormData();
      imageFormData.append('image', image);

      const res = await axiosInstance.post(image_hosting_api, imageFormData, {
        headers: {
          "content-type": "multipart/form-data",
        }
      });

      const user_image = res.data?.data?.url;
      console.log('image url:', user_image);

      const user = {
        user_name,
        user_email,
        user_image,
        password,
        user_role,
        course_enrollment
      };

      // register -> firebase
      const res1 = await createNewUser(user_email, password);
      console.log(res1.user);

      // token create
      const res2 = await createToken(user_email);
      console.log(res2);

      // update profile
      await updateUserProfile({
        displayName: user_name,
        photoURL: user_image,
      });

      toast.success('Successfully registered user!', {
        position: "top-center",
        autoClose: 1000,
        theme: "dark",
      });

      navigate('/');

      // store user in database
      const res3 = await createUser(user);
      console.log(res3);
    } catch (e) {
      const errorCode = e.code;
      const errorMessage = e.message;
      toast.error(`Error: ${errorMessage} ${errorCode}!`, {
        position: "top-center",
        autoClose: 1000,
        theme: "dark",
      });
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const res = await signInWithGoogle();
      navigate('/');
    } catch (e) {
      console.error('Google Sign-In Error:', e.message);
    }
  };

  const togglePasswordType = () => {
    setPasswordType(prev => prev === 'password' ? 'text' : 'password');
  };

  return (
    <div className='max-w-[420px] mx-auto bg-orchid/15 my-14 shadow-lg p-6 rounded-lg'>
      <h3 className='text-center font-semibold text-2xl md:text-3xl'> Register Your Account </h3>
      <p className='text-center mt-2 flex justify-center items-center gap-1 '>
        <span className='text-xl'> <FcGoogle /> </span> continue with 
        <button onClick={handleGoogleSignIn} className='text-blue underline ml-1'>Google</button>
      </p>

      <form onSubmit={handleRegisterSubmit} className="mt-4">
        <fieldset className="form-control mb-3">
          <label className="label mb-1"> <span className="label-text">Your Name</span> </label>
          <input name='name' type="text" placeholder="name" className="input w-full" required />
        </fieldset>
        <fieldset className="form-control mb-3">
          <label className="label mb-1"> <span className="label-text">Avatar</span> </label>
          <input name='photo' type="file" accept="image/*" className="input w-full" required />
        </fieldset>
        <fieldset className="form-control mb-3">
          <label className="label mb-1"> <span className="label-text">Email</span> </label>
          <input name='email' type="email" placeholder="email" className="input w-full" required />
        </fieldset>
        <fieldset className="form-control">
          <label className="label mb-1"> <span className="label-text">Password</span> </label>
          <div className='relative'>
            <input name='password' type={passwordType} placeholder="password" className="input w-full" required />
            <span onClick={togglePasswordType} className='absolute right-3 top-3 cursor-pointer'>
              {passwordType === 'password' ? <PiEye /> : <PiEyeClosed />}
            </span>
          </div>
        </fieldset>

        {error && <div className='text-sm text-red-600 pt-3 mr-3'>{error}</div>}

        <div className="form-control mt-4">
          <button className="btn bg-purple text-white w-full"> Register </button>
        </div>

        <p className='text-center text-sm mt-3'>
          Already have an account? 
          <span className='text-red-600 ml-1'> <Link to='/auth/login'>Sign In</Link> </span>
        </p>
      </form>
    </div>
  );
};

export default RegisterForm;
