import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import User from "@/models/user";
import {
  ApiResponse,
  PostLoginResponse,
  PostUserResponse,
} from "@/types/melanomaApiTypes";

const baseUrl = "http://192.168.100.82:3000/";

export const melanomaApi = createApi({
  reducerPath: "melanomaApi",
  baseQuery: fetchBaseQuery({ baseUrl }),
  tagTypes: ["User", "Lesion"],
  endpoints: (builder) => ({
    postUser: builder.mutation<PostUserResponse, User>({
      query: (user) => ({
        url: "user",
        method: "post",
        body: user,
      }),
      invalidatesTags: ["User"],
    }),
    postLogin: builder.query<PostLoginResponse, User>({
      query: (user) => ({
        url: "user/login",
        method: "post",
        body: user,
      }),
    }),
    getUser: builder.query<User, number>({
      query: (userId) => `user/${userId}`,
      providesTags: ["User", "Lesion"],
      transformResponse: (data: User) => {
        const lesions = data.lesions?.map((lesion) => {
          return {
            sharedWithUsers: [],
            userHasWriteNotesPermission: false,
            userIsOwner: true,
            ...lesion,
          };
        });
        return {
          ...data,
          lesions,
        };
      },
    }),
    deleteLesion: builder.mutation<ApiResponse, number>({
      query: (lesionId) => ({
        url: `lesion/${lesionId}`,
        method: "delete",
      }),
      invalidatesTags: ["Lesion", "User"],
    }),
  }),
});

export const {
  usePostUserMutation,
  usePostLoginQuery,
  useLazyPostLoginQuery,
  useGetUserQuery,
  useDeleteLesionMutation,
} = melanomaApi;
