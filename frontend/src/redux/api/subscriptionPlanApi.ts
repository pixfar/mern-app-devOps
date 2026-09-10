import { tagTypes } from "../tag-types";
import { baseApi } from "./baseApi";

const SUBCRIPTION_PLAN_URL = "/subscription-plan";

export const subscriptionPlanApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    subscriptionPlan: build.mutation({
      query: ({ data, token }) => ({
        url: `${SUBCRIPTION_PLAN_URL}`,
        method: "POST",
        body: data,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }),
      invalidatesTags: [tagTypes.subscriptionPlan],
    }),

    getSubscriptionPlan: build.query({
      query: () => ({
        url: `${SUBCRIPTION_PLAN_URL}`,
        method: "GET",
      }),
      providesTags: [tagTypes.subscriptionPlan],
    }),
    getSubscriptionPlanForAdmin: build.query({
      query: () => ({
        url: `${SUBCRIPTION_PLAN_URL}/list`,
        method: "GET",
      }),
      providesTags: [tagTypes.subscriptionPlan],
    }),
    getSubscriptionPlanByID: build.query({
      query: (id) => ({
        url: `${SUBCRIPTION_PLAN_URL}/${id}`,
        method: "GET",
      }),
      providesTags: [tagTypes.subscriptionPlan],
    }),
    updateSubscriptionPlanByID: build.mutation({
      query: ({ id, data }) => ({
        url: `${SUBCRIPTION_PLAN_URL}/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: [tagTypes.subscriptionPlan],
    }),
    deleteSubscriptionPlanByID: build.mutation({
      query: (id) => ({
        url: `${SUBCRIPTION_PLAN_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.subscriptionPlan],
    }),
  }),
});

export const {
  useSubscriptionPlanMutation,
  useGetSubscriptionPlanQuery,
  useGetSubscriptionPlanForAdminQuery,
  useGetSubscriptionPlanByIDQuery,
  useUpdateSubscriptionPlanByIDMutation,
  useDeleteSubscriptionPlanByIDMutation,
} = subscriptionPlanApi;
