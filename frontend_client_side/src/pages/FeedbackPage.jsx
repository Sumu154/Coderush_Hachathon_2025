import React, { useEffect, useState } from 'react';
import FeedbackCard from '../components/allCards/FeedbackCard';
import { Link } from 'react-router-dom';
import { getFeedbacks } from '../apis/feedbackApi';



const FeedbackPage = () => {

  const [ feedbacks, setFeedbacks ] = useState([]);

  const fetchFeedbacks = async () => {
    const data = await getFeedbacks();
    setFeedbacks(data);
  }

  
  useEffect(() => {
    fetchFeedbacks();
  }, [])

  

  return (
    <div className='w-[80%] mx-auto dark:text-white mt-8 '>
    <div className="mx-auto mt-12 ">
      <h3 className="font-Montserrat text-center font-semibold opacity-80 text-2xl md:text-3xl lg:text-4xl mb-1 "> Feedback of users </h3>
      <p className="max-w-[750px] mx-auto text-center mb-12 px-4 opacity-80 text-[15px] lg:text-base "> Review and provide constructive feedback on student assignments to help them improve and grow in their learning journey </p>
      
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6 '>
        { feedbacks.map((it, index) => {
          return <FeedbackCard  key={index} index={index} feedback={it} ></FeedbackCard>
        }) }
      </div>

      <div className='flex justify-end mt-3'> <Link className='border-b-orange border-b-[2px] px-3'> See all </Link>  </div> 
    </div>
  </div>
  );
};

export default FeedbackPage;