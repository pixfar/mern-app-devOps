import { usePaymentMutation } from "@/redux/api/paymentApi";
import { useSubscriptionMutation } from "@/redux/api/subscriptionApi";
import { useGetSubscriptionPlanByIDQuery } from "@/redux/api/subscriptionPlanApi";
import { isToken } from "@/services/auth.service";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { HashLoader } from "react-spinners";
import { toast } from "react-toastify";

const Modal = ({ planId }: any) => {
  const token = isToken();
  const [paymentInfo, setPaymentInfo] = useState<any>({});
  const [successPaymentInfo, setSuceessPaymentInfo] = useState<any>();
  const stripe = useStripe();
  const elements = useElements();
  const [payment, { isLoading }] = usePaymentMutation();
  const [subscription, { isLoading: sc }] = useSubscriptionMutation();
  const { data, isLoading: getSubscriptionLoading } =
    useGetSubscriptionPlanByIDQuery(planId);
  // Ref to control modal
  const modalRef = useRef<HTMLDialogElement>(null);
  const subscriptionPlanId = planId;
  const subscriptionPlanData = data?.payload;

  // console.log("paymentInfo", paymentInfo);

  useEffect(() => {
    const fetchPaymentInfo = async () => {
      const res = await payment({ subscriptionPlanId, token });
      setPaymentInfo(res?.data);
    };
    {
      subscriptionPlanId && fetchPaymentInfo();
    }
  }, [subscriptionPlanId, payment, token]);

  const handlePayment = async (event: any) => {
    event.preventDefault();

    if (!stripe || !elements || !paymentInfo?.payload?.clientSecret) {
      return;
    }
    const cardElement = elements.getElement(CardElement);
    const clientSecret = paymentInfo?.payload?.clientSecret;
    try {
      const paymentResult = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement!,
        },
      });
      if (paymentResult.error) {
        toast.error("Something went wrong!");
      } else if (paymentResult.paymentIntent?.status === "succeeded") {
        setSuceessPaymentInfo(paymentResult.paymentIntent);
      }
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };

  useEffect(() => {
    const handleSubscription = async () => {
      try {
        const res = await subscription({
          successPaymentInfo,
          subscriptionPlanId,
          token,
        }).unwrap();
        // Close the modal after successful payment
        if (modalRef.current) {
          modalRef.current.close();
          toast.success("Payment Successfull!");
        }
      } catch (error) {
        console.error("Subscription API call failed", error);
      }
    };

    if (subscriptionPlanId && successPaymentInfo) {
      handleSubscription();
    }
  }, [subscriptionPlanId, successPaymentInfo, subscription, token]);

  return (
    <dialog
      ref={modalRef}
      id="my_modal_5"
      className="modal modal-bottom sm:modal-middle"
    >
      <div className="modal-box !max-w-3xl bg-[#FED7AA] dark:bg-amber-200">
        <div className="flex justify-between items-center mb-5">
          <h3 className="font-bold text-lg">MeinJustus Abo Buchung</h3>
          <form method="dialog">
            <button className="bg-[#FEEBD4] dark:bg-[#FED7AA] rounded-full p-2">
              <IoMdClose />
            </button>
          </form>
        </div>
        <div className="flex items-center gap-[3%]">
          <div className="w-[52%]">
            {getSubscriptionLoading ? (
              <div className="flex justify-center items-center h-[50vh]">
                <HashLoader color="#5C4033" />
              </div>
            ) : (
              <div className="mx-auto flex flex-col-reverse md:flex-row-reverse justify-center items-center gap-10 md:gap-0">
                <div
                  className={`bg-[#FEEBD4] dark:bg-amber-300 shadow-lg border-primary px-5 duration-300 py-10 relative`}
                >
                  <div className=" min-h-[400px] max-h-[500px]">
                    <h2 className="text-2xl font-bold mb-2">
                      {subscriptionPlanData?.name}
                    </h2>
                    <p className="mb-5">
                      {subscriptionPlanData?.description?.benefits}
                    </p>
                    <div className="text-3xl font-bold mb-5">
                      €{subscriptionPlanData?.finalPrice}
                      <span className="text-lg font-normal"></span>
                    </div>
                    {/* <p className="mb-5">
                      Pause or cancel anytime. 7 days money-back guarantee
                    </p> */}
                  </div>
                  <div className="space-x-5 text-center">
                    <Link href="/agb">AGB</Link>
                    <Link href="/datenschutz">Datenschutz</Link>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="w-[45%]">
            <div className="py-4">
              <p className="mb-3 text-lg">Kreditkartennummer</p>
              <CardElement id="card" />
            </div>

            <div className="modal-action">
              <button
                onClick={(e) => handlePayment(e)}
                className="bg-[#5C4033] text-white rounded-full py-3 px-8 shadow-lg transition-transform transform hover:scale-105 hover:bg-[#7a543e] focus:outline-none focus:ring-2 focus:ring-[#5C4033] focus:ring-opacity-50"
              >
                {isLoading ? "Laden..." : "Zahlungspflichtig buchen"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </dialog>
  );
};

export default Modal;
