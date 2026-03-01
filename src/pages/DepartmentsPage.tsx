import { useState } from "react";
import {
  useGetDepartmentsQuery,
  useCreateDepartmentMutation,
  useUpdateDepartmentMutation,
  useDeleteDepartmentMutation,
} from "../store/api/departmentsApi";
import { DataTable } from "../components/DataTable";
import { Modal } from "../components/Modal";
import { Plus, Building2 } from "lucide-react";
import type { Department } from "../types";

export const DepartmentsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(
    null,
  );

  const { data: departmentsData, isLoading } = useGetDepartmentsQuery();

  const [createDepartment, { isLoading: isCreating }] =
    useCreateDepartmentMutation();
  const [updateDepartment, { isLoading: isUpdating }] =
    useUpdateDepartmentMutation();
  const [deleteDepartment] = useDeleteDepartmentMutation();

  const handleEdit = (department: Department) => {
    setEditingDepartment(department);
    setIsModalOpen(true);
  };

  const handleDelete = async (department: Department) => {
    if (
      confirm(
        `Are you sure you want to delete the ${department.name} department?`,
      )
    ) {
      await deleteDepartment(department.id);
    }
  };

  const handleCreate = () => {
    setEditingDepartment(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      code: formData.get("code") as string,
      headName: formData.get("headName") as string,
    };

    if (editingDepartment) {
      await updateDepartment({ id: editingDepartment.id, data });
    } else {
      await createDepartment(data);
    }
    setIsModalOpen(false);
  };

  const columns = [
    {
      header: "Department Name",
      accessor: (dept: Department) => (
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mr-3">
            <Building2 className="w-4 h-4" />
          </div>
          <span className="font-medium text-slate-800">{dept.name}</span>
        </div>
      ),
    },
    {
      header: "Code",
      accessor: (dept: Department) => (
        <span className="uppercase font-mono text-xs bg-slate-100 px-2 py-1 rounded text-slate-600">
          {dept.code}
        </span>
      ),
    },
    { header: "Head of Department", accessor: "headName" as const },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
            Departments
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Manage academic branches and their heads.
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center px-4 py-2.5 bg-blue-600 text-white font-medium rounded-xl shadow-md shadow-blue-500/20 hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Department
        </button>
      </div>

      <DataTable
        columns={columns}
        data={departmentsData?.data || []}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isLoading={isLoading}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingDepartment ? "Edit Department" : "Add New Department"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1 ml-1">
              Department Name
            </label>
            <input
              name="name"
              defaultValue={editingDepartment?.name}
              required
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="e.g. Computer Science"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1 ml-1">
              Department Code
            </label>
            <input
              name="code"
              defaultValue={editingDepartment?.code}
              required
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none uppercase"
              placeholder="e.g. CS"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1 ml-1">
              Head of Department (Name)
            </label>
            <input
              name="headName"
              defaultValue={editingDepartment?.headName}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="e.g. Dr. Alan Turing"
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
              {editingDepartment ? "Save Changes" : "Create Department"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
