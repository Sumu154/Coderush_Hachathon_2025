import axiosInstance from "../config/axiosInstance";


// create user in database
export const createService = async (service) => {
  const res = await axiosInstance.post("/services", service);
  return res.data;
}

// get all the users
export const getServices = async () => {
  const res = await axiosInstance.get('/services');
  return res.data;
}

// get service by id
export const getServiceById = async (service_id) => {
  const res = await axiosInstance.get(`/services/${service_id}`);
  console.log('called')
  return res.data;
}

// get service_price
export const getServicePrice = async (service_id) => {
  const res = await axiosInstance.get(`/services/${service_id}/service_price`);
  console.log('called')
  return res.data;
}

