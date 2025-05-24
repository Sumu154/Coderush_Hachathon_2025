import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';


import { FaUniversity } from "react-icons/fa";
import { RiBuilding2Fill } from "react-icons/ri";
import { CiCalendarDate } from "react-icons/ci";
import { SlCalender } from "react-icons/sl";

import { MdOutlineUpdate } from 'react-icons/md';
import { FaPhoneAlt } from "react-icons/fa";
import { getUserByEmail } from '../../apis/userApi';
import { AuthContext } from '../../contexts/AuthProvider';
import UpdatePrivateModal from './UpdatePrivateModal';


const ProfilePrivateInfo = () => {
  const { user } = useContext(AuthContext);
  const user_email = user.email;

  const [ userp, setUserp ] = useState('')
  const [ modalOpen, setModalOpen ] = useState(false);

  const fetchAcademicInfo = async () => {
    const data = await getUserByEmail(user_email)
    setUserp(data);
  }

  useEffect(() => {
    fetchAcademicInfo();
  }, [])

  return (
    <div className='border-[1px] border-dark/10 px-3 py-4 text-dark/80 rounded-sm  '>
      <p className='flex items-center gap-2 mb-1'>
        <span className='text-xl'> <CiCalendarDate className='text-pastle' /> </span>
        <span>Date of Birth: {userp?.user_dob || 'Not provided'} </span>
      </p>
      <p className='flex items-center gap-2 mb-1'>
        <FaPhoneAlt className='text-pastle' />
        <span>Phone numbers: {userp?.user_phone || 'Not provided'} </span>
      </p>
      
      <Link className='w-[48%]' >  </Link>
      <div> 
        <button onClick={()=>setModalOpen(true)} className='rounded-lg w-full bg-orange  hover:bg-orange/95 py-[4px]  text-white flex justify-center items-center mt-8  gap-1 '> <span className='mb-[2px] '> Update </span> <MdOutlineUpdate className='text-xl' /> </button>
        <UpdatePrivateModal modalOpen={modalOpen} setModalOpen={setModalOpen} ></UpdatePrivateModal>
      </div>  
    </div>
  );
};

export default ProfilePrivateInfo;