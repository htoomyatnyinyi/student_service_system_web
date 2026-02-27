import { baseApi } from "../baseApi";
import type { Department } from "../../types";

export const departmentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDepartments: builder.query<{ data: Department[] }, void>({
      query: () => "/departments/",
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({
                type: "Department" as const,
                id,
              })),
              { type: "Department", id: "LIST" },
            ]
          : [{ type: "Department", id: "LIST" }],
    }),
    getDepartmentById: builder.query<{ data: Department }, string>({
      query: (id) => `/departments/${id}`,
      providesTags: (result, error, id) => [{ type: "Department", id }],
    }),
    createDepartment: builder.mutation<
      { data: Department; message: string },
      any
    >({
      query: (department) => ({
        url: "/departments/",
        method: "POST",
        body: department,
      }),
      invalidatesTags: [{ type: "Department", id: "LIST" }],
    }),
    updateDepartment: builder.mutation<
      { data: Department; message: string },
      { id: string; data: any }
    >({
      query: ({ id, data }) => ({
        url: `/departments/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Department", id }],
    }),
    deleteDepartment: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/departments/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Department", id },
        { type: "Department", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetDepartmentsQuery,
  useGetDepartmentByIdQuery,
  useCreateDepartmentMutation,
  useUpdateDepartmentMutation,
  useDeleteDepartmentMutation,
} = departmentsApi;
