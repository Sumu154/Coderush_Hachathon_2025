import React, { useState } from 'react';
import AddServiceForm from '../components/servicesComponents/AddServiceForm';

const AddServicePage = () => {
  const [ service_image, setService_image ] = useState({})
  const [ service_info, setService_info ] = useState({})

  


  return (
    <div className=' mt-[100px] w-[80%] mx-auto '>
      <div className='flex justify-center'> <h3 className='px-3 text-center  border-b-[2px] border-pastle font-semibold mb-8 text-2xl md:text-3xl'> Add Service </h3> </div>
     
      <AddServiceForm></AddServiceForm>

    </div>
    
  );
};

export default AddServicePage;

