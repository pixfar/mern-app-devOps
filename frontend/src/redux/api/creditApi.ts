import { tagTypes } from "../tag-types";
import { baseApi } from "./baseApi";

const CREDIT_URL = "/payment/purchase-credit/create-payment-intent";

export const creditAPi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    credit: build.mutation({
      query: ({ credit, token }) => ({
        url: CREDIT_URL,
        method: "POST",
        body: credit,
        headers: {
          Accept: "application/json",
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }),
      invalidatesTags: [tagTypes.credit],
    }),
  }),
});

export const { useCreditMutation } = creditAPi;
