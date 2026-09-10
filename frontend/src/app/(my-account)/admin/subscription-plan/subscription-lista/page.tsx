"use client";
import LoadingData from "@/components/Loading/UserLoading/UserLoading";
import { useGetSubscriptionListQuery } from "@/redux/api/subscriptionApi";
import React from "react";

interface SubscriptionPlan {
  _id: string;
  name: string;
  price: number;
  currency: string;
  duration_days: number;
}

interface SubscriptionDetail {
  subscriptionPlan: SubscriptionPlan;
}

interface PlanData {
  subscriptionDetails: SubscriptionDetail[];
}

const SubscriptionListPage = () => {
  const { data, isLoading } = useGetSubscriptionListQuery({});

  if (isLoading) {
    return <LoadingData />;
  }
  return (
    <div>
      <h2 className="text-2xl font-bold text-secondary text-start mb-10">
        Subscription List
      </h2>
      <div className="bg-white mb-10 rounded shadow-md">
        <div className="overflow-x-auto">
          <table className="table">
            {/* head */}
            <thead>
              <tr>
                <th>Name</th>
                <th>Price</th>
                <th>Currency</th>
                <th>Duration</th>
              </tr>
            </thead>
            <tbody>
              {data.map((planData: PlanData) => (
                <tr key={planData?.subscriptionDetails[0].subscriptionPlan._id}>
                  <td>
                    {planData?.subscriptionDetails[0].subscriptionPlan.name}
                  </td>
                  <td>
                    {planData?.subscriptionDetails[0].subscriptionPlan.price}
                  </td>
                  <td>
                    {planData?.subscriptionDetails[0].subscriptionPlan.currency}
                  </td>
                  <td>
                    {
                      planData?.subscriptionDetails[0].subscriptionPlan
                        .duration_days
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionListPage;
