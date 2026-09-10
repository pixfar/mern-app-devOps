"use client";
import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { toast } from "react-toastify";
import { useUserVerifyRegistationMutation } from "@/redux/api/authApi";
import LoadingData from "../Loading/UserLoading/UserLoading";

const MyPage = () => {
  const searchParams = useSearchParams();

  const router = useRouter();
  const token = searchParams.get("token");
  const [userVerifyRegistation, { isLoading, error }] =
    useUserVerifyRegistationMutation();
  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      const res = await userVerifyRegistation(token);

      // console.log("res", res);

      if (res?.data?.payload && res?.data?.payload.access_token) {
        localStorage.setItem("access_token", res.data?.payload.access_token);
        router.push("/chat");
        toast.success("Account Created Successfully");
      } else {
        toast.error("Expired verification. Please retry ! ");
        router.push("/signup");
      }
    } catch (error) {
      console.error("Error during verification:", error);
      toast.error("An error occurred during verification.");
    }
  };

  return (
    <div className="h-screen flex justify-center items-center">
      <div className="card bg-base-100 w-96 shadow-xl">
        <figure className="px-10 pt-10">
          <Image src="/images/verify.png" alt="verify" width={80} height={50} />
        </figure>
        <div className="card-body items-center text-center">
          <h2 className="card-title mb-3">E-Mail Verifizieren!</h2>
          <div className="card-actions">
            <button onClick={handleSubmit} className="btn btn-primary">
              {isLoading ? "Verifizieren..." : "Verifizieren"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Verify = () => {
  return (
    <Suspense
      fallback={
        <div>
          <LoadingData />
        </div>
      }
    >
      <MyPage />
    </Suspense>
  );
};

export default Verify;
