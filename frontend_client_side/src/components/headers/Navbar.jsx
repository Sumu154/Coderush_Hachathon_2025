import '../../assets/stylesheets/navbar.css'
import logo from '../../assets/logos/iut-logo.jfif'

import React, { useContext } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { IoMdLogOut } from "react-icons/io";
import { LuLayoutDashboard } from "react-icons/lu";
import { RiMenu2Fill } from "react-icons/ri";


import ThemeToggle from '../shared/ThemeToggle';
import { AuthContext } from '../../contexts/AuthProvider';
import { clearToken } from '../../apis/authApi';


const Navbar = () => {
  const { user, signOutUser } = useContext(AuthContext);
  //console.log('user', user.photoURL);

  const navigate = useNavigate();
  const path = useLocation().pathname;

  const handleSignOut = async (e) => {
    e.preventDefault();
    try{
      await signOutUser();

      // token clear
      const res2 = await clearToken();
      // //console.log(res2.data);

      navigate('/auth/login');
    }
    catch(e){
      // //console.log(e);
    }

  }

  const links = <>
    <li> <NavLink to="/"> Home </NavLink> </li>
    <li> <NavLink to="/services"> Services </NavLink> </li>
    <li> <NavLink to="/addServices"> Add services </NavLink> </li>
  </>


  return (
    <div className='fixed top-0 left-0 z-50 w-full'>
      <div id='navbar' className='bg-dark/50 dark:bg-darkbackground shadow-lg   '>
        <div  className="navbar w-[90%] mx-auto  ">
          <div className="navbar-start">
            <div className="dropdown mr-2 ">
              <div tabIndex={0} role="button" className="text-white text-2xl lg:hidden  dark:text-white"> <RiMenu2Fill /> </div>
              <ul tabIndex={0}  className="menu menu-sm dropdown-content bg-dark/90 rounded-box z-[1] mt-3 w-40 p-2 shadow    dark:bg-cardbackground dark:text-white">
                {links}
              </ul>
            </div>
            <div className='flex gap-2 items-center'>
              <img className='w-7 h-7 rounded-full' src={logo} alt="" />
              <p className='font-JotiOne text-white text-xl lg:text-2xl'> CampusMart </p>
            </div>
          </div>
          <div className="navbar-center hidden lg:flex">
            <ul className="menu menu-horizontal px-1   dark:text-white">
              {links}
            </ul>
          </div>
          {/* navbar end */}
          <div className="navbar-end">
            <ThemeToggle></ThemeToggle>
            {user ? <div className='flex gap-4 items-center'>
              <div className="dropdown dropdown-end">
                <div tabIndex={0} role="button" className="w-9 h-9"> <img className='rounded-full' src={user.photoURL} alt="" />  </div>
                <ul tabIndex={0} className="dropdown-content menu bg-dark/80 rounded-box z-1 w-44 p-2 shadow-sm">
                  <li className='border-b-[1px] border-white/20'><a> <p className=''> {user.displayName} </p> </a></li>
                  <li> <Link to='/dashboard'> <span className='flex items-center gap-2 hover:font-semibold'> <span className='text-xl'> <LuLayoutDashboard className='text-lg' /> </span> Dashboard </span> </Link>  </li>
                  <li> <Link onClick={handleSignOut} to=''> <span className='flex items-center gap-2 hover:font-semibold'> <span className='text-xl'> <IoMdLogOut /> </span> Logout </span> </Link>  </li>
                </ul>
              </div>
            </div> 
            // : user na thakle eta 
            :<div className='flex gap-4'>
              <button className={`text-sm  font-medium px-3 md:px-4 py-1 md:py-[6px] rounded-lg hover:bg-orange hover:text-white     ${path==='/auth/login' ? 'bg-orange text-white' : 'text-orange border-orange border-[1px]'} `}> <Link to='/auth/login'> Login </Link> </button> 
              <button className={`text-sm font-medium px-3 md:px-4 py-1 md:py-[6px] rounded-lg hover:bg-orange hover:text-white    ${path==='/auth/register' ? 'bg-orange text-white' : 'text-orange border-orange border-[1px]' } `}> <Link to='/auth/register'> Register </Link> </button>
            </div>              
            } 
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;