"use client";
import { authKey } from "@/constant/storageKey";
import { useGetUserQuery } from "@/redux/api/userApi";
import { isLoggedIn, isToken } from "@/services/auth.service";
import { removeUserInfo } from "@/utils/stripe/local-storage";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MdDashboardCustomize } from "react-icons/md";
import { toast } from "react-toastify";
import ThemeToggler from "./ThemeToggler";
import { FaComment } from "react-icons/fa";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [userLoggedIn, setUserLoggedIn] = useState<boolean>(false);
  const router = useRouter();
  const activePage = usePathname();
  const token = isToken();
  const { data, error } = useGetUserQuery(token);

  const role = data?.payload[0].role;

  // Use useEffect to check if the user is logged in (only runs on the client)
  useEffect(() => {
    setUserLoggedIn(isLoggedIn()); // Run only on client-side
  }, []);

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

  // Handle scroll event
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  console.log(userLoggedIn);

  return (
    <div
      className={`fixed w-full top-0 z-[30] transition-all duration-300 ${
        isScrolled
          ? "bg-primary/90 shadow-lg dark:bg-primary"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto">
        <div className="navbar">
          <div className="navbar-start">
            <div className="dropdown">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost lg:hidden"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h8m-8 6h16"
                  />
                </svg>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-base-100 dark:text-black rounded-box z-[1] mt-3 w-52 p-2 shadow"
              >
                {/* <li>
                  <Link className="font-bold" href={"/"}>
                    Home
                  </Link>
                </li> */}
                <li>
                  <Link className="font-semibold" href={"/uber-justus"}>
                    {/* About Us */}
                    Über Justus
                  </Link>
                </li>
                <li>
                  <Link className="font-semibold" href={"/pakete-preise"}>
                    {/* Plans */}
                    Pakete & Preise
                  </Link>
                </li>
                {/* <li>
                  <Link className="font-bold" href={"/contact"}>
                    Contact
                  </Link>
                </li> */}
              </ul>
            </div>
            <Link href={"/"}>
              <Image
                src="/images/logo/logo.png"
                alt="logo"
                width={70}
                height={70}
              />
            </Link>
          </div>
          <div className="navbar-center hidden lg:flex">
            <ul className="menu menu-horizontal px-1 dark:text-white text-black">
              {/* <li
                className={` ${
                  activePage === "/"
                    ? "border-b-2 border-current border-opacity-100"
                    : "border-opacity-0"
                } `}
              >
                <Link className="font-bold" href={"/"}>
                  Home
                </Link>
              </li> */}
              <li
                className={` ${
                  activePage === "/uber-justus"
                    ? "border-b-2 border-current border-opacity-100"
                    : "border-opacity-0"
                } `}
              >
                <Link
                  className="font-semibold"
                  href={"/uber-justus"}
                  title="About Us"
                >
                  {/* About Us */}
                  Über Justus
                </Link>
              </li>
              <li
                className={` ${
                  activePage === "/pakete-preise"
                    ? "border-b-2 border-current border-opacity-100"
                    : "border-opacity-0"
                } `}
              >
                <Link
                  className="font-semibold"
                  href={"/pakete-preise"}
                  title="pakete-preise"
                >
                  {/* Plans */}
                  Pakete & Preise
                </Link>
              </li>

              <li
                className={` ${
                  activePage === "/faq"
                    ? "border-b-2 border-current border-opacity-100"
                    : "border-opacity-0"
                } `}
              >
                <Link className="font-semibold tracking-widest" href={"/faq"}>
                  FAQ
                </Link>
              </li>
              {/* <li
                className={` ${
                  activePage === "/contact"
                    ? "border-b-2 border-current border-opacity-100"
                    : "border-opacity-0"
                } `}
              >
                <Link className="font-bold" href={"/contact"}>
                  Contact
                </Link>
              </li> */}
            </ul>
          </div>
          <div className="navbar-end">
            {userLoggedIn ? (
              <div className="flex items-center gap-4">
                <Link
                  href={`/chat`}
                  className="text-2xl text-black dark:text-white"
                  title="Anmelden"
                >
                  <FaComment />
                </Link>
                <button
                  onClick={logOut}
                  className="btn bg-[#5C4033] text-white rounded-full py-2 px-6 shadow-lg transition-transform transform hover:scale-105 hover:bg-[#7a543e] focus:outline-none focus:ring-2 focus:ring-[#5C4033] focus:ring-opacity-50"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href={"/signin"}
                className="bg-[#5C4033] text-white rounded-full py-2 px-6 shadow-lg transition-transform transform hover:scale-105 hover:bg-[#7a543e] focus:outline-none focus:ring-2 focus:ring-[#5C4033] focus:ring-opacity-50"
              >
                Login
              </Link>
            )}
          </div>
          <div>
            <ThemeToggler />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
