import { useState } from "react";
import {
  useGetBooksQuery,
  useCreateBookMutation,
  useBorrowBookMutation,
  useReturnBookMutation,
} from "../store/api/libraryApi";
import { useGetStudentsQuery } from "../store/api/studentsApi";
import { DataTable } from "../components/DataTable";
import { Modal } from "../components/Modal";
import { Library, Plus, Search } from "lucide-react";
import { Book } from "../types";

export const LibraryPage = () => {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [isBorrowModalOpen, setIsBorrowModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  const { data: recordsData, isLoading: recordsLoading } = useGetBooksQuery({
    page,
    limit: 10,
    search: searchQuery,
  });
  const { data: studentsData } = useGetStudentsQuery({ limit: 100 });

  const [createBook, { isLoading: isCreatingBook }] = useCreateBookMutation();
  const [borrowBook, { isLoading: isBorrowing }] = useBorrowBookMutation();
  const [returnBook] = useReturnBookMutation();

  const handleBookSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get("title") as string,
      author: formData.get("author") as string,
      isbn: formData.get("isbn") as string,
      category: formData.get("category") as string,
      totalCopies: Number(formData.get("totalCopies")),
    };

    await createBook(data);
    setIsBookModalOpen(false);
  };

  const handleBorrowSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      bookId: selectedBook!.id,
      studentId: formData.get("studentId") as string,
      dueDate: new Date(formData.get("dueDate") as string).toISOString(),
    };

    await borrowBook(data);
    setIsBorrowModalOpen(false);
  };

  const columns = [
    {
      header: "Book Info",
      accessor: (book: Book) => (
        <div>
          <div className="font-semibold text-slate-800">{book.title}</div>
          <div className="text-xs text-slate-500 mt-0.5">by {book.author}</div>
        </div>
      ),
    },
    {
      header: "ISBN",
      accessor: (book: Book) => (
        <span className="font-mono text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">
          {book.isbn}
        </span>
      ),
    },
    { header: "Category", accessor: "category" as const },
    {
      header: "Availability",
      accessor: (book: Book) => {
        // Mock fallback if API doesn't populate availableCopies properly
        const available = book.availableCopies ?? book.totalCopies;
        const total = book.totalCopies;
        return (
          <div className="flex items-center space-x-2">
            <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden w-full max-w-[80px]">
              <div
                className={`h-full rounded-full ${available === 0 ? "bg-red-500" : available < total / 2 ? "bg-amber-500" : "bg-emerald-500"}`}
                style={{ width: `${(available / total) * 100}%` }}
              ></div>
            </div>
            <span
              className={`text-xs font-semibold ${available === 0 ? "text-red-600" : "text-slate-600"}`}
            >
              {available} / {total}
            </span>
          </div>
        );
      },
    },
    {
      header: "Actions",
      accessor: (book: Book) => {
        const available = book.availableCopies ?? book.totalCopies;
        return (
          <button
            onClick={() => {
              setSelectedBook(book);
              setIsBorrowModalOpen(true);
            }}
            disabled={available === 0}
            className={`px-3 py-1.5 font-medium rounded-lg text-sm transition-colors ${
              available > 0
                ? "bg-blue-50 text-blue-600 hover:bg-blue-100"
                : "bg-slate-100 text-slate-400 cursor-not-allowed"
            }`}
          >
            Lend Book
          </button>
        );
      },
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
            Library Repository
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Manage books and circulation records.
          </p>
        </div>
        <button
          onClick={() => setIsBookModalOpen(true)}
          className="flex items-center px-4 py-2.5 bg-blue-600 text-white font-medium rounded-xl shadow-md shadow-blue-500/20 hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Book to Catalog
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-lg bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none text-slate-800 placeholder-slate-400 transition-shadow"
            placeholder="Search catalog by title, author, or ISBN..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center">
          <Library className="w-5 h-5 text-blue-600 mr-2" />
          <h3 className="font-semibold text-slate-700">Catalog Collection</h3>
        </div>
        <DataTable
          columns={columns}
          data={recordsData?.data || []}
          isLoading={recordsLoading}
        />
      </div>

      {/* Add New Book Modal */}
      <Modal
        isOpen={isBookModalOpen}
        onClose={() => setIsBookModalOpen(false)}
        title="Add New Book"
      >
        <form onSubmit={handleBookSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1 ml-1">
              Title
            </label>
            <input
              name="title"
              required
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="e.g. Introduction to Algorithms"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1 ml-1">
              Author(s)
            </label>
            <input
              name="author"
              required
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="e.g. Thomas H. Cormen"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1 ml-1">
                ISBN
              </label>
              <input
                name="isbn"
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm"
                placeholder="978-0262033848"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1 ml-1">
                No. of Copies
              </label>
              <input
                type="number"
                min="1"
                name="totalCopies"
                defaultValue={1}
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1 ml-1">
              Category / Genre
            </label>
            <input
              name="category"
              required
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="e.g. Computer Science, Fiction"
            />
          </div>

          <div className="flex justify-end pt-4 space-x-3">
            <button
              type="button"
              onClick={() => setIsBookModalOpen(false)}
              className="px-5 py-2.5 text-slate-600 font-medium hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreatingBook}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors shadow-md shadow-blue-500/20"
            >
              Add Catalog Entry
            </button>
          </div>
        </form>
      </Modal>

      {/* Borrow Book Modal */}
      <Modal
        isOpen={isBorrowModalOpen}
        onClose={() => setIsBorrowModalOpen(false)}
        title="Circulation - Lend Book"
      >
        <form onSubmit={handleBorrowSubmit} className="space-y-4">
          <div className="p-4 bg-emerald-50 text-emerald-800 rounded-lg border border-emerald-100 mb-4">
            <div className="font-semibold">{selectedBook?.title}</div>
            <div className="text-xs mt-1 text-emerald-600/80">
              Author: {selectedBook?.author} | ISBN: {selectedBook?.isbn}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1 ml-1">
              Borrowing Student
            </label>
            <select
              name="studentId"
              required
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">-- Choose student --</option>
              {studentsData?.data.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.studentId} - {student.userId || "User"}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1 ml-1">
              Return Due Date
            </label>
            <input
              type="date"
              name="dueDate"
              defaultValue={
                new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
                  .toISOString()
                  .split("T")[0]
              }
              required
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <p className="text-xs text-slate-500 mt-1 ml-1">
              Default is 14 days from today.
            </p>
          </div>

          <div className="flex justify-end pt-4 space-x-3">
            <button
              type="button"
              onClick={() => setIsBorrowModalOpen(false)}
              className="px-5 py-2.5 text-slate-600 font-medium hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isBorrowing}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl transition-colors shadow-md shadow-emerald-500/20"
            >
              Lend Book
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
