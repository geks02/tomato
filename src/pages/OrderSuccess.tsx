import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { utilsService } from "../main";
import toast from "react-hot-toast";
import axios from "axios";

const OrderSuccess = () => {
  const [params] = useSearchParams();
  const sessionId = params.get("session_id");
  useEffect(() => {
    const verifyPayment = async () => {
      if (!sessionId) {
        return;
      }
      try {
        await axios.post(`${utilsService}/api/payment/stripe/verify`, {
          sessionId,
        });
        toast.success("Payment Successfully🎉");
      } catch (error) {
        toast.error("Stripe Verification Failed");
        console.log(error);
      }
    };
    verifyPayment();
  }, []);
  return (
    <div className="flex h-[20vh] items-center justify-center ">
      <h1 className="text-2xl font-bold text-green-600  ">
        Payment Successfully🎉
      </h1>
    </div>
  );
};

export default OrderSuccess;
