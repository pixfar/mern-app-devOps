"use client";

import { useGetUserQuery, useUpdateUserMutation } from "@/redux/api/userApi";
import { isToken } from "@/services/auth.service";
import Image from "next/image";
import { ChangeEvent, FormEvent, useState } from "react";
import { BiDownload } from "react-icons/bi";
import { FaUser } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { SiTarget } from "react-icons/si";
import { HashLoader } from "react-spinners";
import { toast } from "react-toastify";
import downloadImg from "../../../../../public/images/download.png";
// import { MdEmail, MdPerson } from "react-icons/md";

const UserDashboard = () => {
  const token = isToken();
  const { data: userData, isLoading } = useGetUserQuery(token);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const displayData = userData?.payload[0];
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [updateUser] = useUpdateUserMutation();
  // console.log("data", displayData);

  // Image validation: max size of 5MB and only image types allowed
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif"];

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      // Validate file type
      if (!ALLOWED_TYPES.includes(file.type)) {
        alert("Only .jpg, .png, or .gif files are allowed");
        return;
      }

      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        alert("File size exceeds the 5MB limit");
        return;
      }

      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;

    const firstName = (form.elements.namedItem("firstName") as HTMLInputElement)
      .value;
    const lastName = (form.elements.namedItem("lastName") as HTMLInputElement)
      .value;
    const dateOfBirth = (
      form.elements.namedItem("dateOfBirth") as HTMLInputElement
    ).value;
    // const mobileNumber = (
    //   form.elements.namedItem("mobileNumber") as HTMLInputElement
    // ).value;
    const zipCode = (form.elements.namedItem("zipCode") as HTMLInputElement)
      .value;
    const mobileNumber = (form.elements.namedItem("number") as HTMLInputElement)
      .value;
    const address = (form.elements.namedItem("address") as HTMLInputElement)
      .value;
    const photo = image || "";

    // const userInfo = {
    //   firstName,
    //   lastName,
    //   dateOfBirth,
    //   zipCode,
    //   address,
    //   photo,
    //   mobileNumber,
    //   isActive: true,
    // };

    // console.log(userInfo);

    try {
      const res = await updateUser({
        data: {
          firstName,
          lastName,
          dateOfBirth,
          zipCode,
          address,
          photo,
          mobileNumber,
          isActive: true,
        },
      }).unwrap();
      if (res.response === "Success") {
        toast.success(res.message);
        setIsModalOpen(false);
      }
    } catch (error) {
      console.log("Error", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <HashLoader color="#5C4033" />
      </div>
    );
  }

  return (
    <div className="rounded-xl dark:text-white py-5 md:py-0">
      <div className=" mx-auto">
        <div className="grid gap-8 grid-cols-1 lg:grid-cols-3">
          {/* User Profile Card */}
          <div className="col-span-1 lg:col-span-2 bg-[#FEEBD4] dark:bg-gradient-to-br from-primary to-secondary rounded-xl p-6 shadow-lg transform transition-all duration-300 space-y-3">
            <div className="">
              <div className="flex items-center space-x-4 mb-4">
                <div>
                  {displayData?.profileImage === null ? (
                    <div className="bg-[#5c4034] w-24 h-24 flex items-center justify-center rounded-full p-3">
                      <FaUser className="text-5xl text-white" />
                    </div>
                  ) : (
                    <div className="relative shrink-0">
                      <Image
                        // src={displayData?.profileImage}
                        src={`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/uploads/user-profile-image/${displayData?.profileImage}`}
                        // src="https://i.ibb.co.com/thBM8t0/avatar.jpg"
                        width={400}
                        height={400}
                        alt="Profile Image"
                        className="w-40 h-40 object-cover rounded-full"
                      />
                      <div className="uppercase absolute left-1/3 -bottom-10">
                        {displayData?.subscription?.subscribedPlanStatus ===
                        "Active" ? (
                          <p className="text-green-500">
                            {displayData?.subscription?.subscribedPlanStatus}
                          </p>
                        ) : (
                          <p className="text-red-500">
                            {displayData?.subscription?.subscribedPlanStatus}
                          </p>
                        )}
                      </div>
                    </div>
                    // <Image
                    //   src={"https://i.ibb.co.com/tb6jXRb/teacher1.png"}
                    //   width={400}
                    //   height={400}
                    //   alt="Profile Image"
                    //   className="w-40 h-40 rounded-full"
                    // />
                  )}
                </div>
                <div className="flex-grow">
                  <h2 className="text-2xl font-bold">
                    Hallo, {displayData?.fullName} 👋
                  </h2>
                  <p className="dark:text-gray-100 text-gray-600">
                    {
                      displayData?.subscription?.currentPlan?.subscriptionPlan
                        ?.name
                    }
                  </p>
                  {/* <div className="w-full">
                    <div className="w-full">
                      <div className=" flex items-center justify-between space-y-3">
                        <div className="flex items-center space-x-3">
                          <MdEmail className="w-6 h-6 text-secondary" />
                          <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-white">
                              Email
                            </p>
                            <p className="text-base font-semibold text-gray-900 dark:text-white">
                              {displayData.email}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <MdPerson className="w-6 h-6 text-secondary dark:text-slate-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-white">
                              Role
                            </p>
                            <span className=" text-xs font-medium  dark:text-white">
                              {displayData.role}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div> */}
                </div>
              </div>
            </div>

            {/* <div className="space-y-2">
              <p>
                <span className="dark:text-gray-100 text-gray-600">Email:</span>{" "}
                {displayData?.email}
              </p>
              <p>
                <span className="dark:text-gray-100 text-gray-600">Role:</span>{" "}
                {displayData?.role}
              </p>
            </div> */}
            <div className="flex justify-end">
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-secondary px-4 py-2 rounded-md font-medium uppercase active:scale-105 duration-300 text-white"
              >
                Accountinfos Bearbeiten
              </button>
            </div>
          </div>

          {/* Download Stats */}
          <div className="space-y-4">
            <div className="bg-[#FEEBD4] dark:bg-gradient-to-br from-primary to-secondary rounded-xl p-6 shadow-lg transform transition-all duration-300 hover:scale-[1.01]">
              <h3 className="text-xl font-semibold mb-2">
                Verbliebene Download
              </h3>
              <div className="flex items-center justify-between">
                <BiDownload className="w-8 h-8 text-[#5c4034]" />
                <span className="text-4xl font-bold">
                  {" "}
                  {displayData?.subscription?.remainingDownloadAttempt || 0}
                </span>
              </div>
            </div>
            <div className="bg-[#FEEBD4] dark:bg-gradient-to-br from-primary to-secondary rounded-xl p-6 shadow-lg transform transition-all duration-300 hover:scale-[1.01]">
              <h3 className="text-xl font-semibold mb-2">
                Verbrauchte Downloads
              </h3>
              <div className="flex items-center justify-between">
                <SiTarget className="w-8 h-8 text-[#5c4034]" />
                <span className="text-4xl font-bold">
                  {" "}
                  {displayData?.subscription?.promptCount || 0}
                </span>
              </div>
            </div>
          </div>

          {/* Subscription Plan */}
          {displayData?.subscription && (
            <div className="col-span-1 lg:col-span-3 bg-[#FEEBD4] dark:bg-gradient-to-br from-primary to-secondary rounded-xl p-6 shadow-lg transform transition-all duration-300 hover:scale-[1.01]">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold">
                  {
                    displayData?.subscription?.currentPlan?.subscriptionPlan
                      ?.name
                  }
                </h3>
                <div className="bg-[#5c4034] text-white rounded-full px-4 py-1 font-semibold">
                  &#8364;{" "}
                  {
                    displayData?.subscription?.currentPlan?.subscriptionPlan
                      ?.finalPrice
                  }
                  <span className="text-sm"></span>
                </div>
              </div>
              <p className="dark:text-gray-100 text-gray-600 mb-4">
                <ul className="mb-5 space-y-1">
                  {Object.values(
                    displayData?.subscription?.currentPlan?.subscriptionPlan
                      ?.description
                  )?.map((i, index) => (
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
                      </svg>{" "}
                      {i as string}
                    </li>
                  ))}
                </ul>
              </p>
              {/* <p className="mb-4">
              Pause or cancel anytime. 7 days money-back guarantee
            </p> */}
              {/* <ul className="space-y-2">
                <li className="flex items-center">
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
                  {
                    displayData?.subscription?.currentPlan?.subscriptionPlan
                      ?.description?.benefits
                  }
                </li>
                <li className="flex items-center">
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
                  {
                    displayData?.subscription?.currentPlan?.subscriptionPlan
                      ?.description?.limitations
                  }
                </li>
              </ul> */}
            </div>
          )}
        </div>
      </div>

      {/* Daisy UI Modal or User Update Modal*/}
      <input
        type="checkbox"
        id="my-modal"
        className="modal-toggle"
        checked={isModalOpen}
        readOnly
      />
      <div className="modal">
        <div className="modal-box bg-[#FEEBD4] dark:bg-gradient-to-br from-primary to-secondary text-black dark:text-white">
          <form method="dialog" className="w-full text-right">
            <button
              onClick={() => setIsModalOpen(false)}
              className="bg-orange-200/50 rounded-full p-2"
            >
              <IoMdClose />
            </button>
          </form>

          <div className="">
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="firstName" className="block mb-1">
                    Vorname:
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    id="firstName"
                    className="w-full bg-primary/75 dark:bg-secondary/75 px-5 py-2 rounded"
                    defaultValue={displayData?.fullName.split(" ")[0]}
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block mb-1">
                    Nachname:
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    id="lastName"
                    className="w-full bg-primary/75 dark:bg-secondary/75 px-5 py-2 rounded"
                    defaultValue={displayData?.fullName.split(" ")[1]}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* <div>
                  <label htmlFor="mobileNumber" className="block mb-1">
                    Number:
                  </label>
                  <input
                    type="number"
                    name="mobileNumber"
                    id="mobileNumber"
                    className="w-full bg-primary/75 dark:bg-secondary/75 px-5 py-2 rounded"
                    defaultValue={displayData?.mobileNumber}
                    placeholder="Enter your number"
                  />
                </div> */}
                <div className="">
                  <label htmlFor="dateOfBirth" className="block mb-1">
                    Geburtsdatum:
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    id="dateOfBirth"
                    className="w-full bg-primary/75 dark:bg-secondary/75 px-5 py-2 rounded"
                    placeholder="Enter your number"
                  />
                </div>
                <div>
                  <label htmlFor="zipCode" className="block mb-1">
                    PLZ:
                  </label>
                  <input
                    type="number"
                    name="zipCode"
                    id="zipCode"
                    className="w-full bg-primary/75 dark:bg-secondary/75 px-5 py-2 rounded"
                    defaultValue={displayData?.zipCode}
                    placeholder="PLZ"
                  />
                </div>
              </div>

              <div>
                <div>
                  <label htmlFor="number" className="block mb-1">
                    Telefonnummer:
                  </label>
                  <input
                    type="number"
                    name="number"
                    id="number"
                    className="w-full bg-primary/75 dark:bg-secondary/75 px-5 py-2 rounded"
                    defaultValue={displayData?.mobileNumber}
                    placeholder="Telefonnummer eingeben"
                  />
                </div>
              </div>

              <div>
                <div>
                  <label htmlFor="address" className="block mb-1">
                    Adresse:
                  </label>
                  <textarea
                    rows={2}
                    name="address"
                    id="address"
                    className="w-full bg-primary/75 dark:bg-secondary/75 px-5 py-2 rounded"
                    defaultValue={displayData?.address}
                    placeholder="Adresse eingeben"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="file" className="block mb-1">
                  Bild:
                </label>
                <input
                  accept="image/*"
                  onChange={handleImageChange}
                  type="file"
                  name="file"
                  id="file"
                  className="hidden"
                />
                {preview ? (
                  <Image
                    src={preview}
                    width={200}
                    height={200}
                    alt=""
                    className="w-full"
                  />
                ) : (
                  <label htmlFor="file">
                    <Image
                      src={downloadImg}
                      width={100}
                      height={100}
                      alt=""
                      className="w-full h-auto cursor-pointer"
                    />
                  </label>
                )}
              </div>
              <div>
                <input
                  type="submit"
                  defaultValue="Update"
                  className="w-full py-2 uppercase font-medium bg-secondary text-white shadow rounded-md cursor-pointer"
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
