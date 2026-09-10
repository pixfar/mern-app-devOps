"use client";
import {
  useSettingsQuery,
  useUpdateSettingsMutation,
} from "@/redux/api/settingsApi";
import { isToken } from "@/services/auth.service";
import Image from "next/image";
import React, { useState } from "react";
import { FaRegEdit, FaUser } from "react-icons/fa";
import { FaRegCircleLeft } from "react-icons/fa6";
import { LuUpload } from "react-icons/lu";
import { toast } from "react-toastify";
import { HashLoader } from "react-spinners";

export default function SettingsPage() {
  const token = isToken();
  const { data: settingsData, isLoading: settingsLoading } =
    useSettingsQuery(null);
  const [toggleEdit, setToggleEdit] = useState(false);
  const [updateSettings] = useUpdateSettingsMutation();
  const [logoFile, setLogoFile] = useState<File | null>(null);

  // console.log(settingsData);

  const handleUpdateSettings = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    const form = event.target as HTMLFormElement;

    const appName = (form.elements.namedItem("appName") as HTMLInputElement)
      .value;
    const creditPrice = (
      form.elements.namedItem("creditPrice") as HTMLInputElement
    ).value;
    const secondaryColor = (
      form.elements.namedItem("secondaryColor") as HTMLInputElement
    ).value;
    const primaryColor = (
      form.elements.namedItem("primaryColor") as HTMLInputElement
    ).value;

    const purchaseTaxPercentage = (
      form.elements.namedItem("purchaseTaxPercentage") as HTMLInputElement
    ).value;

    const maintenanceMode =
      (form.elements.namedItem("maintenanceMode") as HTMLInputElement)
        ?.value === "False"
        ? false
        : true;

    const logo = logoFile || "";

    try {
      const res = await updateSettings({
        token,
        data: {
          appName,
          creditPrice: parseFloat(creditPrice),
          logo,
          maintenanceMode,
          primaryColor,
          secondaryColor,
          purchaseTaxPercentage,
        },
      }).unwrap();
      // console.log(res);
      if (res) {
        toast.success("Settings updated successfully");
        setToggleEdit(false);
      }
    } catch (error) {
      console.log("update error", error);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileInput = event.target;
    if (fileInput.files && fileInput.files[0]) {
      const file = fileInput.files[0];
      setLogoFile(file);
    }
  };

  if (settingsLoading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <HashLoader color="#5C4033" />
      </div>
    );
  }

  return (
    <div className="flex justify-center">
      <div
        style={{
          boxShadow:
            "rgba(0, 0, 0, 0.25) 0px 0.0625em 0.0625em, rgba(0, 0, 0, 0.25) 0px 0.125em 0.5em, rgba(255, 255, 255, 0.1) 0px 0px 0px 1px inset",
        }}
        className={`relative bg-orange-200/50 w-full p-10 rounded-md dark:bg-gradient-to-tr from-primary to-secondary dark:text-white`}
      >
        {toggleEdit ? (
          <button
            onClick={() => setToggleEdit(false)}
            className="absolute left-5 top-5 text-2xl cursor-pointer"
          >
            <FaRegCircleLeft />
          </button>
        ) : (
          <button
            onClick={() => setToggleEdit(true)}
            className="absolute right-5 top-5 text-2xl cursor-pointer"
          >
            <FaRegEdit />
          </button>
        )}
        <form onSubmit={handleUpdateSettings} className="space-y-5">
          {/* Logo */}
          <div className=" space-y-5">
            <div className="">
              {settingsData?.logo !== "" || settingsData?.logo !== null ? (
                <Image
                  src={
                    settingsData?.logo
                      ? `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/uploads/settings/${settingsData.logo}`
                      : "/imageplaceholder.png" // fallback image path
                  }
                  width={400}
                  height={400}
                  alt="Profile Image"
                  className="w-40 h-40 rounded-full mx-auto"
                  onError={(e) => {
                    e.currentTarget.src = "/imageplaceholder.png"; // Set fallback on error
                  }}
                />
              ) : (
                <div className="text-7xl mx-auto p-8 bg-amber-500 rounded-full w-fit">
                  <FaUser />
                </div>
              )}
            </div>
            {toggleEdit && (
              <div className="w-full">
                {logoFile && (
                  <p className="mb-2 text-center">{logoFile.name}</p>
                )}
                <label
                  htmlFor="logo"
                  className="flex mx-auto items-center gap-2 text-lg px-3 py-1 border-black dark:border-white border w-fit rounded-lg cursor-pointer"
                >
                  <LuUpload /> Upload
                </label>
                <input
                  type="file"
                  name="logo"
                  id="logo"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>
            )}
          </div>
          <div className="space-y-4">
            {/* App Name & Credit Price */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className="border-b border-[#00000030] dark:border-[#ffffff30] pb-4">
                <p className={`font-semibold mb-1`}>App Name</p>
                {toggleEdit ? (
                  <input
                    type="text"
                    name="appName"
                    id=""
                    defaultValue={settingsData?.appName}
                    placeholder="App Name"
                    className="bg-[#00000030] dark:bg-secondary/90 px-4 py-1 rounded focus:outline-none md:placeholder:text-white w-full text-[#00000099] dark:text-[#ffffff99]"
                  />
                ) : (
                  <p className="text-[#00000090] dark:text-gray-100 text-sm font-medium">
                    {settingsData?.appName}
                  </p>
                )}
              </div>
              <div className="border-b border-[#00000030] dark:border-[#ffffff30] pb-4">
                <p className={`font-semibold mb-1`}>Credit Price</p>
                {toggleEdit ? (
                  <input
                    type="text"
                    name="creditPrice"
                    id=""
                    defaultValue={settingsData?.creditPrice}
                    placeholder="Credit Price"
                    className="bg-[#00000030] dark:bg-secondary/90 px-4 py-1 rounded focus:outline-none md:placeholder:text-white w-full text-[#00000099] dark:text-[#ffffff99]"
                  />
                ) : (
                  <p className="text-[#00000090] dark:text-gray-100 text-sm font-medium">
                    &#8364;{settingsData?.creditPrice}
                  </p>
                )}
              </div>
            </div>
            {/* Max Upload & Maintenance Mode */}
            {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className="pb-4 border-b border-[#00000030] dark:border-[#ffffff30]">
                <p className={`font-semibold mb-1`}>Max Upload</p>
                {toggleEdit ? (
                  <input
                    type="text"
                    name="maxUploadSize"
                    id=""
                    defaultValue={settingsData?.maxUploadSize}
                    placeholder="Max Upload"
                    className="bg-[#00000030] dark:bg-secondary/90 px-4 py-1 rounded focus:outline-none md:placeholder:text-white w-full text-[#00000099] dark:text-[#ffffff99]"
                  />
                ) : (
                  <p className="text-[#00000090] dark:text-gray-100 text-sm font-medium">
                    {settingsData?.maxUploadSize}
                  </p>
                )}
              </div>
              <div className="pb-4 border-b border-[#00000030] dark:border-[#ffffff30]">
                <p className={`font-semibold mb-1`}>Maintenance Mode</p>
                {toggleEdit ? (
                  <select
                    defaultValue={settingsData?.maintenanceMode}
                    name="maintenanceMode"
                    className="bg-[#00000030]  dark:bg-secondary/90 px-4 py-1 rounded focus:outline-none md:placeholder:text-white w-full text-[#00000099] dark:text-[#ffffff99]"
                  >
                    <option value="false">False</option>
                    <option value="true">True</option>
                  </select>
                ) : (
                  <p className="text-[#00000090] dark:text-gray-100 text-sm font-medium">
                    {settingsData?.maintenanceMode ? "True" : "False"}
                  </p>
                )}
              </div>
            </div> */}
            {/* Primary Color & Secondary Color */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className="pb-4 border-b border-[#00000030] dark:border-[#ffffff30]">
                <p className={`font-semibold mb-1`}>Primary Color</p>
                {toggleEdit ? (
                  <input
                    type="text"
                    name="primaryColor"
                    id=""
                    defaultValue={settingsData?.primaryColor}
                    placeholder="Primary Color"
                    className="bg-[#00000030] dark:bg-secondary/90 px-4 py-1 rounded focus:outline-none md:placeholder:text-white w-full text-[#00000099] dark:text-[#ffffff99]"
                  />
                ) : (
                  <p className="text-[#00000090] dark:text-gray-100 text-sm font-medium">
                    {settingsData?.primaryColor}
                  </p>
                )}
              </div>
              <div className="pb-4 border-b border-[#00000030] dark:border-[#ffffff30]">
                <p className={`font-semibold mb-1`}>Secondary Color</p>
                {toggleEdit ? (
                  <input
                    type="text"
                    name="secondaryColor"
                    id=""
                    defaultValue={settingsData?.secondaryColor}
                    placeholder="Secondary Color"
                    className="bg-[#00000030] dark:bg-secondary/90 px-4 py-1 rounded focus:outline-none md:placeholder:text-white w-full text-[#00000099] dark:text-[#ffffff99]"
                  />
                ) : (
                  <p className="text-[#00000090] dark:text-gray-100 text-sm font-medium">
                    {settingsData?.secondaryColor}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className="border-b col-span-2 border-[#00000030] dark:border-[#ffffff30] pb-4">
                <p className={`font-semibold mb-1`}> Value-Added Tax (%)</p>
                {toggleEdit ? (
                  <input
                    type="number"
                    name="purchaseTaxPercentage"
                    id=""
                    defaultValue={settingsData?.purchaseTaxPercentage}
                    placeholder="Tax"
                    className="bg-[#00000030] dark:bg-secondary/90 px-4 py-1 rounded focus:outline-none md:placeholder:text-white w-full text-[#00000099] dark:text-[#ffffff99]"
                  />
                ) : (
                  <p className="text-[#00000090] dark:text-gray-100 text-sm font-medium">
                    &#8364;{settingsData?.purchaseTaxPercentage}
                  </p>
                )}
              </div>
            </div>

            {/* Privacy Policy & Terms of services */}
            {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div>
                <p className={`font-semibold mb-1`}>Privacy Policy</p>
                {toggleEdit ? (
                  <textarea
                    rows={3}
                    name="privacyPolicy"
                    id=""
                    defaultValue={settingsData?.privacyPolicy}
                    placeholder="Privacy Policy"
                    className="bg-[#00000030] dark:bg-secondary/90 px-4 py-1 rounded focus:outline-none md:placeholder:text-white w-full text-[#00000099] dark:text-[#ffffff99]"
                  />
                ) : (
                  <p className="text-[#00000090] dark:text-gray-100 text-sm font-medium">
                    {settingsData?.privacyPolicy}
                  </p>
                )}
              </div>
              <div>
                <p className="font-semibold mb-1">Terms of Services</p>
                {toggleEdit ? (
                  <textarea
                    rows={3}
                    name="termsOfService"
                    id=""
                    defaultValue={settingsData?.termsOfService}
                    placeholder="Terms of Services"
                    className="bg-[#00000030] dark:bg-secondary/90 px-4 py-1 rounded focus:outline-none md:placeholder:text-white w-full text-[#00000099] dark:text-[#ffffff99]"
                  />
                ) : (
                  <p className="text-[#00000090] dark:text-gray-100 text-sm font-medium">
                    {settingsData?.termsOfService}
                  </p>
                )}
              </div>
            </div> */}
          </div>
          {toggleEdit && (
            <div>
              <input
                type="submit"
                value="Update"
                className="mt-5 py-2 w-full rounded-md dark:bg-secondary/90 bg-secondary cursor-pointer text-white uppercase font-medium"
              />
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
