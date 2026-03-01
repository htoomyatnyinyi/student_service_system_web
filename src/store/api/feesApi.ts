import { baseApi } from "../baseApi";
import type { Fee, Payment } from "../../types";

export const feesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createFee: builder.mutation<{ data: Fee; message: string }, any>({
      query: (data) => ({
        url: "/fees/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Fee"],
    }),
    getStudentFees: builder.query<{ data: Fee[] }, string>({
      query: (studentId) => `/fees/student/${studentId}`,
      providesTags: ["Fee"],
    }),
    createPayment: builder.mutation<{ data: Payment; message: string }, any>({
      query: (data) => ({
        url: "/fees/payments",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Fee"], // Invalidate fees to update status
    }),
    getFeePayments: builder.query<{ data: Payment[] }, string>({
      query: (feeId) => `/fees/payments/${feeId}`,
      providesTags: ["Fee"],
    }),
  }),
});

export const {
  useCreateFeeMutation,
  useGetStudentFeesQuery,
  useCreatePaymentMutation,
  useGetFeePaymentsQuery,
} = feesApi;
