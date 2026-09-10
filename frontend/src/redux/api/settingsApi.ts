import { tagTypes } from "../tag-types";
import { baseApi } from "./baseApi";

const SETTINGS_URL = "/settings";

export const settingsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    settings: build.query({
      query: () => SETTINGS_URL,
      providesTags: [tagTypes.settings],
    }),
    updateSettings: build.mutation({
      query: ({ token, data }) => {
        const formData = new FormData();

        // Append each field to the formData
        formData.append("appName", data.appName);
        formData.append("creditPrice", data.creditPrice);
        formData.append("logo", data.logo); // Assuming `logo` is a file object
        formData.append("maintenanceMode", data.maintenanceMode);
        formData.append("primaryColor", data.primaryColor);
        formData.append("secondaryColor", data.secondaryColor);
        formData.append("purchaseTaxPercentage", data.purchaseTaxPercentage);

        return {
          url: SETTINGS_URL,
          method: "PATCH",
          body: formData, // Use FormData as body
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`, // The content type is handled automatically by FormData
          },
        };
      },
      invalidatesTags: [tagTypes.settings],
    }),
    getImageLink: build.query({
      query: ({ imageName }) => ({
        url: `${SETTINGS_URL}/image/${imageName}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetImageLinkQuery,
  useSettingsQuery,
  useUpdateSettingsMutation,
} = settingsApi;
