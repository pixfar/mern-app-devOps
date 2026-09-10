import { tagTypes } from "../tag-types";
import { baseApi } from "./baseApi";

const CONVERSATION_URL = "/model/conversation";

export const conversationApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createNote: build.mutation({
      query: ({ data, conversationId, responseId, token }) => ({
        url: `${CONVERSATION_URL}/${conversationId}/${responseId}/note`,
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: data,
      }),
      invalidatesTags: [tagTypes.conversation],
    }),

    downloadPDF: build.query({
      query: ({ id, token }) => ({
        url: `${CONVERSATION_URL}/${id}/download`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      providesTags: [tagTypes.conversation],
    }),

    allConversation: build.query({
      query: ({ token, page, limit }) => ({
        url: `/model/conversations?page=${page}&limit=${limit}`,
        headers: {
          Accept: "application/json",
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }),
      providesTags: [tagTypes.conversation],
    }),

    editConversation: build.mutation({
      query: ({ id, token, data }) => ({
        url: `${CONVERSATION_URL}/${id}/rename`,
        method: "PATCH",
        headers: {
          Accept: "application/json",
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: data,
      }),
      invalidatesTags: [tagTypes.conversation],
    }),

    noteDelete: build.mutation({
      query: ({ id, token }) => ({
        url: `${CONVERSATION_URL}/note/${id}`,
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }),
      invalidatesTags: [tagTypes.conversation],
    }),

    notes: build.query({
      query: (token) => ({
        url: `${CONVERSATION_URL}/notes?page=1&limit=10000`,
        headers: {
          Accept: "application/json",
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }),
      providesTags: [tagTypes.conversation],
    }),
  }),
});

export const {
  useCreateNoteMutation,
  useLazyDownloadPDFQuery,
  useAllConversationQuery,
  useEditConversationMutation,
  useNoteDeleteMutation,
  useNotesQuery,
} = conversationApi;
