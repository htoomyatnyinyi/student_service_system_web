import { baseApi } from "../baseApi";
import type { Attendance } from "../../types";

export const attendanceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createAttendance: builder.mutation<
      { data: Attendance; message: string },
      any
    >({
      query: (data) => ({
        url: "/attendance/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Attendance"],
    }),
    bulkAttendance: builder.mutation<{ message: string; count: number }, any>({
      query: (data) => ({
        url: "/attendance/bulk",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Attendance"],
    }),
    getSectionAttendance: builder.query<
      { data: Attendance[] },
      { sectionId: string; date?: string }
    >({
      query: ({ sectionId, date }) => {
        const params = new URLSearchParams();
        if (date) params.append("date", date);
        return `/attendance/section/${sectionId}?${params.toString()}`;
      },
      providesTags: ["Attendance"],
    }),
    getStudentAttendance: builder.query<
      { data: Attendance[] },
      { studentId: string; sectionId?: string }
    >({
      query: ({ studentId, sectionId }) => {
        const params = new URLSearchParams();
        if (sectionId) params.append("sectionId", sectionId);
        return `/attendance/student/${studentId}?${params.toString()}`;
      },
      providesTags: ["Attendance"],
    }),
  }),
});

export const {
  useCreateAttendanceMutation,
  useBulkAttendanceMutation,
  useGetSectionAttendanceQuery,
  useGetStudentAttendanceQuery,
} = attendanceApi;
