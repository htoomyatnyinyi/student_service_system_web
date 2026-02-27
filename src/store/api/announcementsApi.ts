import { baseApi } from "../baseApi";
import type { Announcement } from "../../types";

interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const announcementsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAnnouncements: builder.query<PaginatedResponse<Announcement>, any>({
      query: (params) => ({
        url: "/announcements/",
        params,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({
                type: "Announcement" as const,
                id,
              })),
              { type: "Announcement", id: "LIST" },
            ]
          : [{ type: "Announcement", id: "LIST" }],
    }),
    createAnnouncement: builder.mutation<
      { data: Announcement; message: string },
      any
    >({
      query: (data) => ({
        url: "/announcements/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Announcement", id: "LIST" }],
    }),
    updateAnnouncement: builder.mutation<
      { data: Announcement; message: string },
      { id: string; data: any }
    >({
      query: ({ id, data }) => ({
        url: `/announcements/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Announcement", id },
      ],
    }),
    deleteAnnouncement: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/announcements/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Announcement", id },
        { type: "Announcement", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetAnnouncementsQuery,
  useCreateAnnouncementMutation,
  useUpdateAnnouncementMutation,
  useDeleteAnnouncementMutation,
} = announcementsApi;
