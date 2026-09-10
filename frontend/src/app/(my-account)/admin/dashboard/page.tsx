"use client";
import { useAdminAnaliticsQuery } from "@/redux/api/analyticsApi";
import { useGetUserQuery, useUpdateUserMutation } from "@/redux/api/userApi";
import { isToken } from "@/services/auth.service";
import Image from "next/image";
import { ChangeEvent, FormEvent, useState } from "react";
import { BiCalendar, BiCalendarAlt, BiTrendingUp } from "react-icons/bi";
import { BsInfinity } from "react-icons/bs";
import { CgLock, CgLockUnlock } from "react-icons/cg";
import { FaUser } from "react-icons/fa";
import { FiBarChart2 } from "react-icons/fi";
import { IoMdClose } from "react-icons/io";
import { LuBarChart2 } from "react-icons/lu";
import { HashLoader } from "react-spinners";
import { toast } from "react-toastify";
import downloadImg from "../../../../../public/images/download.png";
import { MdEmail, MdPerson } from "react-icons/md";

interface DataProps {
  name: string;
  uv: number;
  pv: number;
  amt: number;
}

const data: DataProps[] = [
  { name: "Jan", uv: 4000, pv: 2400, amt: 2400 },
  { name: "Feb", uv: 3000, pv: 1398, amt: 2210 },
  { name: "Mar", uv: 2000, pv: 9800, amt: 2290 },
  { name: "Apr", uv: 2780, pv: 3908, amt: 2000 },
  { name: "May", uv: 1890, pv: 4800, amt: 2181 },
  { name: "Jun", uv: 2390, pv: 3800, amt: 2500 },
  { name: "Jul", uv: 3490, pv: 4300, amt: 2100 },
];

const chartData = [
  {
    name: "Income",
    value: 579000,
    fill: "#3B76EF",
  },
  {
    name: "Expenses",
    value: 79000,
    fill: "#63C7FF",
  },
  {
    name: "Cash",
    value: 92000,
    fill: "#A66DD4",
  },
  {
    name: "Margin",
    value: 179000,
    fill: "#6DD4B1",
  },
];

const AdminDashboard: React.FC = () => {
  const token = isToken();
  const { data, isLoading } = useAdminAnaliticsQuery(token);
  const subscriptionStat = data?.subscriptionStats;
  const { data: userData, isLoading: userLoading } = useGetUserQuery(token);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [updateUser] = useUpdateUserMutation();

  const displayData = userData?.payload[0];
  const userID = displayData?._id;
  const planStats = data?.planStats;

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
    const mobileNumber = (
      form.elements.namedItem("mobileNumber") as HTMLInputElement
    ).value;
    const zipCode = (form.elements.namedItem("zipCode") as HTMLInputElement)
      .value;
    const address = (form.elements.namedItem("address") as HTMLInputElement)
      .value;
    const photo = image || "";
    const isActive =
      (form.elements.namedItem("isActive") as HTMLInputElement)?.value ===
      "false"
        ? false
        : true;

    // const userInfo = {
    //   firstName,
    //   lastName,
    //   dateOfBirth,
    //   mobileNumber,
    //   zipCode,
    //   address,
    //   photo,
    //   isActive: isActive,
    // };

    try {
      const res = await updateUser({
        // token,
        // userID,
        data: {
          firstName,
          lastName,
          dateOfBirth,
          mobileNumber,
          zipCode,
          address,
          photo,
          isActive: true,
        },
      }).unwrap();
      if (res.response === "Success") {
        toast.success(res.message);
        setIsModalOpen(false);
      }
    } catch (error) {
      // console.log("Error", error);
    }
  };

  if (isLoading || userLoading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <HashLoader color="#5C4033" />
      </div>
    );
  }

  const StatCard: React.FC<{
    title: string;
    sales: number;
    amount: number;
    icon: React.ReactNode;
    color: string;
  }> = ({ title, sales, amount, icon, color }) => (
    <div
      className={`bg-gray-50 dark:bg-[#00000010] rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105`}
    >
      <div className={`p-4 bg-[#5C4033] h-2`}></div>
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
            {title}
          </h4>
          <div className={`p-2 rounded-full ${color} bg-opacity-20`}>
            {icon}
          </div>
        </div>
        <h2 className="text-2xl font-bold flex items-center gap-1 text-gray-900 dark:text-white mb-2">
          <span>
            <BiTrendingUp className="bg-secondary rounded px-0.5 text-[#fff]" />
          </span>
          <span>{sales?.toLocaleString()}</span>
        </h2>
        {amount ? (
          <p className="text-sm text-gray-600 dark:text-white">
            Betrag: {amount?.toLocaleString()}
          </p>
        ) : (
          ""
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div
        style={{ boxShadow: "rgba(0, 0, 0, 0.15) 0px 2px 8px" }}
        className="bg-[#FEEBD4] dark:bg-gradient-to-br from-primary to-secondary p-6 rounded-2xl"
      >
        <div className="col-span-1 lg:col-span-2  rounded-xl p-6  transform transition-all duration-300 space-y-3">
          <div className="flex justify-between">
            <div className="flex items-center space-x-4 mb-4">
              <div>
                {displayData?.profileImage === "" ? (
                  <div className="bg-[#5c4034] w-24 h-24 flex items-center justify-center rounded-full p-3">
                    <FaUser className="text-5xl text-white" />
                  </div>
                ) : (
                  <Image
                    src={
                      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/uploads/user-profile-image/${displayData?.profileImage}` ||
                      "https://i.ibb.co.com/thBM8t0/avatar.jpg"
                    }
                    width={400}
                    height={400}
                    alt="Profile Image"
                    className="w-40 h-40 object-cover rounded-full"
                  />
                )}
              </div>
              <div>
                <h2 className="text-2xl font-bold">
                  Hello, {displayData?.fullName} 👋
                </h2>
                <p className="dark:text-gray-100 text-gray-600">
                  {
                    displayData?.subscription?.currentPlan?.subscriptionPlan
                      ?.name
                  }
                </p>
                <div className="w-full mt-3">
                  <div className="w-full">
                    <div className=" space-y-3">
                      <div className="flex items-center space-x-3">
                        <MdEmail className="w-6 h-6 text-secondary" />
                        <div>
                          <p className="text-base font-semibold text-gray-900 dark:text-white">
                            {displayData.email}
                          </p>
                        </div>
                      </div>
                      {/* <div className="flex items-center space-x-3">
                        <MdPerson className="w-6 h-6 text-secondary dark:text-slate-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-500 dark:text-white">
                            Role
                          </p>
                          <span className=" text-xs font-medium  dark:text-white">
                            {displayData.role}
                          </span>
                        </div>
                      </div> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="uppercase">
              {displayData?.subscription?.subscribedPlanStatus === "Active" ? (
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

          <div className="flex justify-end">
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-secondary px-4 py-2 rounded-md font-medium uppercase active:scale-105 duration-300 text-white"
            >
              Accountinfos Bearbeiten
            </button>
          </div>
        </div>
      </div>

      <div>
        <div
          style={{ boxShadow: "rgba(0, 0, 0, 0.15) 0px 2px 8px" }}
          className="bg-[#FEEBD4] dark:bg-gradient-to-br from-primary to-secondary p-6 rounded-2xl"
        >
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
            Subscription Statistics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            <StatCard
              title="This Week"
              sales={subscriptionStat?.thisWeek?.totalSales}
              amount={subscriptionStat?.thisWeek?.totalAmount}
              icon={<BiTrendingUp className="w-6 h-6 text-[#fff]" />}
              color="bg-[#5C4033]"
            />
            <StatCard
              title="This Month"
              sales={subscriptionStat?.thisMonth?.totalSales}
              amount={subscriptionStat?.thisMonth?.totalAmount}
              icon={<BiCalendar className="w-6 h-6 text-cyan-600" />}
              color="bg-cyan-600"
            />
            <StatCard
              title="Six Months"
              sales={subscriptionStat?.sixMonths?.totalSales}
              amount={subscriptionStat?.sixMonths?.totalAmount}
              icon={<CgLock className="w-6 h-6 text-purple-600" />}
              color="bg-purple-600"
            />
            <StatCard
              title="One Year"
              sales={subscriptionStat?.oneYear?.totalSales}
              amount={subscriptionStat?.oneYear?.totalAmount}
              icon={<FiBarChart2 className="w-6 h-6 text-green-600" />}
              color="bg-green-600"
            />
            <StatCard
              title="Life Time"
              sales={subscriptionStat?.lifetime?.totalSales}
              amount={subscriptionStat?.lifetime?.totalAmount}
              icon={<BsInfinity className="w-6 h-6 text-pink-600" />}
              color="bg-pink-600"
            />
          </div>
        </div>
      </div>

      <div
        className="relative p-8 rounded-3xl overflow-hidden"
        style={{ boxShadow: "rgba(0, 0, 0, 0.15) 0px 2px 8px" }}
      >
        <div className="absolute inset-0 bg-[#FEEBD4] dark:bg-gradient-to-tl from-primary to-secondary"></div>
        <div className="absolute inset-0 backdrop-blur-3xl"></div>
        <div className="relative">
          <h1 className="text-3xl font-bold dark:text-white mb-8">
            Plan Statistics
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <StatCard
              title="This Month"
              sales={planStats?.thisMonth[0]?.totalSales}
              amount={planStats?.thisMonth[0]?.totalAmount}
              icon={<BiCalendarAlt className="w-6 h-6" />}
              color="bg-blue-400"
            />
            <StatCard
              title="Six Months"
              sales={planStats?.sixMonths[0]?.totalSales}
              amount={planStats?.sixMonths[0]?.totalAmount}
              icon={<CgLockUnlock className="w-6 h-6" />}
              color="bg-purple-400"
            />
            <StatCard
              title="One Year"
              sales={planStats?.oneYear[0]?.totalSales}
              amount={planStats?.oneYear[0]?.totalAmount}
              icon={<LuBarChart2 className="w-6 h-6" />}
              color="bg-cyan-400"
            />
          </div>
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
                <div>
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
                </div>
                <div>
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
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
                <div>
                  <label htmlFor="isActive" className="block mb-1">
                    Active Status
                  </label>
                  <select
                    defaultValue={displayData?.isActive}
                    name="isActive"
                    id="isActive"
                    className="w-full bg-primary/75 dark:bg-secondary/75 px-5 py-2 rounded"
                  >
                    <option defaultValue="true">True</option>
                    <option defaultValue="false">False</option>
                  </select>
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
                    placeholder="Adresse"
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

export default AdminDashboard;
