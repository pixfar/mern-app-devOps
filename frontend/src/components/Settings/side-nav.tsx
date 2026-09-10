"use client";

import SideNavLoading from "@/components/Loading/SideNavLoading/SideNavLoading";
import { SIDENAV_ITEMS } from "@/constant/constants";
import { authKey } from "@/constant/storageKey";
import { useGetUserQuery } from "@/redux/api/userApi";
import { isToken } from "@/services/auth.service";
import { SideNavItem } from "@/types/types";
import { styles } from "@/utils/cn";
import { removeUserInfo } from "@/utils/stripe/local-storage";
import { Icon } from "@iconify/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { LuLogOut } from "react-icons/lu";
import { toast } from "react-toastify";

const SideNav = () => {
  const token = isToken();
  const { data, isLoading, isError } = useGetUserQuery(token);
  const router = useRouter();

  const user = data?.payload[0];
  const role = data?.payload[0]?.role;

  const logOut = () => {
    removeUserInfo(authKey);
    toast.success("Abmelden erfolgreich!", {
      position: "top-center",
      autoClose: 1500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
    router.push("/signin");
  };

  // Filter the items based on role
  const filteredItems = SIDENAV_ITEMS?.filter((item) => {
    if (role === "User" && item.path.startsWith("/user")) return true;
    if (role === "Administrator" && item.path.startsWith("/admin")) return true;
    if (item?.path.startsWith("/chat")) {
      return true;
    }
    return false;
  });

  if (isLoading) {
    return <SideNavLoading />;
  }

  return (
    <div className="md:w-80 bg-[#FEEBD4] dark:bg-gradient-to-t from-primary to-secondary h-[calc(100vh-64px)] mt-16 flex-1 fixed hidden md:flex">
      <div className="flex flex-col py-8 w-full">
        <div className="flex flex-col justify-between space-y-2 md:px-6">
          {filteredItems?.map((item, idx) => {
            return <MenuItem key={idx} item={item} />;
          })}
        </div>
        <div className="mt-auto px-4">
          <div className=" flex justify-between items-center p-4 bg-secondary rounded">
            <div className="flex items-center gap-3">
              <div>
                {user?.profileImage === null || user?.profileImage === "" ? (
                  <div className="text-xl text-white">
                    <FaUserCircle />
                  </div>
                ) : (
                  <Image
                    // src={user?.profileImage}
                    // src="https://i.ibb.co.com/thBM8t0/avatar.jpg"
                    src={`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/uploads/user-profile-image/${user?.profileImage}`}
                    width={40}
                    height={40}
                    alt="User Image"
                    className="w-10 h-10 object-cover rounded-full"
                  />
                  // <Image
                  //   src={"https://i.ibb.co.com/tb6jXRb/teacher1.png"}
                  //   width={40}
                  //   height={40}
                  //   alt="User Image"
                  //   className="w-10 h-10 rounded-full"
                  // />
                )}
              </div>
              <div>
                <p className="text-base text-white font-medium">
                  {user?.fullName}
                </p>
              </div>
            </div>
            <div onClick={logOut} className="text-white text-xl cursor-pointer">
              <LuLogOut />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideNav;

const MenuItem = ({ item }: { item: SideNavItem }) => {
  const pathname = usePathname();
  const [subMenuOpen, setSubMenuOpen] = useState(false);
  // console.log("item", item);

  const toggleSubMenu = () => {
    setSubMenuOpen(!subMenuOpen);
  };

  return (
    <div className="dark:text-white dark:hover:text-black">
      {item?.submenu ? (
        <>
          <div
            onClick={toggleSubMenu}
            className={styles(
              `flex flex-row items-center p-2 rounded-lg  hover-bg-zinc-100 w-full justify-between dark:text-white hover:bg-zinc-100 ${
                pathname.includes(item.path) ? "bg-zinc-300" : ""
              }`
            )}
          >
            <div className="flex flex-row space-x-4 items-center">
              {item.icon}
              <span className="font-semibold text-xl flex dark:text-white">
                {item.title}
              </span>
            </div>

            <div className={`${subMenuOpen ? "rotate-180" : ""} flex`}>
              <Icon icon="lucide:chevron-down" width="24" height="24" />
            </div>
          </div>

          {subMenuOpen && (
            <div className="my-2 ml-12 flex flex-col space-y-4">
              {item.subMenuItems?.map((subItem, idx) => {
                return (
                  <Link
                    key={idx}
                    href={subItem.path}
                    className={`${
                      subItem.path === pathname ? "font-bold" : ""
                    }`}
                  >
                    <span>{subItem.title}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </>
      ) : (
        <Link
          href={item.path}
          className={`flex flex-row space-x-4 items-center p-2 rounded-lg hover:bg-zinc-100 ${
            item.path === pathname ? " bg-zinc-400/70" : "hover:bg-zinc-300"
          }`}
        >
          {item.icon}
          <span className="font-semibold text-[14px] flex">{item.title}</span>
        </Link>
      )}
    </div>
  );
};
