import React, { useContext, useEffect, useState } from 'react';
import Modal from 'react-modal';
import { IoCloudUpload } from "react-icons/io5";
import { AuthContext } from '../../contexts/AuthProvider';
// import { createSubmission } from '../../apis/submissionApi';
import { toast } from 'react-toastify';

import { MdOutlineUpdate } from 'react-icons/md';
import { updateAcademicInfo, updatePrivateInfo } from '../../apis/userApi';


Modal.setAppElement("#root");

const UpdatePrivateModal = ({ modalOpen, setModalOpen }) => {
  const { user } = useContext(AuthContext);
  const user_email = user.email;
  // //console.log('assignment_id: ', assignment_id);


  const handleUpdateAcademicInfo = async (e) => {
    e.preventDefault();

    // modal close
    setModalOpen(false);
    
    const form = new FormData(e.target);
    const user_dob = form.get('user_dob');
    const user_phone = form.get('user_phone');

    console.log(user_dob, user_phone)

    const private_info = { user_dob, user_phone }
    const res = await updatePrivateInfo(user_email, private_info)   
  }

  return (
    <div className=''>
      <Modal
        isOpen={modalOpen}
        onRequestClose={() => setModalOpen(false)}
        contentLabel="Update Academic Info Modal"
        className="bg-white p-6 rounded-lg w-[300px] sm:w-[360px] md:w-[390px] lg:w-[420px] mx-auto mt-20 shadow-lg"
        overlayClassName="fixed inset-0 bg-dark/30 flex justify-center items-center"
      >
        <h3 className="font-Montserrat text-center font-semibold opacity-80 text-xl md:text-2xl mb-7"> Your Academic Informations </h3>
        
        <form onSubmit={handleUpdateAcademicInfo}>
          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium"> Date of Birth: </label>
            <input type="text" name="user_dob" className="input w-full" required />
          </div>

          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium"> Phone: </label>
            <input type="text" name="user_phone" className="input w-full" required />
          </div>

          <button type="submit" className="font-medium flex justify-center items-center gap-2 text-white bg-orange hover:bg-orange/95 w-full rounded-[2px] py-[6px] mt-4" >
            <MdOutlineUpdate className="text-xl" />
            <span className="mb-[3px]">Update now </span>
          </button>
        </form>
      </Modal>

    </div>
  );
};

export default UpdatePrivateModal;



