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
