import { tagTypes } from "../tag-types";
import { baseApi } from "./baseApi";

const SUBSCRIPTION_URL = "/subscription";

export const subscriptionApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    subscription: build.mutation({
      query: ({ successPaymentInfo, subscriptionPlanId, token }) => ({
        url: `${SUBSCRIPTION_URL}/${subscriptionPlanId}/payment-details`,
        method: "POST",
        body: successPaymentInfo,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }),
      invalidatesTags: [tagTypes.subscription, tagTypes.user],
    }),
    subscriptionDetails: build.mutation({
      query: ({ data, token }) => ({
        url: `${SUBSCRIPTION_URL}/purchased-credit/payment-details`,
        method: "POST",
        body: data,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }),
      invalidatesTags: [tagTypes.subscription],
    }),
    getSubscriptionList: build.query({
      query: () => ({
        url: `${SUBSCRIPTION_URL}/list`,
        method: "GET",
      }),
      providesTags: [tagTypes.subscription],
    }),
    getSubscription: build.query({
      query: (token) => ({
        url: `${SUBSCRIPTION_URL}/`,
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }),
      providesTags: [tagTypes.subscription],
    }),
  }),
});

export const {
  useSubscriptionMutation,
  useGetSubscriptionQuery,
  useGetSubscriptionListQuery,
  useSubscriptionDetailsMutation,
} = subscriptionApi;
