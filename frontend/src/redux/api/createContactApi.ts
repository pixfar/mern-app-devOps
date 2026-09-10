import { tagTypes } from "../tag-types";
import { baseApi } from "./baseApi";

export const contactApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    makeContact: build.mutation({
      query: (formData) => ({
        url: `/contact/form`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: [tagTypes.user],
    }),
  }),
});

export const { useMakeContactMutation } = contactApi;
