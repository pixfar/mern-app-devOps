import { usePaymentMutation } from "@/redux/api/paymentApi";
import { useSubscriptionMutation } from "@/redux/api/subscriptionApi";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { toast } from "react-toastify";

interface PaymentInfo {
  clientSecret?: string;
  amount: number;
  currency: string;
}

const Modal2 = ({ selectedPlan }: any) => {
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>();
  const [successPaymentInfo, setSuceessPaymentInfo] = useState<any>();
  const stripe = useStripe();
  const elements = useElements();
  const [payment, { isLoading }] = usePaymentMutation();
  const [subscription, { isLoading: sc }] = useSubscriptionMutation();

  const subscriptionPlanId = selectedPlan?.payload?._id;

  useEffect(() => {
    const fetchPaymentInfo = async () => {
      const token = localStorage.getItem("access_token");
      const res = await payment({ subscriptionPlanId, token });
      setPaymentInfo(res?.data);
    };
    {
      subscriptionPlanId && fetchPaymentInfo();
    }
  }, [subscriptionPlanId, payment]);

  const handlePayment = async (event: any) => {
    event.preventDefault();
    if (!stripe || !elements || !paymentInfo?.clientSecret) {
      return;
    }
    const cardElement = elements.getElement(CardElement);
    try {
      const paymentResult = await stripe.confirmCardPayment(
        paymentInfo?.clientSecret!,
        {
          payment_method: {
            card: cardElement!,
          },
        }
      );
      if (paymentResult.error) {
        toast.error("Something went wrong!");
      } else if (paymentResult.paymentIntent?.status === "succeeded") {
        setSuceessPaymentInfo(paymentResult.paymentIntent);
        toast.success("Payment Successfull!");
      }
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };

  useEffect(() => {
    const handleSubcription = async () => {
      const token = localStorage.getItem("access_token");
      const res = await subscription({
        successPaymentInfo,
        subscriptionPlanId,
        token,
      });
    };
    {
      subscriptionPlanId && successPaymentInfo && handleSubcription();
    }
  }, [subscriptionPlanId, subscription, successPaymentInfo]);

  return (
    <dialog id="my_modal_6" className="modal modal-bottom sm:modal-middle">
      <div className="modal-box">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-lg">Hello!</h3>
          <form method="dialog">
            <button className="bg-gray-200 rounded-full p-2">
              <IoMdClose />
            </button>
          </form>
        </div>
        <p className="py-4">Proceed the payment!</p>

        <div>
          <label htmlFor="card">Card Details</label>
          <CardElement id="card" />
        </div>

        <div className="modal-action">
          <button onClick={handlePayment} className="btn bg-primary">
            {isLoading ? "Laden..." : "Bezahlen"}
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default Modal2;
