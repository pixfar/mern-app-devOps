"use client";

import { useGetUserByIDQuery } from "@/redux/api/userApi";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import React from "react";
import { BiDownload } from "react-icons/bi";
import { FaArrowLeft, FaUser } from "react-icons/fa";
import { FcExpired } from "react-icons/fc";
import { SiTarget } from "react-icons/si";
import { HashLoader } from "react-spinners";

export default function UserDetailsPage() {
  const { id } = useParams();
  const { data: userData, isLoading } = useGetUserByIDQuery(id);

  const user = userData?.payload[0];

  const date = new Date(user?.subscription?.currentPlan?.endDate);
  const expiredDate = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const paymentDate = new Date(
    user?.subscription?.currentPlan?.payment?.createdAt
  ).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <HashLoader color="#5C4033" />
      </div>
    );
  }

  // console.log(user);

  return (
    <div className="dark:text-white text-black">
      <div className="mb-5 mt-5 md:mt-0">
        <Link href="/admin/user-list" className="flex items-center gap-2">
          <FaArrowLeft /> Back To List
        </Link>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div
          style={{
            boxShadow:
              "rgba(0, 0, 0, 0.25) 0px 0.0625em 0.0625em, rgba(0, 0, 0, 0.25) 0px 0.125em 0.5em, rgba(255, 255, 255, 0.1) 0px 0px 0px 1px inset",
          }}
          className={`bg-orange-200/50 dark:bg-gradient-to-br from-primary to-secondary w-full p-10 rounded-md dark:text-white`}
        >
          <div className="space-y-4">
            <div>
              <p className="uppercase pb-4 border-b w-full border-black/50 dark:border-gray-200">
                User Details
              </p>
            </div>
            <div>
              {user?.profileImage === "" || user?.profileImage === null ? (
                <div className="bg-amber-500 mx-auto w-28 h-28 flex items-center justify-center rounded-full p-3">
                  <FaUser className="text-5xl" />
                </div>
              ) : (
                <Image
                  src={`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/uploads/user-profile-image/${user?.profileImage}`}
                  // src={"https://i.ibb.co.com/tb6jXRb/teacher1.png"}
                  width={400}
                  height={400}
                  alt="Profile Image"
                  className="w-32 h-32 rounded-full mx-auto"
                />
              )}
            </div>
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <p className="pb-4 border-b w-full border-black/50 dark:border-gray-200">
                {user?.fullName}
              </p>
              <p className="pb-4 border-b w-full border-black/50 dark:border-gray-200">
                {user?.mobileNumber || "Add Number"}
              </p>
            </div>
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <p className="pb-4 border-b w-full border-black/50 dark:border-gray-200">
                {user?.email}
              </p>
              <p className="pb-4 border-b w-full border-black/50 dark:border-gray-200">
                {user?.role}
              </p>
            </div>
            <div className="">
              <p className="pb-4 border-b w-full border-black/50 dark:border-gray-200">
                {user?.address || "Add Address"}
              </p>
              {/* <button className="w-full px-4 py-2 rounded-md uppercase bg-secondary text-white">
                Send Notice
              </button> */}
            </div>
          </div>
        </div>
        <div
          style={{
            boxShadow:
              "rgba(0, 0, 0, 0.25) 0px 0.0625em 0.0625em, rgba(0, 0, 0, 0.25) 0px 0.125em 0.5em, rgba(255, 255, 255, 0.1) 0px 0px 0px 1px inset",
          }}
          className={`bg-orange-200/50 dark:bg-gradient-to-bl from-primary to-secondary w-full p-10 rounded-md dark:text-white`}
        >
          <div className="uppercase pb-4 border-b w-full border-black/50 dark:border-gray-200 mb-5 flex justify-between items-center">
            <p className="">Active Plan</p>
            <p>
              {user?.subscription === null ? (
                <></>
              ) : user?.subscription?.subscribedPlanStatus === "Expired" ? (
                <p className="bg-red-600 text-white px-4 py-2 rounded">
                  Expired
                </p>
              ) : (
                <p className="text-white bg-green-600 px-4 py-2 rounded">
                  Active
                </p>
              )}
            </p>
          </div>
          <div>
            {user?.subscription === null ? (
              <div className="space-y-4">
                <p className="text-lg font-medium text-red-500">
                  Not subscribed yet any plan!
                </p>
                {/* <button className="px-4 py-2 rounded-md w-fit bg-secondary text-white uppercase">
                  Send A Reminder
                </button> */}
              </div>
            ) : (
              <div className="">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-2xl font-bold">
                    {" "}
                    {user?.subscription?.currentPlan?.subscriptionPlan?.name}
                  </h3>
                  <div className="bg-amber-500 text-gray-900 rounded-full px-4 py-1 font-semibold">
                    {
                      user?.subscription?.currentPlan?.subscriptionPlan
                        ?.finalPrice
                    }
                    <span className="text-sm"></span>
                  </div>
                </div>
                <p className="text-gray-400 mb-4">
                  {
                    user?.subscription?.currentPlan?.subscriptionPlan
                      ?.description?.benefits
                  }
                </p>
                {/* <p className="mb-4">
                  Pause or cancel anytime. 7 days money-back guarantee
                </p> */}
                <ul className="space-y-2">
                  {Object.entries(
                    user?.subscription?.currentPlan?.subscriptionPlan
                      ?.description || {}
                  )?.map(([key, value], index) => (
                    <li key={index} className="flex items-center">
                      <svg
                        className="w-5 h-5 mr-2 text-green-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        ></path>
                      </svg>
                      <span>{`${key}: ${value}`}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
      {user?.subscription !== null && (
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div
            style={{
              boxShadow:
                "rgba(0, 0, 0, 0.25) 0px 0.0625em 0.0625em, rgba(0, 0, 0, 0.25) 0px 0.125em 0.5em, rgba(255, 255, 255, 0.1) 0px 0px 0px 1px inset",
            }}
            className="bg-orange-200/50 dark:bg-gradient-to-tr from-primary to-secondary rounded-md p-10 space-y-5"
          >
            <div>
              <h3 className="uppercase pb-4 border-b w-full border-black/50 dark:border-gray-200 mb-4">
                Expired Date
              </h3>
              <div className="flex items-center justify-between">
                <FcExpired className="w-8 h-8 text-amber-500" />
                <span className="text-2xl font-semibold"> {expiredDate}</span>
              </div>
            </div>
            <div>
              <h3 className="uppercase pb-4 border-b w-full border-black/50 dark:border-gray-200 mb-4">
                Remaining Download
              </h3>
              <div className="flex items-center justify-between">
                <BiDownload className="w-8 h-8 text-amber-500" />
                <span className="text-2xl font-semibold">
                  {" "}
                  {user?.subscription?.remainingDownloadAttempt}
                </span>
              </div>
            </div>
            <div>
              <h3 className="uppercase pb-4 border-b w-full border-black/50 dark:border-gray-200 mb-4">
                Attempt Download
              </h3>
              <div className="flex items-center justify-between">
                <SiTarget className="w-8 h-8 text-amber-500" />
                <span className="text-2xl font-semibold">
                  {" "}
                  {user?.subscription?.promptCount}
                </span>
              </div>
            </div>
          </div>
          <div
            style={{
              boxShadow:
                "rgba(0, 0, 0, 0.25) 0px 0.0625em 0.0625em, rgba(0, 0, 0, 0.25) 0px 0.125em 0.5em, rgba(255, 255, 255, 0.1) 0px 0px 0px 1px inset",
            }}
            className="bg-orange-200/50 dark:bg-gradient-to-tl from-primary to-secondary rounded-md p-10 shadow-lg"
          >
            <h3 className="uppercase pb-4 border-b w-full border-black/50 dark:border-gray-200 mb-4">
              Buchungsdetails
            </h3>
            <div className="space-y-4">
              <p>
                Betrag: &#8364;
                {user?.subscription?.currentPlan?.payment?.amount}
              </p>
              <p>
                Status:{" "}
                <span className="text-green-500 capitalize">
                  {user?.subscription?.currentPlan?.payment?.status}
                </span>
              </p>
              <p className="capitalize">
                Payment Method:{" "}
                {
                  user?.subscription?.currentPlan?.payment
                    ?.payment_method_types[0]
                }
              </p>
              <p className="capitalize">Paid: {paymentDate}</p>
            </div>
          </div>
        </div>
      )}
      {user?.subscription !== null && (
        <div
          className="mt-6 bg-orange-200/50 dark:bg-gradient-to-b from-primary to-secondary rounded-md p-10 "
          style={{
            boxShadow:
              "rgba(0, 0, 0, 0.25) 0px 0.0625em 0.0625em, rgba(0, 0, 0, 0.25) 0px 0.125em 0.5em, rgba(255, 255, 255, 0.1) 0px 0px 0px 1px inset",
          }}
        >
          <div>
            <p className="uppercase pb-4 border-b w-full border-black/50 dark:border-gray-600 mb-4">
              All Subscribed Details
            </p>
            <div className=" bg-orange-100 dark:bg-secondary dark:text-white mb-10 rounded shadow-md min-w-[280px] max-w-full">
              <div className="overflow-x-auto">
                <table className="table">
                  {/* head */}
                  <thead>
                    <tr>
                      <th>Plan</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Type</th>
                      <th>Paid</th>
                    </tr>
                  </thead>
                  <tbody>
                    {user?.subscription?.subscriptionDetails.map(
                      (details: any) => (
                        <tr
                          key={details?._id}
                          className="hover even:bg-orange-200/75 odd:bg-orange-200/25 dark:odd:bg-primary/75 dark:even:bg-primary/45 whitespace-nowrap"
                        >
                          <td>{details?.subscriptionPlan?.name}</td>
                          <td>&#8364;{details?.payment?.amount}</td>
                          <td>
                            <p className="bg-green-500 px-2 py-1 rounded-sm text-white w-fit uppercase">
                              {details?.payment?.status}
                            </p>
                          </td>
                          <td>{details?.payment?.payment_method_types[0]}</td>
                          <td>
                            {new Date(
                              details?.payment?.createdAt
                            ).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
