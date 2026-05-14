import { useEffect, useState } from "react";
import { riderService } from "../main";
import axios from "axios";
import toast from "react-hot-toast";

interface Props {
  orderId: string;
  onAccepted: () => void;
}
const RiderOrderRequest = ({ orderId, onAccepted }: Props) => {
  const [accepting, setAccepting] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(10);
  // 1. Effect to handle the ticking timer
  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        // Pure function: strictly handles calculating the next number
        if (prev <= 1) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Cleanup on unmount
    return () => clearInterval(interval);
  }, []); // Empty dependency array: interval sets up once and runs independently

  // 2. Effect to handle what happens when the timer reaches 0
  useEffect(() => {
    if (secondsLeft === 0) {
      onAccepted();
    }
  }, [secondsLeft, onAccepted]);

  const acceptOrder = async () => {
    setAccepting(true);
    try {
      await axios.post(
        `${riderService}/api/rider/accept/${orderId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      toast.success("Order Accepted");
      onAccepted();
    } catch (error: any) {
      toast.error(error.response.data.message);
      onAccepted();
    } finally {
      setAccepting(false);
    }
  };
  return (
    <div className="rounded-xl bg-white p-4 shadow-sm border border-green-300 space-y-3 ">
      <p className="text-center text-xs font-semibold text-red-600">
        Accept within{secondsLeft}
      </p>
      <p className="text-center text-xs font-semibold text-green-600">
        New Delivery Request
      </p>
      <p className="text-xs text-gray-600">
        Order ID: <b>{orderId.slice(-6)}</b>
      </p>
      <button
        className="w-full rounded-lg bg-green-600 py-2 text-sm font-semibold text-white
         hover:bg-green-700 disabled:opacity-50"
        disabled={accepting}
        onClick={acceptOrder}
      >
        {accepting ? "Accepting..." : "Accept Order"}
      </button>
    </div>
  );
};

export default RiderOrderRequest;
