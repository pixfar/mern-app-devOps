import { tagTypes } from "../tag-types";
import { baseApi } from "./baseApi";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

const MODEL_URL = "/model";

export const modelApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    contextualize: build.mutation({
      async queryFn({ file, token }, _queryApi, _extraOptions, fetchWithBQ) {
        const formData = new FormData();
        formData.append("document", file);

        const rest =
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NmFlNWU2YjY1ZGE4Mzk3OGQ2YTJjMTIiLCJmdWxsTmFtZSI6IkFkbWluIFVzZXIiLCJlbWFpbCI6ImFkbWluaXN0cmF0b3JAZ21haWwuY29tIiwicm9sZSI6IkFkbWluaXN0cmF0b3IiLCJpYXQiOjE3MjU3MDU4NDIsImV4cCI6MTcyNTc5MjI0Mn0.ZqYBijEKKZD4G5XvafK4z9LICPCpvowzRjmQEijftbE";
        try {
          const response = await fetchWithBQ({
            url: `https://germanlawai.pixfar.com/api/v1/model/contextualize`,
            method: "POST",
            body: formData,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          console.log(response);

          // Check for errors in the response
          if (response.error) {
            // console.log(response.error);
            return { error: response.error };
          }

          // Handle response body, assuming it might be streamed or just a plain JSON object
          const rawBody: any = response.data;
          console.log("rawBody", rawBody);

          try {
            const jsonResponse = JSON.parse(rawBody); // Try parsing the raw response
            return { data: jsonResponse }; // Return parsed JSON data
          } catch (jsonError) {
            return {
              error: {
                status: 500,
                data: { message: "Failed to parse JSON", error: jsonError },
              } as FetchBaseQueryError,
            };
          }
        } catch (fetchError) {
          return {
            error: {
              status: 500,
              data: { message: "Fetch failed", error: fetchError },
            } as FetchBaseQueryError,
          };
        }
      },
      invalidatesTags: [tagTypes.contextualize],
    }),
  }),
});

export const { useContextualizeMutation } = modelApi;
