import React from 'react';
// import { Helmet } from 'react-helmet';
import ProfileCard from '../components/allCards/ProfileCard';
import ProfileSideInformations from '../components/dashboardComponents/ProfileSideInformations';
import ProfileAcademicInfo from '../components/studentDashboard/ProfileAcademicInfo';

const ProfilePage = () => {
  return (
    <div>
      {/* <Helmet>
        <title> Dashboard | Profile </title>
      </Helmet> */}

      <div className=''>
        <div className='flex justify-center flex-col md:flex-row gap-12 mb-6'>
          <div className='max-w-[350px] w-[100%] md:w-[48%] lg:w-[38%] '><ProfileCard></ProfileCard> </div>
          <div className='max-w-[350px] w-[100%] md:w-[48%] lg:w-[38%] '> <ProfileAcademicInfo> <ProfileAcademicInfo/></ProfileAcademicInfo> </div>
        </div>
      </div>
      

    </div>
  );
};

export default ProfilePage;