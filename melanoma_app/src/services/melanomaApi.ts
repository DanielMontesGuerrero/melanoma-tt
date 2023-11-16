import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import Lesion from "@/models/lesion";
import Remainder from "@/models/remainder";
import User from "@/models/user";
import { PostLoginResponse, PostUserResponse } from "@/types/melanomaApiTypes";

const baseUrl = "http://192.168.100.82:3000/";

export const melanomaApi = createApi({
  reducerPath: "melanomaApi",
  baseQuery: fetchBaseQuery({ baseUrl }),
  endpoints: (builder) => ({
    getLesionById: builder.query<Lesion, number>({
      query: (id) => `lesion/${id}`,
    }),
    getLesionsByUserId: builder.query<Lesion, number>({
      query: (userId) => `user/${userId}/lesions`,
    }),
    getRemaindersByUserId: builder.query<Remainder, number>({
      query: (userId) => `user/${userId}/reminders`,
    }),
    postUser: builder.mutation<PostUserResponse, User>({
      query: (user) => ({
        url: "user",
        method: "post",
        body: user,
      }),
    }),
    postLogin: builder.query<PostLoginResponse, User>({
      query: (user) => ({
        url: "user/login",
        method: "post",
        body: user,
      }),
    }),
  }),
});

export const {
  useGetLesionByIdQuery,
  useGetLesionsByUserIdQuery,
  useGetRemaindersByUserIdQuery,
  usePostUserMutation,
  usePostLoginQuery,
  useLazyPostLoginQuery,
} = melanomaApi;
