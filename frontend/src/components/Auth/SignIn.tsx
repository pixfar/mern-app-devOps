"use client";

import { useUserLoginMutation } from "@/redux/api/authApi";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Bounce, toast } from "react-toastify";

const Signin = () => {
  const router = useRouter();
  const [toggleEye, setToggleEye] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const [userLogin, { isLoading }] = useUserLoginMutation();

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   const res = await userLogin(formData);
  //   console.log(res.data);
  //   try {
  //     if (res.data?.payload && res.data?.payload.access_token) {
  //       localStorage.setItem("access_token", res.data?.payload.access_token);
  //       router.push("/");
  //       toast.success("Login Successfully", {
  //         position: "top-center",
  //         autoClose: 5000,
  //         hideProgressBar: false,
  //         closeOnClick: true,
  //         pauseOnHover: true,
  //         draggable: true,
  //         progress: undefined,
  //         theme: "light",
  //         progressStyle: { background: "#b39c88" },
  //         className: "custom-toast-success",
  //         transition: Bounce,
  //       });
  //     } else {
  //       const errorMessage = res?.error?.data?.error || 'Login failed. Please try again.'
  //       toast.error(res?.error?.data?.error);
  //     }
  //   } catch (error) {
  //     console.log("error", error);
  //     //
  //   }
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res: any = await userLogin(formData);

      // Check if res is successful and has data
      if (res && res.data?.payload && res.data?.payload.access_token) {
        localStorage.setItem("access_token", res.data.payload.access_token);
        router.push("/chat");
        toast.success("Login erfolgreich", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          progressStyle: { background: "#b39c88" },
          className: "custom-toast-success",
          transition: Bounce,
        });
      } else {
        // Handle error scenario
        const errorMessage =
          res?.error?.data?.error ||
          "Fehler bei der Anmeldung. Bitte versuchen Sie es erneut.";
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error("Beim Anmelden ist ein Fehler aufgetreten:", error);
      toast.error(
        "Es ist ein unerwarteter Fehler aufgetreten. Bitte versuchen Sie es später noch einmal."
      );
    }
  };

  return (
    <>
      <section className=" container mx-auto relative z-10 overflow-hidden mt-10 ">
        <div className="">
          <div className="flex flex-wrap">
            <div className="w-full px-4">
              <div className="mx-auto max-w-[500px] md:w-[500px] rounded bg-orange-100 px-6 py-10 shadow-md shadow-primary sm:p-[60px] border border-secondary/10 dark:bg-secondary dark:text-white">
                <h3 className="mb-3 text-center text-2xl font-bold sm:text-3xl">
                  Anmelden
                </h3>
                {/* <p className="mb-11 text-center text-base font-medium text-body-color">
                  Login to your account for a faster checkout.
                </p> */}
                <form onSubmit={handleSubmit}>
                  <div className="mb-5">
                    <label htmlFor="email" className="mb-3 block text-sm">
                      E-Mail
                    </label>
                    <label className="input flex items-center gap-2 rounded-sm bg-primary border-none">
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Hier E-Mail-Adresse eingeben"
                        className="w-full p-2 md:placeholder:text-white"
                        required
                      />
                    </label>
                  </div>
                  <div className="mb-5 relative">
                    <label htmlFor="password" className="mb-3 block text-sm">
                      Passwort
                    </label>
                    <label className="input flex items-center gap-2 rounded-sm bg-primary border-none">
                      <input
                        type={toggleEye ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Hier Passwort eingeben"
                        className="w-full p-2 md:placeholder:text-white"
                        required
                      />
                    </label>
                    <div className="absolute top-12 right-4 cursor-pointer">
                      {toggleEye ? (
                        <div onClick={() => setToggleEye(false)}>
                          <FaEye />
                        </div>
                      ) : (
                        <div onClick={() => setToggleEye(true)}>
                          <FaEyeSlash />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="mb-5 flex flex-col justify-end sm:flex-row sm:items-center">
                    <div>
                      <Link
                        href="forget-password"
                        className="text-sm font-medium text-secondary hover:underline dark:text-white"
                      >
                        Passwort vergessen?
                      </Link>
                    </div>
                  </div>
                  <div className="mb-6">
                    <button
                      type="submit"
                      className="bg-[#5C4033] text-white rounded-full w-full py-3 px-8 shadow-lg transition-transform transform hover:scale-105 hover:bg-[#7a543e] focus:outline-none focus:ring-2 focus:ring-[#5C4033] focus:ring-opacity-50 dark:bg-primary dark:text-secondary dark:font-extrabold"
                      disabled={isLoading}
                    >
                      {"Einloggen"}
                    </button>
                  </div>
                </form>
                {/* {error && (
                  <div className="mb-4 text-red-500 text-center">
                    Error: error || Something went wrong. Please try again.
                  </div>
                )} */}
                <p className="text-center text-base font-medium ">
                  Noch keinen Zugang?{" "}
                  <Link
                    href="/signup"
                    className="text-secondary hover:underline dark:text-white"
                  >
                    Hier registrieren
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute left-0 top-0 z-[-1]">
          <svg
            width="1440"
            height="969"
            viewBox="0 0 1440 969"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <mask
              id="mask0_95:1005"
              style={{ maskType: "alpha" }}
              maskUnits="userSpaceOnUse"
              x="0"
              y="0"
              width="1440"
              height="969"
            >
              <rect width="1440" height="969" fill="#090E34" />
            </mask>
            <g mask="url(#mask0_95:1005)">
              <path
                opacity="0.1"
                d="M1086.96 297.978L632.959 554.978L935.625 535.926L1086.96 297.978Z"
                fill="url(#paint0_linear_95:1005)"
              />
              <path
                opacity="0.1"
                d="M1324.5 755.5L1450 687V886.5L1324.5 967.5L-10 288L1324.5 755.5Z"
                fill="url(#paint1_linear_95:1005)"
              />
            </g>
            <defs>
              <linearGradient
                id="paint0_linear_95:1005"
                x1="1178.4"
                y1="151.853"
                x2="780.959"
                y2="453.581"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#4A6CF7" />
                <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
              </linearGradient>
              <linearGradient
                id="paint1_linear_95:1005"
                x1="160.5"
                y1="220"
                x2="1099.45"
                y2="1192.04"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#4A6CF7" />
                <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </section>
    </>
  );
};

export default Signin;
