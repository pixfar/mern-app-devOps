"use client";

import Modal from "@/components/Shared/Modal/Modal";
import {
  useGetSubscriptionPlanQuery,
  useSubscriptionPlanMutation,
} from "@/redux/api/subscriptionPlanApi";
import { useGetUserQuery } from "@/redux/api/userApi";
import { isToken } from "@/services/auth.service";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { HashLoader } from "react-spinners";

const ActivePlan = () => {
  const token = isToken();
  const { data: userData, isLoading: userDataLoading } = useGetUserQuery(token);
  const { data: subscriptionPlanData, isLoading: subscriptionLoading } =
    useGetSubscriptionPlanQuery(token);
  const [planId, setPlanId] = useState<string | null>(null);
  const router = useRouter();
  const [subscriptionPlan, { isLoading, isSuccess, error }] =
    useSubscriptionPlanMutation();

  const currentPlanId =
    userData?.payload[0]?.subscription?.currentPlan?.subscriptionPlan?._id;

  const planStatus = userData?.payload[0]?.subscription?.subscribedPlanStatus;

  // console.log(subscriptionPlanData?.payload);

  const expirationDate = new Date(
    userData?.payload[0]?.subscription?.currentPlan?.endDate
  );
  const currentDate = new Date();

  const handleSubscribe = (id: string) => {
    if (!token) {
      router.push("/signin");
      return;
    }
    setPlanId(id);
  };

  if (userDataLoading || subscriptionLoading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <HashLoader color="#5C4033" />
      </div>
    );
  }

  return (
    <div className={`${planStatus === "Active" ? "py-20" : "py-16"} px-4`}>
      {<Modal planId={planId} />}
      <div className="">
        {planStatus !== "Active" && (
          <div className="bg-red-400 w-full px-5 py-3 mb-6 text-red-800 rounded dark:bg-orange-900 dark:text-white">
            Das Datum Ihres aktuellen Plans ist abgelaufen. Bitte wählen Sie
            einen Plan...
          </div>
        )}
        <div
          className={`mx-auto flex flex-col lg:flex-row justify-center items-center gap-10 md:gap-6`}
        >
          {subscriptionPlanData?.payload
            ?.filter((plan: any) => plan.isPublic)
            ?.map((plan: any) => (
              <div
                key={plan?._id}
                className={`bg-orange-100 dark:bg-gray-800 dark:text-white ${
                  subscriptionPlanData?.payload.length === 1 && "lg:w-[25%]"
                } ${
                  planStatus !== "Active"
                    ? ""
                    : currentPlanId !== plan?._id
                    ? "blur-[1.5px] min-w-[30%] cursor-default"
                    : "max-w-[33%] rounded-md"
                } dark:bg-primary shadow-lg border-primary px-10 duration-300 py-10 border relative`}
              >
                <div className=" min-h-[400px] max-h-[500px]">
                  <h2 className="text-2xl font-bold mb-2">{plan?.name}</h2>
                  <p className="mb-5">{plan?.description?.benefits}</p>
                  <div className="text-3xl font-bold mb-5">
                    &#8364;{plan?.finalPrice}
                    <span className="text-lg font-normal"></span>
                  </div>
                  {/* <p className="mb-5">
                    Pause or cancel anytime. 7 days money-back guarantee
                  </p> */}
                  <ul className="mb-5 space-y-1">
                    {Object.values(plan?.description)?.map((i, index) => (
                      <li key={index}>✔ {i as string}</li>
                    ))}
                  </ul>
                </div>
                {planStatus !== "Active" && (
                  <button
                    onClick={() => {
                      if (plan?.finalPrice > 0) {
                        handleSubscribe(plan?._id);
                        const modal = document.getElementById(
                          "my_modal_5"
                        ) as HTMLDialogElement;
                        if (modal) {
                          modal.showModal();
                        }
                      }
                    }}
                    className={` ${
                      plan?.finalPrice <= 0
                        ? "bg-red-200 cursor-not-allowed"
                        : ""
                    } w-full bg-black text-white rounded-full py-2 font-semibold`}
                  >
                    {userDataLoading
                      ? "Laden..."
                      : plan?.finalPrice <= 0
                      ? "Aktiver Standard"
                      : "Jetzt buchen"}
                  </button>
                )}
                {planStatus === "Active" && (
                  <button
                    disabled={currentPlanId === plan?._id}
                    className={` w-full bg-black text-white rounded-full py-2 font-semibold disabled:bg-gray-400 disabled:text-gray-200 dark:disabled:bg-[#EBEBE4] dark:disabled:text-[#9c9c9c] disabled:cursor-not-allowed ${
                      currentPlanId !== plan?._id && "cursor-default"
                    }`}
                  >
                    {currentPlanId !== plan?._id ? "Jetzt buchen" : "Aktiv"}
                  </button>
                )}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ActivePlan;
