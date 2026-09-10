"use client";

import { useCreditMutation } from "@/redux/api/creditApi";
import { usePaymentMutation } from "@/redux/api/paymentApi";
import { useSubscriptionDetailsMutation } from "@/redux/api/subscriptionApi";
import { useGetUserQuery } from "@/redux/api/userApi";
import { isToken } from "@/services/auth.service";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import Image from "next/image";
import React, { useRef, useState } from "react";
import { FaUser } from "react-icons/fa";
import { FaMinus, FaPlus } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";
import { HashLoader } from "react-spinners";
import { toast } from "react-toastify";
import paymentImg from "../../../../../public/images/payment.jpg";
import { useSettingsQuery } from "@/redux/api/settingsApi";

const BuyCreditPage = () => {
  const token = isToken();
  const {
    data: userData,
    isLoading: userDataLoading,
    refetch,
  } = useGetUserQuery(token);
  const [toggleCredit, setToggleCredit] = useState(false);
  const [updateCredit, setUpdateCredit] = useState(0);
  const [addCredit] = useCreditMutation();
  const [addSubscriptionDetails] = useSubscriptionDetailsMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [payment, { isLoading }] = usePaymentMutation();
  const stripe = useStripe();
  const elements = useElements();
  const [paymentInfo, setPaymentInfo] = useState<any>({});
  const [paymentIntent, setPaymentIntent] = useState<any>();

  const { data: settingsData, isLoading: settingsLoading } =
    useSettingsQuery(null);

  console.log(settingsData?.creditPrice);

  const creditData = userData?.payload[0];

  const handleAddCredit = async () => {
    const numberOfCredit = updateCredit;
    // console.log(numberOfCredit);
    const credit = {
      numberOfCredit,
    };
    try {
      const res: any = await addCredit({ credit, token });
      // console.log(res?.data?.payload);
      if (res?.data?.response === "Success") {
        // toast.success(res?.data?.message);
        setPaymentIntent(res?.data?.payload);
        setPaymentInfo(res?.data);
        setIsModalOpen(true);
      }

      if (res?.error) {
        toast.error(res?.error?.data?.message);
      }
    } catch (error) {
      console.error("An error occurred during adding:", error);
    }
  };

  const handlePayment = async (event: any) => {
    event.preventDefault();

    if (!stripe || !elements || !paymentInfo?.payload?.clientSecret) {
      return;
    }
    const cardElement = elements.getElement(CardElement);
    try {
      const paymentResult = await stripe.confirmCardPayment(
        paymentInfo?.payload?.clientSecret!,
        {
          payment_method: {
            card: cardElement!,
          },
        }
      );
      if (paymentResult.error) {
        toast.error("Something went wrong!");
      } else if (paymentResult.paymentIntent?.status === "succeeded") {
        if (paymentResult?.paymentIntent?.status === "succeeded") {
          // problem
          const paymentResponse = paymentResult?.paymentIntent;
          const response: any = await addSubscriptionDetails({
            data: paymentResponse,
            token,
          }).unwrap();
          if (response?.subscribedPlanStatus === "Active") {
            toast.success("Payment Successfully Done & Credit Refilled!");
          }
          refetch();
          setIsModalOpen(false);
          setToggleCredit(false);
        }
      }
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };

  if (userDataLoading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <HashLoader color="#5C4033" />
      </div>
    );
  }

  return (
    <>
      {creditData?.subscription ? (
        <div className="py-20 flex justify-center">
          <div className="bg-[#FEEBD4] dark:bg-gradient-to-br from-primary to-secondary lg:w-[60%] dark:text-white shadow-md mx-auto p-10 rounded space-y-4">
            <div className="">
              {creditData?.profileImage === null ? (
                <div className="text-7xl p-8 bg-amber-500 rounded-full w-fit mx-auto">
                  <FaUser />
                </div>
              ) : (
                <Image
                  src={`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/uploads/user-profile-image/${creditData?.profileImage}`}
                  // src="https://i.ibb.co.com/thBM8t0/avatar.jpg"
                  width={400}
                  height={400}
                  alt="Profile Image"
                  className="w-40 h-40 rounded-full block mx-auto"
                />
                // <Image
                //   src={"https://i.ibb.co.com/tb6jXRb/teacher1.png"}
                //   width={400}
                //   height={400}
                //   alt="Profile Image"
                //   className="w-40 h-40 rounded-full block mx-auto"
                // />
              )}
            </div>
            <div className="text-2xl font-semibold text-center">
              {creditData?.fullName}
            </div>
            <div>
              {toggleCredit && (
                <h5 className="text-xl font-semibold text-center">
                  Gesamtpreis für Downloads :{" "}
                  {updateCredit * settingsData?.creditPrice}
                </h5>
              )}
            </div>
            <div className="text-center">
              {toggleCredit ? (
                <div className="flex items-center justify-center gap-3">
                  <button
                    disabled={updateCredit === 0}
                    onClick={() => setUpdateCredit(updateCredit - 1)}
                    className="bg-secondary disabled:bg-secondary/50 p-3 rounded text-white active:scale-95"
                  >
                    <FaMinus />
                  </button>
                  <input
                    value={updateCredit}
                    onChange={(event) =>
                      setUpdateCredit(parseInt(event.target.value) || 0)
                    }
                    type="text"
                    className="bg-white dark:text-black w-full lg:w-2/5 border focus:outline-none border-slate-400 px-5 text-center py-2 rounded"
                  />
                  <button
                    onClick={() => setUpdateCredit(updateCredit + 1)}
                    className="bg-secondary p-3 rounded text-white active:scale-95"
                  >
                    <FaPlus />
                  </button>
                </div>
              ) : (
                <p className="text-xl font-medium">
                  Aktuelle Downloads zur Verfügung:{" "}
                  {creditData?.subscription?.remainingDownloadAttempt}
                </p>
              )}
            </div>
            <div className="text-center">
              {toggleCredit ? (
                <button
                  onClick={handleAddCredit}
                  className="bg-secondary  text-white px-6 py-3 rounded-sm uppercase"
                >
                  Buchen
                </button>
              ) : (
                <button
                  onClick={() => setToggleCredit(true)}
                  className="bg-secondary text-white px-6 py-3 rounded-sm uppercase"
                >
                  Downloads nachkaufen
                </button>
              )}
            </div>
          </div>

          {/* Daisy UI Modal */}
          <input
            type="checkbox"
            id="my-modal"
            className="modal-toggle"
            checked={isModalOpen}
            readOnly
          />
          <div className="modal">
            <div className="modal-box bg-[#ffedd5]">
              <form method="dialog" className="w-full text-right">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="bg-[#FEEBD4] dark:bg-[#FED7AA] rounded-full p-2"
                >
                  <IoMdClose />
                </button>
              </form>

              <div className="space-y-4 mt-3">
                <div>
                  <Image
                    src={paymentImg}
                    width={400}
                    height={400}
                    alt=""
                    className="w-full rounded-md"
                  />
                </div>
                <div className="">
                  <div className="flex justify-between">
                    <p className="text-lg">Buchungsdetails:</p>
                    <div className="flex items-center gap-5">
                      <p>
                        <span className="font-medium">Betrag:</span> &#8364;
                        {paymentIntent?.amount / 100}
                      </p>
                      <p>
                        <span className="font-medium">Downloads:</span>{" "}
                        {paymentIntent?.credit}
                      </p>
                    </div>
                  </div>

                  <div className="py-4">
                    <p className="mb-3 text-lg">Kreditkarte</p>
                    <CardElement id="card" />
                  </div>

                  <div className="modal-action">
                    <button
                      onClick={(e) => handlePayment(e)}
                      className="bg-[#5C4033] text-white rounded-full py-3 px-8 shadow-lg transition-transform transform hover:scale-105 hover:bg-[#7a543e] focus:outline-none focus:ring-2 focus:ring-[#5C4033] focus:ring-opacity-50"
                    >
                      {isLoading ? "Laden..." : "Bezahlen"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-fit p-4 rounded mx-auto bg-red-400 text-red-800">
          Bitte schließen Sie zunächst ein Abonnement ab!
        </div>
      )}
    </>
  );
};

export default BuyCreditPage;
