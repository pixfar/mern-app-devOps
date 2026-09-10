import { tagTypes } from "../tag-types";
import { baseApi } from "./baseApi";

const PAYMENT_URL = "/payment";

export const paymentApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    payment: build.mutation({
      query: ({ subscriptionPlanId, token }) => ({
        url: `${PAYMENT_URL}/${subscriptionPlanId}/create-payment-intent`,
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }),
      invalidatesTags: [tagTypes.subscription],
    }),
  }),
});

export const { usePaymentMutation } = paymentApi;
