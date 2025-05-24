import React, { useState } from 'react';
import { Link } from 'react-router-dom';


import { FaUniversity } from "react-icons/fa";
import { RiBuilding2Fill } from "react-icons/ri";
import { FaGraduationCap } from "react-icons/fa6";
import { SlCalender } from "react-icons/sl";

import { MdOutlineUpdate } from 'react-icons/md';
import UpdateAcadmeicModal from './UpdateAcadmeicModal';


const ProfileAcademicInfo = () => {
  const university = 'IUT'

  const [ modalOpen, setModalOpen ] = useState(false);

  const handleUpdateAcademicInfo = () => {

  }

  return (
    <div className='border-[1px] border-dark/10 px-3 py-4 text-dark/80 rounded-sm  '>
      <p className='flex items-center gap-2 mb-1'>
        <FaUniversity className='text-pastle' />
        <span>University: {university} </span>
      </p>
      <p className='flex items-center gap-2 mb-1'>
        <RiBuilding2Fill className='text-pastle' />
        <span>Department: {university} </span>
      </p>
      <p className='flex items-center gap-2 mb-1'>
        <FaGraduationCap className='text-pastle' />
        <span>Program: {university} </span>
      </p>
      <p className='flex items-center gap-2 mb-1'>
        <SlCalender className='text-pastle' />
        <span>Year of Study: {university} </span>
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