import { baseApi } from "../baseApi";
import type { Enrollment } from "../../types";

export const enrollmentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createEnrollment: builder.mutation<
      { data: Enrollment; message: string },
      any
    >({
      query: (data) => ({
        url: "/enrollments/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Enrollment"],
    }),
    deleteEnrollment: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/enrollments/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Enrollment"],
    }),
    getStudentEnrollments: builder.query<{ data: Enrollment[] }, string>({
      query: (studentId) => `/enrollments/student/${studentId}`,
      providesTags: ["Enrollment"],
    }),
    getSectionEnrollments: builder.query<{ data: Enrollment[] }, string>({
      query: (sectionId) => `/enrollments/section/${sectionId}`,
      providesTags: ["Enrollment"],
    }),
  }),
});

export const {
  useCreateEnrollmentMutation,
  useDeleteEnrollmentMutation,
  useGetStudentEnrollmentsQuery,
  useGetSectionEnrollmentsQuery,
} = enrollmentApi;
