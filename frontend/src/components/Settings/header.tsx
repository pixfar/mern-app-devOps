"use client";
import Link from "next/link";
import { useRouter, useSelectedLayoutSegment } from "next/navigation";

import { authKey } from "@/constant/storageKey";
import useScroll from "@/hooks/use-scroll";
import { removeUserInfo } from "@/utils/stripe/local-storage";
import { cn } from "@/utils/stripe/utils";
import Image from "next/image";
import { FaSignOutAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import ThemeToggler from "../Header/ThemeToggler";

const Header = () => {
  const scrolled = useScroll(10);
  const selectedLayout = useSelectedLayoutSegment();
  const router = useRouter();

  const logOut = () => {
    removeUserInfo(authKey);
    // Logout Response
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
    router.push("/");
  };

  return (
    <div
      className={cn(`sticky inset-x-0 top-0 z-30 w-full transition-all`, {
        "bg-white/75 backdrop-blur-lg": scrolled,
        "shadow-md dark:bg-gradient-to-r from-primary to-secondary bg-[#FEEBD4]":
          selectedLayout,
      })}
    >
      <div className="flex h-16 items-center justify-between px-4">
        <div className="flex items-center space-x-4">
          <Link
            href="/"
            className="flex flex-row space-x-3 items-center justify-center md:justify-start md:px-6  h-16 w-full"
          >
            <div className="w-8 rounded-full">
              <Image
                alt="Tailwind CSS Navbar component"
                src="/images/logo/logo.png"
                height={60}
                width={60}
              />
            </div>
          </Link>
        </div>

        <div className="mr-10 mb-3 md:mr-0 md:mb-0">
          <div>
            <ThemeToggler />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
