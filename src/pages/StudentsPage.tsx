import { useState } from "react";
import {
  useGetStudentsQuery,
  useCreateStudentMutation,
  useUpdateStudentMutation,
  useDeleteStudentMutation,
} from "../store/api/studentsApi";
import { useGetDepartmentsQuery } from "../store/api/departmentsApi";
import { DataTable } from "../components/DataTable";
import { Modal } from "../components/Modal";
import { Plus, UserPlus } from "lucide-react";
import type { Student } from "../types";

export const StudentsPage = () => {
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  const { data: studentsData, isLoading } = useGetStudentsQuery({
    page,
    limit: 10,
  });
  const { data: departmentsData } = useGetDepartmentsQuery();

  const [createStudent, { isLoading: isCreating }] = useCreateStudentMutation();
  const [updateStudent, { isLoading: isUpdating }] = useUpdateStudentMutation();
  const [deleteStudent] = useDeleteStudentMutation();

  const handleEdit = (student: Student) => {
    setEditingStudent(student);
    setIsModalOpen(true);
  };

  const handleDelete = async (student: Student) => {
    if (confirm(`Are you sure you want to delete ${student.studentId}?`)) {
      await deleteStudent(student.id);
    }
  };

  const handleCreate = () => {
    setEditingStudent(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      userId: formData.get("userId"), // Simplified for this demo
      studentId: formData.get("studentId"),
      dateOfBirth: formData.get("dateOfBirth")
        ? new Date(formData.get("dateOfBirth") as string).toISOString()
        : new Date().toISOString(),
      gender: formData.get("gender"),
      departmentId: formData.get("departmentId"),
      year: Number(formData.get("year")),
      semester: Number(formData.get("semester")),
      phone: formData.get("phone"),
      address: formData.get("address"),
    };

    if (editingStudent) {
      await updateStudent({ id: editingStudent.id, data });
    } else {
      await createStudent(data);
    }
    setIsModalOpen(false);
  };

  const columns = [
    { header: "Student ID", accessor: "studentId" as const },
    {
      header: "Department",
      accessor: (student: Student) => {
        const dept = departmentsData?.data.find(
          (d) => d.id === student.departmentId,
        );
        return (
          <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-medium">
            {dept?.code || student.departmentId}
          </span>
        );
      },
    },
    { header: "Year", accessor: "year" as const },
    { header: "Semester", accessor: "semester" as const },
    { header: "Gender", accessor: "gender" as const },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
            Students Directory
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Manage student records, departments, and academic status.
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center px-4 py-2.5 bg-blue-600 text-white font-medium rounded-xl shadow-md shadow-blue-500/20 hover:bg-blue-700 transition-colors"
        >
          <UserPlus className="w-5 h-5 mr-2" />
          Add Student
        </button>
      </div>

      <DataTable
        columns={columns}
        data={studentsData?.data || []}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isLoading={isLoading}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingStudent ? "Edit Student" : "Register New Student"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1 ml-1">
                Student ID #
              </label>
              <input
                name="studentId"
                defaultValue={editingStudent?.studentId}
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="e.g. STU-2026-001"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1 ml-1">
                User ID
              </label>
              <input
                name="userId"
                defaultValue={editingStudent?.userId}
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Linked User UUID"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1 ml-1">
                Department
              </label>
              <select
                name="departmentId"
                defaultValue={editingStudent?.departmentId}
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="">Select Dept...</option>
                {departmentsData?.data.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name} ({dept.code})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1 ml-1">
                Gender
              </label>
              <select
                name="gender"
                defaultValue={editingStudent?.gender}
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1 ml-1">
                Academic Year
              </label>
              <input
                type="number"
                name="year"
                defaultValue={editingStudent?.year || 1}
                min="1"
                max="5"
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1 ml-1">
                Semester
              </label>
              <input
                type="number"
                name="semester"
                defaultValue={editingStudent?.semester || 1}
                min="1"
                max="10"
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1 ml-1">
                Date of Birth
              </label>
              <input
                type="date"
                name="dateOfBirth"
                defaultValue={
                  editingStudent?.dateOfBirth
                    ? new Date(editingStudent.dateOfBirth)
                        .toISOString()
                        .split("T")[0]
                    : ""
                }
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1 ml-1">
                Phone
              </label>
              <input
                name="phone"
                defaultValue={editingStudent?.phone}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="+1..."
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1 ml-1">
              Address
            </label>
            <textarea
              name="address"
              defaultValue={editingStudent?.address}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              rows={2}
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
              {editingStudent ? "Save Changes" : "Register Student"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
