import { baseApi } from "../baseApi";
import { Section } from "../../types";

interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const sectionsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSections: builder.query<PaginatedResponse<Section>, any>({
      query: (params) => ({
        url: "/sections/",
        params,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({
                type: "Section" as const,
                id,
              })),
              { type: "Section", id: "LIST" },
            ]
          : [{ type: "Section", id: "LIST" }],
    }),
    getSectionById: builder.query<{ data: Section }, string>({
      query: (id) => `/sections/${id}`,
      providesTags: (result, error, id) => [{ type: "Section", id }],
    }),
    createSection: builder.mutation<{ data: Section; message: string }, any>({
      query: (section) => ({
        url: "/sections/",
        method: "POST",
        body: section,
      }),
      invalidatesTags: [{ type: "Section", id: "LIST" }],
    }),
    updateSection: builder.mutation<
      { data: Section; message: string },
      { id: string; data: any }
    >({
      query: ({ id, data }) => ({
        url: `/sections/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Section", id }],
    }),
    deleteSection: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/sections/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Section", id },
        { type: "Section", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetSectionsQuery,
  useGetSectionByIdQuery,
  useCreateSectionMutation,
  useUpdateSectionMutation,
  useDeleteSectionMutation,
} = sectionsApi;
