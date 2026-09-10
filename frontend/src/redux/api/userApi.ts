import { tagTypes } from "../tag-types";
import { baseApi } from "./baseApi";

const USER_URL = "/user";

export const userApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getUserList: build.query({
      query: (props) => ({
        url: `${USER_URL}/list`,
        method: "GET",
        params: props,
      }),
      providesTags: [tagTypes.user],
    }),
    getUser: build.query({
      query: () => ({
        url: `${USER_URL}`,
        method: "GET",
      }),
      providesTags: [tagTypes.user],
    }),
    updateUser: build.mutation({
      query: ({ data }) => {
        const formData = new FormData();

        // Append each field to the formData
        formData.append("firstName", data.firstName);
        formData.append("lastName", data.lastName);
        formData.append("dateOfBirth", data.dateOfBirth);
        formData.append("mobileNumber", data.mobileNumber);
        formData.append("zipCode", data.zipCode);
        formData.append("profileImage", data.photo);
        formData.append("isActive", data.isActive);
        formData.append("address", data.address);

        return {
          url: `${USER_URL}`,
          method: "PATCH",
          body: formData,
        };
      },
      invalidatesTags: [tagTypes.user],
    }),
    getUserByID: build.query({
      query: (id) => ({
        url: `${USER_URL}/${id}`,
        method: "GET",
      }),
      providesTags: [tagTypes.user],
    }),
    updateUserByUserID: build.mutation({
      query: ({ token, userID, data }) => {
        const formData = new FormData();

        // Append each field to the formData
        formData.append("firstName", data.firstName);
        formData.append("lastName", data.lastName);
        formData.append("dateOfBirth", data.dateOfBirth);
        formData.append("zipCode", data.zipCode);
        formData.append("profileImage", data.photo);
        formData.append("address", data.address);
        formData.append("mobileNumber", data.mobileNumber);
        formData.append("isActive", data.isActive);

        return {
          url: `${USER_URL}/${userID}`,
          method: "PATCH",
          body: formData,
          headers: {
            Accept: "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        };
      },
      invalidatesTags: [tagTypes.user],
    }),
    deleteUserByUserID: build.mutation({
      query: (userID) => ({
        url: `${USER_URL}/${userID}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.user],
    }),
  }),
});

export const {
  useGetUserListQuery,
  useGetUserQuery,
  useDeleteUserByUserIDMutation,
  useGetUserByIDQuery,
  useUpdateUserMutation,
  useUpdateUserByUserIDMutation,
} = userApi;
