import { baseApi } from "../baseApi";
import type { Grade } from "../../types";

export const gradesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createGrade: builder.mutation<{ data: Grade; message: string }, any>({
      query: (data) => ({
        url: "/grades/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Grade"],
    }),
    updateGrade: builder.mutation<
      { data: Grade; message: string },
      { id: string; data: any }
    >({
      query: ({ id, data }) => ({
        url: `/grades/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Grade"],
    }),
    getStudentGrades: builder.query<{ data: Grade[] }, string>({
      query: (studentId) => `/grades/student/${studentId}`,
      providesTags: ["Grade"],
    }),
  }),
});

export const {
  useCreateGradeMutation,
  useUpdateGradeMutation,
  useGetStudentGradesQuery,
} = gradesApi;
