import { Icon } from "@iconify/react/dist/iconify.js";
import Link from "next/link";
import React from "react";

const SideNavLoading = () => {
  return (
    <div className="md:w-80 h-screen flex-1 fixed border-r dark:bg-gradient-to-t from-primary to-secondary border-gray-300 hidden md:flex animate-pulse">
      <div className="flex flex-col space-y-6 w-full">
        <Link
          href="/"
          className="flex flex-row space-x-3 items-center justify-center md:justify-start md:px-6 border-b border-zinc-200 h-12 w-full bg-gray-200 animate-pulse"
        >
          <span className="h-7 w-7 bg-zinc-300 rounded-lg" />
          <span className="font-bold text-xl hidden md:flex"></span>
        </Link>

        <div className="flex flex-col space-y-2 md:mx-6 mt-20 bg-gray-200 animate-pulse h-10">
          <div
            className={`flex flex-row items-center p-2 rounded-lg hover-bg-zinc-100 w-full justify-between`}
          >
            <div className="flex flex-row space-x-4 items-center bg-gray-200 animate-pulse">
              <span className="font-semibold text-xl flex"></span>
            </div>

            <div className={`flex  bg-gray-200 animate-pulse`}>
              <Icon icon="lucide:chevron-down" width="24" height="24" />
            </div>
          </div>
        </div>
        <div className="flex flex-col space-y-2 md:mx-6 mt-20 bg-gray-200 animate-pulse h-10">
          <div
            className={`flex flex-row items-center p-2 rounded-lg hover-bg-zinc-100 w-full justify-between`}
          >
            <div className="flex flex-row space-x-4 items-center bg-gray-200 animate-pulse">
              <span className="font-semibold text-xl flex"></span>
            </div>

            <div className={`flex  bg-gray-200 animate-pulse`}>
              <Icon icon="lucide:chevron-down" width="24" height="24" />
            </div>
          </div>
        </div>
        <div className="flex flex-col space-y-2 md:mx-6 mt-20 bg-gray-200 animate-pulse h-10">
          <div
            className={`flex flex-row items-center p-2 rounded-lg hover-bg-zinc-100 w-full justify-between`}
          >
            <div className="flex flex-row space-x-4 items-center bg-gray-200 animate-pulse">
              <span className="font-semibold text-xl flex"></span>
            </div>

            <div className={`flex  bg-gray-200 animate-pulse`}>
              <Icon icon="lucide:chevron-down" width="24" height="24" />
            </div>
          </div>
        </div>
        <div className="flex flex-col space-y-2 md:mx-6 mt-20 bg-gray-200 animate-pulse h-10">
          <div
            className={`flex flex-row items-center p-2 rounded-lg hover-bg-zinc-100 w-full justify-between`}
          >
            <div className="flex flex-row space-x-4 items-center bg-gray-200 animate-pulse">
              <span className="font-semibold text-xl flex"></span>
            </div>

            <div className={`flex  bg-gray-200 animate-pulse`}>
              <Icon icon="lucide:chevron-down" width="24" height="24" />
            </div>
          </div>
        </div>
        <div className="flex flex-col space-y-2 md:mx-6 mt-20 bg-gray-200 animate-pulse h-10">
          <div
            className={`flex flex-row items-center p-2 rounded-lg hover-bg-zinc-100 w-full justify-between`}
          >
            <div className="flex flex-row space-x-4 items-center bg-gray-200 animate-pulse">
              <span className="font-semibold text-xl flex"></span>
            </div>

            <div className={`flex  bg-gray-200 animate-pulse`}>
              <Icon icon="lucide:chevron-down" width="24" height="24" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideNavLoading;
