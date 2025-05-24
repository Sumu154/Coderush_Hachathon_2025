import React from 'react';
import AddServiceForm from '../components/servicesComponents/AddServiceForm';
import AddServiceImage from '../components/servicesComponents/AddServiceImage';

const AddServicePage = () => {
  return (
    <div className='flex justify-between gap-4 mt-16' >
      <AddServiceForm></AddServiceForm>
      <AddServiceImage></AddServiceImage>
    </div>
  );
};

export default AddServicePage;