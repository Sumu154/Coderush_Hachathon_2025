import React, { useContext, useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { CgProfile } from "react-icons/cg";
import { MdClass } from "react-icons/md";
import { MdOutlineAssignment } from "react-icons/md";
import { MdLibraryAdd } from "react-icons/md";
import { PiSidebarDuotone } from "react-icons/pi";
import { MdRequestPage } from "react-icons/md";
import { MdFeedback } from "react-icons/md";
import { HiUsers } from "react-icons/hi2";
import Drawer from 'react-modern-drawer'
import 'react-modern-drawer/dist/index.css'
import { AuthContext } from '../../contexts/AuthProvider';
import { getUserByEmail } from '../../apis/userApi';



const Sidebar =  () => {
  const { user } = useContext(AuthContext);
  const user_email = user.email;
  const [ user_role, setUser_role ] = useState('')

  useEffect(() => {
    const fetchUser = async () => {
      const data = await getUserByEmail(user_email);
      //console.log(data);

      setUser_role(data.user_role);
    }
    fetchUser();
  }, [])

  const [isOpen, setIsOpen] = useState(false);


  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  }


  const studentLinks = <>
    <li> <NavLink to="/dashboard"> <div className='flex gap-2 items-center  lg:text-[17px] mb-2 hover:font-semibold'> <CgProfile  className='text-lg' /> <span> Profile </span> </div> </NavLink> </li>
    <li> <NavLink to="/dashboard/message" className={({ isActive }) => isActive ? "font-semibold" : ""}> <div className='flex gap-2 items-center  lg:text-[17px] mb-2 hover:font-semibold'> <MdClass  className='text-xl' /> <span> Message </span> </div> </NavLink> </li>
    {/* <li> <NavLink to="/dashboard/studentAssignments" className={({ isActive }) => isActive ? "font-semibold" : ""}> <div className='flex gap-2 items-center  lg:text-[17px] mb-2 hover:font-semibold'> <MdOutlineAssignment className='text-xl'  /> <span> Assignments </span> </div> </NavLink> </li> */}
    {/* <li> <NavLink to="/dashboard/studentOrders" className={({ isActive }) => isActive ? "font-semibold" : ""}> <div className='flex gap-2 items-center  lg:text-[17px] mb-2 hover:font-semibold'> <BiSolidPurchaseTag className='text-xl'  /> <span> Orders </span> </div> </NavLink> </li>  */}
  </>

  const adminLinks = <>
  <li> <NavLink to="/dashboard" > <div className='flex gap-2 items-center text-[17px] mb-2 hover:font-semibold'> <CgProfile className='text-lg' /> <span> Profile </span> </div> </NavLink> </li>
  <li> <NavLink to="/dashboard/message" className={({ isActive }) => isActive ? "font-semibold" : ""}> <div className='flex gap-2 items-center  lg:text-[17px] mb-2 hover:font-semibold'> <MdClass  className='text-xl' /> <span> Message </span> </div> </NavLink> </li>
  <li> <NavLink to="/dashboard/feedbacks" className={({ isActive }) => isActive ? "font-semibold" : ""}> <div className='flex gap-2 items-center  lg:text-[17px] mb-2 hover:font-semibold'> <MdFeedback className='text-xl'/> <span> View feedbacks </span> </div> </NavLink> </li>
  <li> <NavLink to="/dashboard/users" className={({ isActive }) => isActive ? "font-semibold" : ""}> <div className='flex gap-2 items-center  lg:text-[17px] mb-2 hover:font-semibold'> <HiUsers className='text-xl'/> <span> View users </span> </div> </NavLink> </li>
  </>

  // const teacherLinks = <>
  // <li> <NavLink to="/dashboard"> <div className='flex gap-2 items-center  lg:text-[17px] mb-2 hover:font-semibold'> <CgProfile className='text-lg' /> <span> Profile </span> </div> </NavLink> </li>
  // <li> <NavLink to="/dashboard/addClass" className={({ isActive }) => isActive ? "font-semibold" : ""}> <div className='flex gap-2 items-center  lg:text-[17px] mb-2 hover:font-semibold'> <MdLibraryAdd className='text-xl' /> <span> Add class </span> </div> </NavLink> </li>
  // <li> <NavLink to="/dashboard/teacherClasses" className={({ isActive }) => isActive ? "font-semibold" : ""}> <div className='flex gap-2 items-center  lg:text-[17px] mb-2 hover:font-semibold'> <MdClass className='text-xl' /><span> My classes </span> </div> </NavLink> </li>
  // </>

  return (
    <div className=''>
      <div className='hidden md:block w-44 lg:w-52 bg-pastle text-white  md:min-h-screen '>
        <ul className='list-none pt-28 ml-4 lg:ml-8  '>
        {user_role==='student' ? studentLinks 
        // :user_role==='teacher' ? teacherLinks
        :user_role==='admin' ? adminLinks
        : ''
        }
        </ul>
      </div>

      {/* drawer -> for mobile device */}
      {/* <div className='md:hidden'>
        <div className='bg-purple p-2 ml-3 rounded-full mt-20 '> <FaAngleRight className='text-2xl text-white' /> </div>
      </div> */}

      <div onClick={toggleDrawer} className='md:hidden text-purple  m-4 pl-4 mt-20 '> <PiSidebarDuotone className='text-3xl  ' /> </div>
      <Drawer style={{backgroundColor: '#433878', width: '176px'}} open={isOpen} onClose={toggleDrawer} direction="left">
        <div className="text-white min-h-screen p-4">
        <ul className='list-none pt-28 ml-4 lg:ml-8  '>
        {user_role==='student' ? studentLinks 
        // :user_role==='teacher' ? teacherLinks
        :user_role==='admin' ? adminLinks
        : ''
        }
        </ul>
        </div>
      </Drawer>
      
    </div>
  );
};

export default Sidebar;