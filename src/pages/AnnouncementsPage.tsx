import { useState } from "react";
import {
  useGetAnnouncementsQuery,
  useCreateAnnouncementMutation,
  useUpdateAnnouncementMutation,
  useDeleteAnnouncementMutation,
} from "../store/api/announcementsApi";
import { useGetDepartmentsQuery } from "../store/api/departmentsApi";
import { DataTable } from "../components/DataTable";
import { Modal } from "../components/Modal";
import { Megaphone, Plus, Calendar } from "lucide-react";
import { Announcement } from "../types";

export const AnnouncementsPage = () => {
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] =
    useState<Announcement | null>(null);

  const { data: announcementsData, isLoading } = useGetAnnouncementsQuery({
    page,
    limit: 10,
  });
  const { data: departmentsData } = useGetDepartmentsQuery();

  const [createAnnouncement, { isLoading: isCreating }] =
    useCreateAnnouncementMutation();
  const [updateAnnouncement, { isLoading: isUpdating }] =
    useUpdateAnnouncementMutation();
  const [deleteAnnouncement] = useDeleteAnnouncementMutation();

  const handleEdit = (announcement: Announcement) => {
    setEditingAnnouncement(announcement);
    setIsModalOpen(true);
  };

  const handleDelete = async (announcement: Announcement) => {
    if (confirm(`Delete announcement: ${announcement.title}?`)) {
      await deleteAnnouncement(announcement.id);
    }
  };

  const handleCreate = () => {
    setEditingAnnouncement(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get("title") as string,
      content: formData.get("content") as string,
      departmentId: (formData.get("departmentId") as string) || undefined,
    };

    if (editingAnnouncement) {
      await updateAnnouncement({ id: editingAnnouncement.id, data });
    } else {
      await createAnnouncement(data);
    }
    setIsModalOpen(false);
  };

  const columns = [
    {
      header: "Title",
      accessor: (ann: Announcement) => (
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
            <Megaphone className="w-4 h-4 text-amber-600" />
          </div>
          <span className="font-semibold text-slate-800">{ann.title}</span>
        </div>
      ),
    },
    {
      header: "Target Audience",
      accessor: (ann: Announcement) => {
        if (!ann.departmentId)
          return (
            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-lg">
              All Campus
            </span>
          );
        const dept = departmentsData?.data.find(
          (d) => d.id === ann.departmentId,
        );
        return (
          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-lg">
            {dept?.code || "Department specific"}
          </span>
        );
      },
    },
    {
      header: "Date Posted",
      accessor: (ann: Announcement) => (
        <span className="flex items-center text-slate-500 text-sm">
          <Calendar className="w-4 h-4 mr-2 text-slate-400" />
          {new Date(ann.createdAt).toLocaleDateString()}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
            Announcements
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Broadcast important information to students and staff.
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center px-4 py-2.5 bg-blue-600 text-white font-medium rounded-xl shadow-md shadow-blue-500/20 hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          New Announcement
        </button>
      </div>

      <DataTable
        columns={columns}
        data={announcementsData?.data || []}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isLoading={isLoading}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          editingAnnouncement ? "Edit Announcement" : "Broadcast Announcement"
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1 ml-1">
              Title / Headline
            </label>
            <input
              name="title"
              defaultValue={editingAnnouncement?.title}
              required
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="e.g. Schedule Update for Finals"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1 ml-1">
              Target Department (Optional)
            </label>
            <select
              name="departmentId"
              defaultValue={editingAnnouncement?.departmentId}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">Campus Wide (All Departments)</option>
              {departmentsData?.data.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
            <p className="text-xs text-slate-500 mt-1 ml-1">
              Leave empty to show to all users.
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1 ml-1">
              Content
            </label>
            <textarea
              name="content"
              defaultValue={editingAnnouncement?.content}
              required
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              rows={5}
              placeholder="Announcement details..."
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
              {editingAnnouncement ? "Save Changes" : "Broadcast Now"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
