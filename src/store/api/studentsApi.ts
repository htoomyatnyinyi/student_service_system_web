import { baseApi } from "../baseApi";
import type { Student } from "../../types";

interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const studentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getStudents: builder.query<PaginatedResponse<Student>, any>({
      query: (params) => ({
        url: "/students/",
        params,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({
                type: "Student" as const,
                id,
              })),
              { type: "Student", id: "LIST" },
            ]
          : [{ type: "Student", id: "LIST" }],
    }),
    getStudentById: builder.query<{ data: Student }, string>({
      query: (id) => `/students/${id}`,
      providesTags: (result, error, id) => [{ type: "Student", id }],
    }),
    createStudent: builder.mutation<{ data: Student; message: string }, any>({
      query: (student) => ({
        url: "/students/",
        method: "POST",
        body: student,
      }),
      invalidatesTags: [{ type: "Student", id: "LIST" }],
    }),
    updateStudent: builder.mutation<
      { data: Student; message: string },
      { id: string; data: any }
    >({
      query: ({ id, data }) => ({
        url: `/students/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Student", id }],
    }),
    deleteStudent: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/students/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Student", id },
        { type: "Student", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetStudentsQuery,
  useGetStudentByIdQuery,
  useCreateStudentMutation,
  useUpdateStudentMutation,
  useDeleteStudentMutation,
} = studentsApi;
