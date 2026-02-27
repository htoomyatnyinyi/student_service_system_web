import { useState } from "react";
import {
  useGetSectionsQuery,
  useCreateSectionMutation,
  useUpdateSectionMutation,
  useDeleteSectionMutation,
} from "../store/api/sectionsApi";
import { useGetCoursesQuery } from "../store/api/coursesApi";
import { DataTable } from "../components/DataTable";
import { Modal } from "../components/Modal";
import { Layers, Plus, Users } from "lucide-react";
import { Section } from "../types";

export const SectionsPage = () => {
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<Section | null>(null);

  const { data: sectionsData, isLoading } = useGetSectionsQuery({
    page,
    limit: 10,
  });
  const { data: coursesData } = useGetCoursesQuery({ limit: 100 });

  const [createSection, { isLoading: isCreating }] = useCreateSectionMutation();
  const [updateSection, { isLoading: isUpdating }] = useUpdateSectionMutation();
  const [deleteSection] = useDeleteSectionMutation();

  const handleEdit = (section: Section) => {
    setEditingSection(section);
    setIsModalOpen(true);
  };

  const handleDelete = async (section: Section) => {
    if (confirm(`Are you sure you want to delete this section?`)) {
      await deleteSection(section.id);
    }
  };

  const handleCreate = () => {
    setEditingSection(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      courseId: formData.get("courseId") as string,
      teacherId: formData.get("teacherId") as string,
      semester: Number(formData.get("semester")),
      year: Number(formData.get("year")),
      room: formData.get("room") as string,
      schedule: formData.get("schedule") as string,
      capacity: Number(formData.get("capacity")),
    };

    if (editingSection) {
      await updateSection({ id: editingSection.id, data });
    } else {
      await createSection(data);
    }
    setIsModalOpen(false);
  };

  const columns = [
    {
      header: "Course",
      accessor: (section: Section) => {
        const course = coursesData?.data.find((c) => c.id === section.courseId);
        return (
          <div>
            <div className="font-semibold text-slate-800">
              {course?.name || "Unknown Course"}
            </div>
            <div className="text-xs text-slate-500 font-mono mt-0.5">
              {course?.code || section.courseId}
            </div>
          </div>
        );
      },
    },
    {
      header: "Term",
      accessor: (section: Section) => (
        <span className="text-slate-600">
          {section.year} / Sem {section.semester}
        </span>
      ),
    },
    { header: "Room", accessor: "room" as const },
    { header: "Schedule", accessor: "schedule" as const },
    {
      header: "Capacity",
      accessor: (section: Section) => (
        <span className="flex items-center text-slate-600">
          <Users className="w-4 h-4 mr-1.5 text-slate-400" />
          {section.capacity}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
            Class Sections
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Manage class groupings, rooms, and schedules.
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center px-4 py-2.5 bg-blue-600 text-white font-medium rounded-xl shadow-md shadow-blue-500/20 hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Section
        </button>
      </div>

      <DataTable
        columns={columns}
        data={sectionsData?.data || []}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isLoading={isLoading}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingSection ? "Edit Section" : "Open New Section"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1 ml-1">
              Course
            </label>
            <select
              name="courseId"
              defaultValue={editingSection?.courseId}
              required
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">Select Course...</option>
              {coursesData?.data.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.code} - {course.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1 ml-1">
              Teacher ID
            </label>
            <input
              name="teacherId"
              defaultValue={editingSection?.teacherId}
              required
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Teacher UUID"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1 ml-1">
                Year
              </label>
              <input
                type="number"
                name="year"
                defaultValue={editingSection?.year || new Date().getFullYear()}
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
                defaultValue={editingSection?.semester || 1}
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
                Room
              </label>
              <input
                name="room"
                defaultValue={editingSection?.room}
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="e.g. A-101"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1 ml-1">
                Max Capacity
              </label>
              <input
                type="number"
                name="capacity"
                defaultValue={editingSection?.capacity || 30}
                min="1"
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1 ml-1">
              Schedule
            </label>
            <input
              name="schedule"
              defaultValue={editingSection?.schedule}
              required
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="e.g. Mon/Wed 10:00 AM - 11:30 AM"
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
              {editingSection ? "Save Changes" : "Create Section"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
