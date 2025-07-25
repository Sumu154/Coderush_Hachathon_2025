import React, { useContext, useEffect, useState } from 'react';
import Modal from 'react-modal';
import { IoCloudUpload } from "react-icons/io5";
import { AuthContext } from '../../contexts/AuthProvider';
// import { createSubmission } from '../../apis/submissionApi';
import { toast } from 'react-toastify';

import { MdOutlineUpdate } from 'react-icons/md';
import { updateAcademicInfo } from '../../apis/userApi';


Modal.setAppElement("#root");

const UpdateAcadmeicModal = ({ modalOpen, setModalOpen }) => {
  const { user } = useContext(AuthContext);
  const user_email = user.email;
  // //console.log('assignment_id: ', assignment_id);


  const handleUpdateAcademicInfo = async (e) => {
    e.preventDefault();

    // modal close
    setModalOpen(false);
    
    const form = new FormData(e.target);
    const user_uni = form.get('user_uni');
    const user_dep = form.get('user_dep');
    const user_prog = form.get('user_prog');
    const user_year = form.get('user_year');

    console.log(user_uni, user_dep, user_prog, user_year)

    const academic_info = { user_uni, user_dep, user_prog, user_year }
    const res = await updateAcademicInfo(user_email, academic_info)
    
    
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
            <label className="block mb-1 text-sm font-medium">University</label>
            <input type="text" name="user_uni" className="input w-full" required />
          </div>

          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium">Department</label>
            <input type="text" name="user_dep" className="input w-full" required />
          </div>

          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium">Program</label>
            <input type="text" name="user_prog" className="input w-full" required />
          </div>

          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium">Year of Study</label>
            <select name="user_year" className="input w-full" required>
              <option value="">Select Year</option>
              <option value="1st">1st</option>
              <option value="2nd">2nd</option>
              <option value="3rd">3rd</option>
              <option value="4th">4th</option>
            </select>
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

export default UpdateAcadmeicModal;



