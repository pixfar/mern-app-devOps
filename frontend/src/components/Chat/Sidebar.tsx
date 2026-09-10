import { authKey } from "@/constant/storageKey";
import { useGetUserQuery } from "@/redux/api/userApi";
import { isToken } from "@/services/auth.service";
import { removeUserInfo } from "@/utils/stripe/local-storage";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { FaCloudUploadAlt, FaHome, FaSignOutAlt } from "react-icons/fa";
import { MdAccountCircle } from "react-icons/md";
import { RxCrossCircled } from "react-icons/rx";
import { toast } from "react-toastify";

interface SidebarProps {
  setStreamedOutput: React.Dispatch<React.SetStateAction<any[]>>;
  leftChatToggle: boolean;
  setLeftChatToggle: React.Dispatch<React.SetStateAction<boolean>>;
}

const Sidebar: React.FC<SidebarProps> = ({
  setStreamedOutput,
  leftChatToggle,
  setLeftChatToggle,
}) => {
  const [fileName, setFileName] = useState<string | null>(null);
  const router = useRouter();
  const token = isToken();
  const { data } = useGetUserQuery(token);
  const [loading, setLoading] = useState(false);

  const handleClearCurrentChat = () => {
    setStreamedOutput([]);
    setFileName(null);
  };

  const role = data?.payload[0].role;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];

      setFileName(selectedFile?.name);

      const formData = new FormData();
      formData.append("document", selectedFile);

      try {
        setLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/model/contextualize`,
          {
            method: "POST",
            body: formData,
            headers: {
              Accept: "*/*",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        if (response.body) {
          const reader = response.body.getReader();
          const decoder = new TextDecoder();

          let streamedResponse = "";
          let output = [];

          while (true) {
            const { done, value } = await reader.read();
            streamedResponse += !done
              ? decoder.decode(value, { stream: true })
              : "";

            output = [];
            let lastJsonString = streamedResponse.split("}{").pop();
            let jsonStrings = streamedResponse
              .split("}{")
              .filter((item) => (!done ? item != lastJsonString : item != ""));

            if (jsonStrings.length > 1) {
              jsonStrings = jsonStrings.map((chunk, index, array) => {
                if (index === 0) return chunk + "}";
                if (index === array.length - 1) return "{" + chunk;
                return "{" + chunk + "}";
              });
            }
            // // Merge back split JSON objects correctly
            if (jsonStrings.length > 1) {
              let resultObject = jsonStrings.map((item) => {
                try {
                  item = item.replace(/\\?\n/g, "\\n");
                  return JSON.parse(item);
                } catch (err) {
                  // Nothing to do here
                }
              });

              // Filter out undefined values (in case JSON.parse failed for some items)
              resultObject = resultObject.filter((item) => item !== undefined);

              // Update state
              setStreamedOutput((prevOutput) => [
                ...prevOutput,
                ...resultObject,
              ]);
            }

            if (done) break;
          }
          setLoading(false);
        } else {
          console.error("Response body is null.");
        }
      } catch (error) {
        console.error("Error from :", error);
      }
    }
  };

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
    router.push("/");
  };

  return (
    <div
      className={`md:w-[40%] lg:w-1/4 h-screen p-2 flex-col items-center border-r border-secondary bg-primary dark:bg-black md:flex ${
        leftChatToggle ? "absolute z-auto w-full duration-300" : "hidden"
      }`}
    >
      <div className="mb-2 flex flex-col items-center w-full border dark:border-secondary p-4 rounded-lg bg-[#ffffff99] dark:bg-black">
        <Link href={"/"}>
          <Image
            src="/images/logo/logo.png"
            alt="logo"
            width={80}
            height={80}
          />
        </Link>
      </div>

      <div
        className="md:hidden dark:text-white text-black absolute top-5 right-5 text-xl"
        onClick={() => setLeftChatToggle(false)}
      >
        <RxCrossCircled />
      </div>

      <label className="mb-2 p-4 cursor-pointer flex flex-col items-center justify-center w-full h-32 dark:text-white text-black bg-[#ffffff99] dark:bg-black rounded-lg border dark:border-secondary">
        <FaCloudUploadAlt className="text-8xl mb-3" />
        <input type="file" className="hidden" onChange={handleFileChange} />
        {loading ? (
          // <span className="loader"></span>
          <div className="flex items-center gap-1 px-2">
            <p className=" text-secondary text-center w-full animate-pulse">
              Analyzing
            </p>
            {/* {/* /* From Uiverse.io by mahendrameghwal */}
            <div className="w-full gap-x-2 flex justify-center pt-1 items-center">
              <div className="w-1 bg-[#da47ab] animate-pulse h-1 rounded-full"></div>
              <div className="w-1 animate-pulse h-1 bg-[#9869b8] rounded-full"></div>
              <div className="w-1 h-1 animate-pulse bg-[#6756cc] rounded-full"></div>
            </div>
          </div>
        ) : (
          fileName || "Upload Dein Scriptum hier"
        )}
      </label>

      <div className="w-full border dark:border-secondary px-4 pt-4 rounded-lg bg-[#ffffff99] dark:bg-black h-screen dark:text-white text-black flex flex-col font-bold">
        <ul className="flex-grow w-full">
          {/* <Link
            href={"/"}
            className="flex items-center space-x-3 cursor-pointer px-4 py-3 hover:bg-primary dark:hover:text-black rounded-lg"
          >
            <FaHome />
            <span>Heim</span>
          </Link> */}
          {/* <li
            onClick={handleClearCurrentChat}
            className="flex items-center space-x-3 cursor-pointer px-4 py-3 hover:bg-primary dark:hover:text-black rounded-lg"
          >
            <FaTrash />
            <span>Clear conversations</span>
          </li> */}
          {/* <li className="flex items-center space-x-3 cursor-pointer px-4 py-3 hover:bg-primary dark:hover:text-black rounded-lg">
            <FaCog />
            <span>Updates & FAQ</span>
          </li> */}
          {role === "Administrator" ? (
            <Link
              href={"/admin/dashboard"}
              className="flex items-center space-x-3 cursor-pointer px-4 py-3 hover:bg-primary dark:hover:text-black rounded-lg"
            >
              <MdAccountCircle />
              <span>Mein Konto</span>
            </Link>
          ) : (
            <Link
              href={"/user/dashboard"}
              className="flex items-center space-x-3 cursor-pointer px-4 py-3 hover:bg-primary dark:hover:text-black rounded-lg"
            >
              <MdAccountCircle />
              <span>Mein Konto</span>
            </Link>
          )}
        </ul>

        <div className="w-full px-4 py-2 flex justify-between items-center border border-primary rounded-lg mb-3">
          <button
            onClick={logOut}
            className="flex items-center space-x-3 w-full rounded-lg text-red-500"
          >
            <FaSignOutAlt />
            <span>Abmelden</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
