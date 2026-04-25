import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL || '/api',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) headers.set('authorization', `Bearer ${token}`);
      return headers;
    }
  }),
  tagTypes: ['Attendance', 'User'],
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({ url: '/auth/login', method: 'POST', body: credentials })
    }),
    signup: builder.mutation({
      query: (data) => ({ url: '/auth/signup', method: 'POST', body: data })
    }),
    getMe: builder.query({
      query: () => '/auth/me'
    }),
    punchIn: builder.mutation({
      query: (data) => ({ url: '/attendance/punch-in', method: 'POST', body: data }),
      invalidatesTags: ['Attendance']
    }),
    punchOut: builder.mutation({
      query: (data) => ({ url: '/attendance/punch-out', method: 'POST', body: data }),
      invalidatesTags: ['Attendance']
    }),
    getTodayAttendance: builder.query({
      query: () => '/attendance/today',
      providesTags: ['Attendance']
    }),
    getMyAttendance: builder.query({
      query: () => '/attendance/my-attendance',
      providesTags: ['Attendance']
    }),
    getAllAttendance: builder.query({
      query: () => '/attendance/all',
      providesTags: ['Attendance']
    }),
    validateAttendance: builder.mutation({
      query: ({ id, ...data }) => ({ url: `/attendance/validate/${id}`, method: 'PUT', body: data }),
      invalidatesTags: ['Attendance']
    }),
    requestOvertime: builder.mutation({
      query: (data) => ({ url: '/attendance/overtime/request', method: 'POST', body: data }),
      invalidatesTags: ['Attendance']
    }),
    approveOvertime: builder.mutation({
      query: ({ id, status }) => ({ url: `/attendance/overtime/approve/${id}`, method: 'PUT', body: { status } }),
      invalidatesTags: ['Attendance']
    }),
    getDailyReport: builder.query({
      query: (date) => `/attendance/report${date ? `?date=${date}` : ''}`,
      providesTags: ['Attendance']
    }),
    getAllUsers: builder.query({
      query: () => '/users',
      providesTags: ['User']
    })
  })
});

export const {
  useLoginMutation,
  useSignupMutation,
  useGetMeQuery,
  usePunchInMutation,
  usePunchOutMutation,
  useGetTodayAttendanceQuery,
  useGetMyAttendanceQuery,
  useGetAllAttendanceQuery,
  useValidateAttendanceMutation,
  useRequestOvertimeMutation,
  useApproveOvertimeMutation,
  useGetDailyReportQuery,
  useGetAllUsersQuery
} = api;
