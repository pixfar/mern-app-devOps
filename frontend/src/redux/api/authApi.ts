import { tagTypes } from "../tag-types";
import { baseApi } from "./baseApi";

const AUTH_URL = "/auth";

export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    userRegistation: build.mutation({
      query: (registationData) => ({
        url: `${AUTH_URL}/registration`,
        method: "POST",
        body: registationData,
      }),
      invalidatesTags: [tagTypes.user],
    }),
    userVerifyRegistation: build.mutation({
      query: (token) => ({
        url: `${AUTH_URL}/verify-registration-mail/${token}`,
        method: "POST",
      }),
      invalidatesTags: [tagTypes.user],
    }),
    userLogin: build.mutation({
      query: (loginData) => ({
        url: `${AUTH_URL}/login`,
        method: "POST",
        body: loginData,
      }),
      invalidatesTags: [tagTypes.user],
    }),
    userLogout: build.mutation({
      query: ({ token }) => ({
        url: `${AUTH_URL}/logout`,
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }),
      invalidatesTags: [tagTypes.user],
    }),
    changePassword: build.mutation({
      query: (data) => ({
        url: `${AUTH_URL}/change-password`,
        method: "POST",
        contentType: "application/json",
        body: data,
      }),
      invalidatesTags: [tagTypes.user],
    }),
    forgotPassword: build.mutation({
      query: (data) => ({
        url: `${AUTH_URL}/forgot-password`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: [tagTypes.user],
    }),
    resetPassword: build.mutation({
      query: ({ formData, token }) => ({
        url: `${AUTH_URL}/reset-password`,
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }),
      invalidatesTags: [tagTypes.user],
    }),
    updateExistingPassword: build.mutation({
      query: ({ data, token }) => ({
        url: `${AUTH_URL}/update-existing-password`,
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: data,
      }),
      invalidatesTags: [tagTypes.user],
    }),
    logout: build.mutation({
      query: (token) => ({
        url: `${AUTH_URL}/logout`,
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }),
      invalidatesTags: [tagTypes.user],
    }),
  }),
});

export const {
  useUserRegistationMutation,
  useUserVerifyRegistationMutation,
  useUserLoginMutation,
  useUserLogoutMutation,
  useChangePasswordMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useUpdateExistingPasswordMutation,
  useLogoutMutation,
} = authApi;
