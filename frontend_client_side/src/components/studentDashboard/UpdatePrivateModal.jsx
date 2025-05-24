import React, { useContext, useState } from 'react';
import Modal from 'react-modal';
import { IoCloudUpload } from "react-icons/io5";
import { AuthContext } from '../../contexts/AuthProvider';
import { toast } from 'react-toastify';
import { MdOutlineUpdate } from 'react-icons/md';
import { updatePrivateInfo } from '../../apis/userApi';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

Modal.setAppElement("#root");

const UpdatePrivateModal = ({ modalOpen, setModalOpen }) => {
  const { user } = useContext(AuthContext);
  const user_email = user.email;

  const [dob, setDob] = useState(null); // for DatePicker

  const handleUpdateAcademicInfo = async (e) => {
    e.preventDefault();

    const form = new FormData(e.target);
    const user_phone = form.get('user_phone');
    const user_dob = dob ? dob.toISOString() : null;

    if (!user_dob) {
      toast.error("Please select a valid date of birth.");
      return;
    }

    const private_info = { user_dob, user_phone };

    try {
      const res = await updatePrivateInfo(user_email, private_info);
      if (res.success) {
        toast.success("Private info updated successfully!");
      } else {
        toast.error("Failed to update private info.");
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error("An error occurred while updating.");
    }

    setModalOpen(false); // Close modal after update
  };

  return (
    <div>
      <Modal
        isOpen={modalOpen}
        onRequestClose={() => setModalOpen(false)}
        contentLabel="Update Private Info Modal"
        className="bg-white p-6 rounded-lg w-[300px] sm:w-[360px] md:w-[390px] lg:w-[420px] mx-auto mt-20 shadow-lg"
        overlayClassName="fixed inset-0 bg-dark/30 flex justify-center items-center"
      >
        <h3 className="font-Montserrat text-center font-semibold opacity-80 text-xl md:text-2xl mb-7">
          Your Private Information
        </h3>

        <form onSubmit={handleUpdateAcademicInfo}>
          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium">Phone:</label>
            <input
              type="text"
              name="user_phone"
              className="input w-full"
              required
            />
          </div>
          
          <div className="mb-4 w-full">
            <label className="block mb-1 text-sm font-medium">Date of Birth:</label>
            <DatePicker
              selected={dob}
              onChange={(date) => setDob(date)}
              className="input w-full"
              dateFormat="dd/MM/yyyy"
              placeholderText="Select your birth date"
              maxDate={new Date()} // restrict to today or earlier
              showMonthDropdown
              showYearDropdown
              dropdownMode="select"
              required
            />
          </div>

          <button
            type="submit"
            className="font-medium flex justify-center items-center gap-2 text-white bg-orange hover:bg-orange/95 w-full rounded-[2px] py-[6px] mt-4"
          >
            <MdOutlineUpdate className="text-xl" />
            <span className="mb-[3px]">Update now</span>
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default UpdatePrivateModal;
