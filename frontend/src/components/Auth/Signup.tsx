"use client";

import { useUserRegistationMutation } from "@/redux/api/authApi";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

const Signup = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    termsAndCondition: true,
    signingBy: "Mail Connection",
    isActive: true,
    role: "User",
  });

  const [userRegistration] = useUserRegistationMutation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await userRegistration(formData);

    // console.log("res", res);
    try {
      if (res?.data?.response === "Success") {
        router.push("/signin");
        toast.success("Please check your mail.");
      } else {
        toast.error("User Already exist!");
      }
    } catch (error) {
      // console.log("error", error);
    }
  };

  return (
    <section className="relative z-10 overflow-hidden ">
      <div className="container mx-auto">
        <div className="flex flex-wrap">
          <div className="w-full px-4">
            <div className="mx-auto max-w-[800px] w-[800px] rounded bg-orange-100 px-6 py-10 shadow-md sm:p-[60px] dark:bg-secondary dark:text-white">
              <h3 className="mb-3 text-center text-2xl font-bold sm:text-3xl">
                Account anlegen
              </h3>
              {/* <p className="mb-11 text-center text-base font-medium">
                It’s totally free and super easy
              </p> */}
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                  <div>
                    <label htmlFor="firstName" className="mb-3 block text-sm">
                      Vorname
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      placeholder="Vorname eingeben"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="input flex items-center gap-2 border-none rounded-sm bg-primary w-full placeholder:text-white"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="mb-3 block text-sm">
                      Nachname
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Nachname eingeben"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="input flex items-center gap-2 border-none rounded-sm bg-primary w-full placeholder:text-white"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="mb-3 block text-sm">
                      Deine E-Mail-Adresse
                    </label>
                    <input
                      type="email"
                      name="email"
                      placeholder="E-Mail eingeben"
                      value={formData.email}
                      onChange={handleChange}
                      className="input flex items-center gap-2 rounded-sm bg-primary w-full border-none placeholder:text-white"
                    />
                  </div>
                  <div>
                    <label htmlFor="password" className="mb-3 block text-sm">
                      Passwort
                    </label>
                    <input
                      type="password"
                      name="password"
                      placeholder="Passwort hier eingeben"
                      value={formData.password}
                      onChange={handleChange}
                      className="input flex items-center gap-2 rounded-sm bg-primary w-full border-none placeholder:text-white"
                    />
                  </div>
                </div>
                <div className="mb-8 flex gap-2">
                  <label
                    htmlFor="termsAndCondition"
                    className="flex cursor-pointer select-none text-sm font-medium text-body-color"
                  >
                    <input
                      type="checkbox"
                      name="termsAndCondition" // Match this with the state key
                      id="termsAndCondition"
                      checked={formData.termsAndCondition}
                      onChange={handleChange}
                      className="sr-only dark:bg-white"
                    />
                    <div className="box mr-4 p-1 mt-1 flex h-5 w-5 items-center justify-center rounded border border-secondary dark:border-white dark:bg-gray-800">
                      <span
                        className={
                          formData.termsAndCondition
                            ? "opacity-100"
                            : "opacity-0"
                        }
                      >
                        <svg
                          width="11"
                          height="8"
                          viewBox="0 0 11 8"
                          fill="#f3f3f3"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M10.0915 0.951972L10.0867 0.946075L10.0813 0.940568C9.90076 0.753564 9.61034 0.753146 9.42927 0.939309L4.16201 6.22962L1.58507 3.63469C1.40401 3.44841 1.11351 3.44879 0.932892 3.63584C0.755703 3.81933 0.755703 4.10875 0.932892 4.29224L0.932878 4.29225L0.934851 4.29424L3.58046 6.95832C3.73676 7.11955 3.94983 7.2 4.1473 7.2C4.36196 7.2 4.55963 7.11773 4.71406 6.9584L10.0468 1.60234C10.2436 1.4199 10.2421 1.1339 10.0915 0.951972ZM4.2327 6.30081L4.2317 6.2998C4.23206 6.30015 4.23237 6.30049 4.23269 6.30082L4.2327 6.30081Z"
                            fill="#f3f3f3"
                            stroke="#3056D3"
                            strokeWidth="0.4"
                          />
                        </svg>
                      </span>
                    </div>
                    <span>
                      Mit Registrierung erkennst Du unsere
                      <a
                        href="#0"
                        className="text-secondary hover:underline dark:text-white"
                      >
                        {" "}
                        AGB{" "}
                      </a>
                      , und
                      <a
                        href="#0"
                        className="text-secondary hover:underline dark:text-white"
                      >
                        {" "}
                        Datenschutzbestimmungen{" "}
                      </a>
                      an
                    </span>
                  </label>
                </div>
                <div className="mb-6">
                  <button className="bg-[#5C4033] text-white rounded-full w-full py-3 px-8 shadow-lg transition-transform transform hover:scale-105 hover:bg-[#7a543e] focus:outline-none focus:ring-2 focus:ring-[#5C4033] focus:ring-opacity-50 dark:bg-primary dark:text-secondary dark:font-extrabold">
                    Registrieren
                  </button>
                </div>
              </form>
              <p className="text-center text-base font-medium text-body-color">
                Bereits bei MeinJustus angemeldet?{" "}
                <Link
                  href="/signin"
                  className="text-secondary hover:underline dark:text-white"
                >
                  Hier einloggen
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
  );
};

export default Signup;
