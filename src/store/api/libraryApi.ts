import { baseApi } from "../baseApi";
import type { Book, BorrowRecord } from "../../types";

interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const libraryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBooks: builder.query<PaginatedResponse<Book>, any>({
      query: (params) => ({
        url: "/library/books",
        params,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: "Book" as const, id })),
              { type: "Book", id: "LIST" },
            ]
          : [{ type: "Book", id: "LIST" }],
    }),
    createBook: builder.mutation<{ data: Book; message: string }, any>({
      query: (data) => ({
        url: "/library/books",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Book", id: "LIST" }],
    }),
    borrowBook: builder.mutation<{ data: BorrowRecord; message: string }, any>({
      query: (data) => ({
        url: "/library/borrow",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Book"], // To update available copies
    }),
    returnBook: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/library/return/${id}`,
        method: "PUT",
      }),
      invalidatesTags: ["Book"], // To update available copies
    }),
    getStudentBorrows: builder.query<{ data: BorrowRecord[] }, string>({
      query: (studentId) => `/library/borrows/student/${studentId}`,
      providesTags: ["Book"],
    }),
  }),
});

export const {
  useGetBooksQuery,
  useCreateBookMutation,
  useBorrowBookMutation,
  useReturnBookMutation,
  useGetStudentBorrowsQuery,
} = libraryApi;
