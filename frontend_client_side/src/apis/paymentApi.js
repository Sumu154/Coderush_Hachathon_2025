import axiosInstance from "../config/axiosInstance";

export const getPaymentIntent = async (service_price) => {
  const res = await axiosInstance.post('/create-payment-intent', { service_price });
  return res.data;
}