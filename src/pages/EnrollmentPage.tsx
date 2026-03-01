import { useState } from "react";
import {
  useGetSectionEnrollmentsQuery,
  useCreateEnrollmentMutation,
  useDeleteEnrollmentMutation,
} from "../store/api/enrollmentApi";
import { useGetSectionsQuery } from "../store/api/sectionsApi";
import { useGetStudentsQuery } from "../store/api/studentsApi";
import { useGetCoursesQuery } from "../store/api/coursesApi";
import { DataTable } from "../components/DataTable";
import { Modal } from "../components/Modal";
import { UserCheck, Plus } from "lucide-react";
import type { Enrollment } from "../types";

export const EnrollmentPage = () => {
  const [selectedSectionId, setSelectedSectionId] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: sectionsData } = useGetSectionsQuery({ limit: 100 });
  const { data: coursesData } = useGetCoursesQuery({ limit: 100 });
  const { data: studentsData } = useGetStudentsQuery({ limit: 100 });

  const { data: enrollmentsData, isLoading } = useGetSectionEnrollmentsQuery(
    selectedSectionId,
    {
      skip: !selectedSectionId,
    },
  );

  const [createEnrollment, { isLoading: isCreating }] =
    useCreateEnrollmentMutation();
  const [deleteEnrollment] = useDeleteEnrollmentMutation();

  const handleDelete = async (enrollment: Enrollment) => {
    if (confirm("Drop student from this course?")) {
      await deleteEnrollment(enrollment.id);
    }
  };

  const handleCreate = () => {
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      studentId: formData.get("studentId") as string,
      sectionId: selectedSectionId,
    };
    await createEnrollment(data);
    setIsModalOpen(false);
  };

  const columns = [
    {
      header: "Student Info",
      accessor: (enrollment: Enrollment) => {
        const student = studentsData?.data.find(
          (s) => s.id === enrollment.studentId,
        );
        return (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
              <span className="text-emerald-700 font-bold text-xs">
                {student?.studentId.slice(-3) || "???"}
              </span>
            </div>
            <div>
              <div className="font-semibold text-slate-800">
                {student?.studentId || enrollment.studentId}
              </div>
              <div className="text-xs text-slate-500">
                Enrolled: {new Date(enrollment.enrolledAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      header: "Status",
      accessor: (enrollment: Enrollment) => (
        <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-bold uppercase tracking-wide">
          {enrollment.status || "ACTIVE"}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
            Enrollment Management
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Manage course registrations for each class section.
          </p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-end space-x-4">
        <div className="flex-1 max-w-md">
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Select Class Section
          </label>
          <select
            value={selectedSectionId}
            onChange={(e) => setSelectedSectionId(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="">-- Choose a section to view enrollments --</option>
            {sectionsData?.data.map((section) => {
              const course = coursesData?.data.find(
                (c) => c.id === section.courseId,
              );
              return (
                <option key={section.id} value={section.id}>
                  {course?.code} ({course?.name}) - Year {section.year} Sem{" "}
                  {section.semester}
                </option>
              );
            })}
          </select>
        </div>

        <button
          onClick={handleCreate}
          disabled={!selectedSectionId}
          className="flex items-center px-5 py-2.5 bg-emerald-600 text-white font-medium rounded-lg shadow-md shadow-emerald-500/20 hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="w-5 h-5 mr-2" />
          Enroll Student
        </button>
      </div>

      {selectedSectionId ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center">
            <UserCheck className="w-5 h-5 text-emerald-600 mr-2" />
            <h3 className="font-semibold text-slate-700">
              Enrolled Students ({enrollmentsData?.data.length || 0})
            </h3>
          </div>
          <DataTable
            columns={columns}
            data={enrollmentsData?.data || []}
            onDelete={handleDelete}
            isLoading={isLoading}
          />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl border border-slate-200 border-dashed text-slate-500">
          <UserCheck className="w-12 h-12 text-slate-300 mb-4" />
          <p className="text-lg font-medium text-slate-600">
            No Section Selected
          </p>
          <p className="text-sm mt-1">
            Please select a class section from the dropdown above to view or
            manage enrollments.
          </p>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Enroll Student in Section"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1 ml-1">
              Select Student
            </label>
            <select
              name="studentId"
              required
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">-- Choose student --</option>
              {studentsData?.data.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.studentId} - {student.userId || "No Name"}
                </option>
              ))}
            </select>
          </div>
          <p className="text-sm text-slate-500 p-3 bg-blue-50 rounded-lg">
            This student will be instantly enrolled into the currently selected
            section and will appear in the attendance and grading rosters.
          </p>
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
              disabled={isCreating}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl transition-colors shadow-md shadow-emerald-500/20"
            >
              Confirm Enrollment
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
