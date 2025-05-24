import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';


import { FaUniversity } from "react-icons/fa";
import { RiBuilding2Fill } from "react-icons/ri";
import { FaGraduationCap } from "react-icons/fa6";
import { SlCalender } from "react-icons/sl";

import { MdOutlineUpdate } from 'react-icons/md';
import UpdateAcadmeicModal from './UpdateAcadmeicModal';
import { getUserByEmail } from '../../apis/userApi';
import { AuthContext } from '../../contexts/AuthProvider';


const ProfileAcademicInfo = () => {
  const { user } = useContext(AuthContext);
  const user_email = user.email;
  const university = 'IUT'

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
        <FaUniversity className='text-pastle text-lg' />
        <span>University: {userp?.user_uni || 'Not provided'} </span>
      </p>
      <p className='flex items-center gap-2 mb-1'>
        <RiBuilding2Fill className='text-pastle text-lg' />
        <span>Department: {userp?.user_dep || 'Not provided'} </span>
      </p>
      <p className='flex items-center gap-2 mb-1'>
        <FaGraduationCap className='text-pastle text-lg' />
        <span>Program: {userp?.user_prog || 'Not provided'} </span>
      </p>
      <p className='flex items-center gap-2 mb-1'>
        <SlCalender className='text-pastle ' />
        <span>Year of Study: {userp?.user_year || 'Not provided'} </span>
      </p>

      <Link className='w-[48%] ' >  </Link>
      <div> 
        <button onClick={()=>setModalOpen(true)} className='rounded-lg w-full bg-orange  hover:bg-orange/95 py-[4px]  text-white flex justify-center items-center mt-8  gap-1 '> <span className='mb-[2px] '> Update </span> <MdOutlineUpdate className='text-xl' /> </button>
        <UpdateAcadmeicModal modalOpen={modalOpen} setModalOpen={setModalOpen} ></UpdateAcadmeicModal>
      </div>  
    </div>
  );
};

export default ProfileAcademicInfo;