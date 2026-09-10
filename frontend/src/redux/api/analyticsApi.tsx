import { tagTypes } from "../tag-types";
import { baseApi } from "./baseApi";

export const analyticsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    adminAnalitics: build.query({
      query: ({ token }) => ({
        url: `dashboard/analytics`,
        headers: {
          Accept: "application/json",
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }),
      providesTags: [tagTypes.analytics],
    }),
  }),
});

export const { useAdminAnaliticsQuery } = analyticsApi;
