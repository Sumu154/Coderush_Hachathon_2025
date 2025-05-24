import React, { useContext, useEffect, useState } from 'react';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import Lottie from 'lottie-react';
import { MdOutlinePayment } from "react-icons/md";

import processingL from '../../assets/Animations/processing.json'
import Swal from 'sweetalert2';
import { getPaymentIntent } from '../../apis/paymentApi';
// import { createEnrollment } from '../../apis/enrollmentApi';
import { AuthContext } from '../../contexts/AuthProvider';
import { toast } from 'react-toastify';
import StudentFeedbackModal from '../studentDashboard/StudentFeedbackModal';
// import { getTeacherName, updateUserEnrollment } from '../../apis/courseApi';


const PaymentForm = ( { service_id, service_price } ) => {
  // console.log(service_id, service_price)
  const { user } = useContext(AuthContext);
  const user_email = user.email;

  const stripe = useStripe();
  const elements = useElements();
  
  const [ error, setError ] = useState(null);
  const [ processing, setProcessing ] = useState(false);
  const [ success, setSuccess ] = useState(false);

  // feedback modal
  const [modalOpen, setModalOpen] = useState(false);

  const handlePayment = async (e) => {
    e.preventDefault();
    setProcessing(true);

    if(!stripe || !elements){
      setError("Stripe is not loaded");
      setProcessing(false);
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if(!cardElement){
      setError("Card details are not entered properly.");
      setProcessing(false);
      return;
    }


    try{
      // 1) clientSecret key ta generate 
      const data = await getPaymentIntent(service_price);
      const clientSecret = data.client_secret;
      const transactionId = data.transaction_id;
      console.log(clientSecret, transactionId);
    

      
      // 2) confirm payment with stripe
      const { error:confirmError, paymentIntent  } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { 
          card: cardElement,
          billing_details: {
            email: user_email,

          }
        },
      });

      // 3) confirm payment 
      if(confirmError) {
        setError(confirmError.message);
      } 
      else{
        //console.log("Payment Method:", paymentIntent.payment_method);
        setError(null);
        
        Swal.fire({
          title: "Thank You! Payment Completed.",
          icon: "success",
          customClass: {
            popup: 'small-modal'
          }
        }).then(() => {
          // Automatically open feedback modal after OK pressed
          setModalOpen(true);
        });
      }
    } 
    catch (e) {
      console.error("Error fetching clientSecret:", e);
    }

    setProcessing(false);
  }

  return (
    <div className='max-w-[420px] px-4 mx-auto '>
      <form className='' onSubmit={handlePayment}>
        <CardElement className=' border-[1px] border-dark/15 px-4 py-3 rounded-[2px] '></CardElement>

        <div className=' w-full '>
          { processing ? <Lottie animationData={processingL} loop={true} > </Lottie> 
          : <button type='submit' className='w-full flex gap-2 justify-center items-center text-white bg-pastle hover:bg-pastle/90 font-medium mt-8 py-[6px] rounded-[2px] '> <span className='mb-[2px] '> Pay now </span> <MdOutlinePayment className='text-2xl ' /> </button> }
          </div> 
      </form>

      <StudentFeedbackModal service_id={service_id} modalOpen={modalOpen} setModalOpen={setModalOpen} ></StudentFeedbackModal>
      {error && <p className="text-sm text-redd mt-2">{error}</p>}
      {success && <p className="text-sm text-dollargreen mt-2"> Payment Successful!</p>}
    </div>
  );
};

export default PaymentForm;