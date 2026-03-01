import { useState } from "react";
import {
  useGetCoursesQuery,
  useCreateCourseMutation,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
} from "../store/api/coursesApi";
import { useGetDepartmentsQuery } from "../store/api/departmentsApi";
import { DataTable } from "../components/DataTable";
import { Modal } from "../components/Modal";
import { BookOpen, Plus } from "lucide-react";
import type { Course } from "../types";

export const CoursesPage = () => {
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  const { data: coursesData, isLoading } = useGetCoursesQuery({
    page,
    limit: 10,
  });
  const { data: departmentsData } = useGetDepartmentsQuery();

  const [createCourse, { isLoading: isCreating }] = useCreateCourseMutation();
  const [updateCourse, { isLoading: isUpdating }] = useUpdateCourseMutation();
  const [deleteCourse] = useDeleteCourseMutation();

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    setIsModalOpen(true);
  };

  const handleDelete = async (course: Course) => {
    if (confirm(`Are you sure you want to delete ${course.code}?`)) {
      await deleteCourse(course.id);
    }
  };

  const handleCreate = () => {
    setEditingCourse(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      code: formData.get("code") as string,
      credits: Number(formData.get("credits")),
      departmentId: formData.get("departmentId") as string,
      description: formData.get("description") as string,
    };

    if (editingCourse) {
      await updateCourse({ id: editingCourse.id, data });
    } else {
      await createCourse(data);
    }
    setIsModalOpen(false);
  };

  const columns = [
    {
      header: "Course Code",
      accessor: (course: Course) => (
        <span className="flex items-center space-x-2">
          <BookOpen className="w-4 h-4 text-emerald-600" />
          <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded">
            {course.code}
          </span>
        </span>
      ),
    },
    { header: "Course Name", accessor: "name" as const },
    {
      header: "Department",
      accessor: (course: Course) => {
        const dept = departmentsData?.data.find(
          (d) => d.id === course.departmentId,
        );
        return (
          <span className="text-slate-600">
            {dept?.name || course.departmentId}
          </span>
        );
      },
    },
    { header: "Credits", accessor: "credits" as const },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
            Courses Catalog
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Manage curriculum and credit hours.
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center px-4 py-2.5 bg-blue-600 text-white font-medium rounded-xl shadow-md shadow-blue-500/20 hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Course
        </button>
      </div>

      <DataTable
        columns={columns}
        data={coursesData?.data || []}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isLoading={isLoading}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCourse ? "Edit Course" : "Create New Course"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1 ml-1">
                Course Code
              </label>
              <input
                name="code"
                defaultValue={editingCourse?.code}
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none uppercase"
                placeholder="e.g. CS-101"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1 ml-1">
                Credits
              </label>
              <input
                type="number"
                name="credits"
                defaultValue={editingCourse?.credits || 3}
                min="1"
                max="10"
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1 ml-1">
              Course Name
            </label>
            <input
              name="name"
              defaultValue={editingCourse?.name}
              required
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="e.g. Intro to Programming"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1 ml-1">
              Department
            </label>
            <select
              name="departmentId"
              defaultValue={editingCourse?.departmentId}
              required
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">Select Dept...</option>
              {departmentsData?.data.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1 ml-1">
              Description
            </label>
            <textarea
              name="description"
              defaultValue={editingCourse?.description}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              rows={3}
              placeholder="Course overview..."
            />
          </div>

          <div className="flex justify-end pt-4 space-x-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-5 py-2.5 text-slate-600 font-medium hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreating || isUpdating}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors shadow-md shadow-blue-500/20"
            >
              {editingCourse ? "Save Changes" : "Create Course"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
