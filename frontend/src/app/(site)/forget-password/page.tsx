"use client";

import { useForgotPasswordMutation } from "@/redux/api/authApi";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

const ForgetPasswordPage = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
  });
  const [forgotPassword] = useForgotPasswordMutation();

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await forgotPassword(formData);
    try {
      if (res.data?.payload && res.data?.payload.access_token) {
        localStorage.setItem("access_token", res.data?.payload.access_token);
        toast.success("Please check your mail.");
        router.push("/reset-password");
      }
    } catch (error) {}
  };

  return (
    <>
      <section className="relative z-10 overflow-hidden pb-16 pt-36 md:pb-20 lg:pb-40 lg:pt-[180px] h-screen">
        <div className="container mx-auto">
          <div className="flex flex-wrap">
            <div className="w-full px-4">
              <div className="mx-auto max-w-[500px] rounded bg-orange-100 px-6 py-10 shadow-md sm:p-[60px] dark:bg-secondary dark:text-white">
                <h3 className="mb-3 text-center text-2xl font-bold sm:text-3xl">
                  Kontowiederherstellung
                </h3>
                <p className="mb-11 text-center text-base font-medium text-body-color">
                  Eine SMS mit einem vierstelligen Bestätigungscode wurde gerade
                  an Ihre E-Mail-Adresse gesendet
                </p>
                <form onSubmit={handleSubmit}>
                  <div className="mb-8">
                    <label htmlFor="email" className="mb-3 block text-sm">
                      Ihre E-Mail
                    </label>
                    <label className="input flex items-center gap-2 rounded-sm bg-primary border-none">
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Geben Sie Ihre E-Mail-Adresse ein"
                        className="w-full p-2 md:placeholder:text-white"
                        required
                      />
                    </label>
                  </div>

                  <div className="mb-6">
                    <button
                      type="submit"
                      className="bg-[#5C4033] text-white rounded-full w-full py-3 px-8 shadow-lg transition-transform transform hover:scale-105 hover:bg-[#7a543e] focus:outline-none focus:ring-2 focus:ring-[#5C4033] focus:ring-opacity-50"
                      // disabled={isLoading}
                    >
                      {"Schicken"}
                    </button>
                  </div>
                </form>
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

export default ForgetPasswordPage;
