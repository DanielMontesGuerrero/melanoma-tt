import Lesion from '@/models/lesion';
import Remainder from '@/models/remainder';
import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';

const baseUrl = 'http://192.168.100.82:3000/';

export const melanomaApi = createApi({
  reducerPath: 'melanomaApi',
  baseQuery: fetchBaseQuery({baseUrl}),
  endpoints: (builder) => ({
    getLesionById: builder.query<Lesion,number>({
      query: (id) => `lesion/${id}`,
    }),
    getLesionsByUserId: builder.query<Lesion,number>({
      query: (userId) => `user/${userId}/lesions`,
    }),
    getRemaindersByUserId: builder.query<Remainder,number>({
      query: (userId) => `user/${userId}/reminders`,
    }),
  }),
});

export const {useGetLesionByIdQuery, useGetLesionsByUserIdQuery, useGetRemaindersByUserIdQuery} = melanomaApi;
