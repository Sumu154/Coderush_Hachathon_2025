import React, { useEffect, useState } from 'react';
import { MdStar, MdStarHalf, MdStarBorder } from "react-icons/md";
import { getUserByEmail, getUserImage } from '../../apis/userApi';

import AOS from 'aos';
import 'aos/dist/aos.css';

 
const FeedbackCard = ({ index, feedback }) => {
  const { user_email, service, feedback_rating, feedback_description } = feedback;
  const { service_title } = service;

  const [ user, setUser ] = useState('');  

  const fetchUserImage = async () => {
    const data = await getUserByEmail(user_email);
    setUser(data);
  }


  useEffect(() => {
    fetchUserImage();
  }, [])

  useEffect(() => {
    AOS.init({
      duration: 300,
      once: false,
      mirror: true, // enables when scrolling up as well
      // offset: window.innerHeight/3,
    });
  }, []);

  const { user_image, user_name } = user;


  const renderStars = () => {
    const fullStars = Math.floor(feedback_rating);
    const hasHalfStar = feedback_rating%1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar?1:0);

    return (
      <>
        { Array(fullStars).fill().map((_, i) => <MdStar key={i} className="text-orange text-xl" />)}
        { hasHalfStar && <MdStarHalf className="text-orange text-xl" />}
        { Array(emptyStars).fill().map((_, i) => <MdStarBorder key={i + fullStars + 1} className="text-orange text-xl" />)}
      </>
    );
  };
  


  return (
    <div data-aos="fade-up-right" data-aos-offset={(index+1)*100} data-aos-easing="ease-in-sine" className='text-dark bg-pastle/10 shadow-lg px-8 py-5' >
      <div className='flex gap-1 justify-center mb-3'>  {renderStars()}  </div>
      <p className='opacity-85 text-center font-semibold mb-2 text-[15px] '> {feedback_description} </p>
      <p className='opacity-90 text-center font-bold mb-4 text-lg '> {service_title} </p>
      <div className='flex items-center justify-center gap-6'>
        <div className='w-12 h-12 rounded-full overflow-hidden'> <img className='w-full h-full object-cover' src={user_image} alt="" />  </div>
        <div>
          <p className='opacity-90 font-semibold text-lg'> {user_name} </p>
          <p className='opacity-70 text-sm'> Student </p>
        </div>
      </div>
    </div>
  );
};

export default FeedbackCard;