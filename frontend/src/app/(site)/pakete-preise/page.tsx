"use client";
import Modal from "@/components/Shared/Modal/Modal";
import { useGetSubscriptionPlanQuery } from "@/redux/api/subscriptionPlanApi";
import { useGetUserQuery } from "@/redux/api/userApi";
import { isToken } from "@/services/auth.service";
import { styles } from "@/utils/cn";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Loading from "../loading";

interface Plan {
  name: string;
  benefits: string;
  limitations: string;
  price: number;
  duration_days: number;
}

interface Description {
  benefits: string;
  limitation?: string;
  storage?: string;
  limitations?: string;
}

interface PayloadItem {
  _id: string;
  name: string;
  description: Description;
  price: number;
  currency: string;
  discount: number;
  duration_days: number;
  credit: number;
  isDeleted: boolean;
  isPublic: boolean;
  finalPrice: number;
  createdAt: string;
  updatedAt: string;
}

const PlansPage = () => {
  const router = useRouter();
  const token = isToken();
  const { data: user } = useGetUserQuery(token);
  const userData = user?.payload[0];

  const { data, isLoading } = useGetSubscriptionPlanQuery(token);
  const [planId, setPlanId] = useState<string | null>(null);
  const [maxPrice, setMaxPrice] = useState(0);

  useEffect(() => {
    if (data && data.payload) {
      // Extract maximum price
      const maxPriceValue = Math.max(
        ...data.payload.map((item: PayloadItem) => item.price)
      );
      setMaxPrice(maxPriceValue);
    }
  }, [data]);

  const handleSubscribe = (id: string) => {
    if (!token) {
      router.push("/signin");
      return;
    }
    setPlanId(id);
  };

  if (isLoading) {
    return <Loading />;
  }

  // Arrange plans with the max price (popular) plan in the center
  const publicPlans = data?.payload.filter((plan: any) => plan.isPublic) || [];
  const popularPlanIndex = publicPlans.findIndex(
    (plan: any) => plan.price === maxPrice
  );

  let sortedPlans;
  if (popularPlanIndex !== -1) {
    // Remove popular plan from the array
    const [popularPlan] = publicPlans.splice(popularPlanIndex, 1);
    const middleIndex = Math.floor(publicPlans.length / 2);
    // Insert popular plan in the center
    sortedPlans = [
      ...publicPlans.slice(0, middleIndex),
      popularPlan,
      ...publicPlans.slice(middleIndex),
    ];
  } else {
    sortedPlans = publicPlans;
  }

  const currentPlanId =
    userData?.subscription?.currentPlan?.subscriptionPlan?._id;

  const planStatus = userData?.subscription?.subscribedPlanStatus;
  console.log({ currentPlanId, planStatus });

  return (
    <div>
      <div className="pt-20">{<Modal planId={planId} />}</div>
      <div className="container mx-auto my-auto mb-8 min-h-screen">
        <div className="mt-5 md:mt-0 py-10">
          <h1 className="text-4xl font-bold text-center">Pakete und Preise</h1>
          {/* <p className="text-lg mt-3 md:w-3/6 mx-auto text-center px-4">
            No shady charges, no unexpected shocks! Stick to one flat fee, month
            after month. No money surprises here!
          </p> */}
        </div>
        <div className="mx-auto flex flex-col lg:flex-row md:mt-24 justify-center items-center px- gap-10 lg:gap-0 px-4 md:px-0 md:max-w-[80%] ">
          {sortedPlans?.map((plan: any) => {
            const currentPlan =
              userData?.subscription?.currentPlan?.subscriptionPlan?._id ===
              plan?._id;

            return (
              <div
                key={plan?._id}
                className={styles(
                  `shadow-xl px-10 duration-300 py-10 relative rounded-lg ${
                    sortedPlans.length === 1 && "lg:w-[35%]"
                  }`,
                  {
                    "bg-gradient-to-t to-[#B29B87] from-[#71584B] dark:to-[#B19A86] dark:from-[#5e483f] scale-110 scale-y-125 z-10 group":
                      plan.price >= maxPrice,
                  },
                  {
                    "bg-[#ffffff99] dark:[#ffffff99]":
                      plan.finalPrice <= maxPrice,
                  }
                )}
              >
                {plan.price >= maxPrice && (
                  <div className="absolute top-2 bg-orange-500 -right-3 text-white px-4 rounded py-1 dark:bg-secondary">
                    Bestseller
                  </div>
                )}
                <div className="min-h-[400px] max-h-[500px]">
                  <h2 className="text-2xl font-bold mb-2">{plan?.name}</h2>
                  <p className="mb-5">{plan?.description?.benefits}</p>
                  <div className="text-3xl font-bold mb-5">
                    &#8364;{plan?.price}
                    <span className="text-lg font-normal"></span>
                  </div>
                  {/* <p className="mb-5">
                    Pause or cancel anytime. 7 days money-back guarantee
                  </p> */}
                  <ul className="mb-5 space-y-1">
                    {Object.values(plan?.description)?.map((i, index) => (
                      <li key={index}>✔ {i as string}</li>
                    ))}
                  </ul>
                </div>

                <button
                  disabled={plan?.finalPrice === 0}
                  className={` w-full ${
                    plan?.finalPrice === 0 || currentPlanId
                      ? "bg-black cursor-not-allowed"
                      : "bg-black"
                  } text-white rounded-full py-2 font-semibold`}
                  onClick={() => {
                    if (currentPlanId) return;
                    handleSubscribe(plan?._id);
                    const modal = document.getElementById(
                      "my_modal_5"
                    ) as HTMLDialogElement;
                    if (modal) {
                      modal.showModal();
                    }
                  }}
                >
                  {currentPlan
                    ? "Plan erneuern"
                    : plan?.finalPrice === 0
                    ? "Aktiv"
                    : "Jetzt buchen"}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PlansPage;
