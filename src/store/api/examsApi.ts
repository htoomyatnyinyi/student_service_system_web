import { baseApi } from "../baseApi";
import { Exam, ExamResult } from "../../types";

export const examsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createExam: builder.mutation<{ data: Exam; message: string }, any>({
      query: (data) => ({
        url: "/exams/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Exam"],
    }),
    getSectionExams: builder.query<{ data: Exam[] }, string>({
      query: (sectionId) => `/exams/section/${sectionId}`,
      providesTags: ["Exam"],
    }),
    createResult: builder.mutation<{ data: ExamResult; message: string }, any>({
      query: (data) => ({
        url: "/exams/results",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Exam"],
    }),
    bulkResults: builder.mutation<{ message: string; count: number }, any>({
      query: (data) => ({
        url: "/exams/results/bulk",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Exam"],
    }),
    getStudentResults: builder.query<{ data: ExamResult[] }, string>({
      query: (studentId) => `/exams/results/student/${studentId}`,
      providesTags: ["Exam"],
    }),
    getExamResults: builder.query<{ data: ExamResult[] }, string>({
      query: (examId) => `/exams/results/${examId}`,
      providesTags: ["Exam"],
    }),
  }),
});

export const {
  useCreateExamMutation,
  useGetSectionExamsQuery,
  useCreateResultMutation,
  useBulkResultsMutation,
  useGetStudentResultsQuery,
  useGetExamResultsQuery,
} = examsApi;
