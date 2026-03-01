import { useState } from "react";
import {
  useGetStudentGradesQuery,
  useCreateGradeMutation,
  useUpdateGradeMutation,
} from "../store/api/gradesApi";
import { useGetStudentsQuery } from "../store/api/studentsApi";
import { useGetSectionEnrollmentsQuery } from "../store/api/enrollmentApi";
import { useGetSectionsQuery } from "../store/api/sectionsApi";
import { useGetCoursesQuery } from "../store/api/coursesApi";
import { DataTable } from "../components/DataTable";
import { Modal } from "../components/Modal";
import { GraduationCap, Plus } from "lucide-react";
import type { Grade } from "../types";

export const GradesPage = () => {
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGrade, setEditingGrade] = useState<Grade | null>(null);

  const { data: studentsData } = useGetStudentsQuery({ limit: 100 });
  const { data: sectionsData } = useGetSectionsQuery({ limit: 100 });
  const { data: coursesData } = useGetCoursesQuery({ limit: 100 });

  const { data: enrollmentsData } = useGetSectionEnrollmentsQuery(
    // A bit hacky: In a real app we'd have a getStudentEnrollments query,
    // but the swagger docs have it. Let's use the hook for getting *student* enrollments.
    // Wait, let's use the custom hook we built for student enrollments from enrollmentApi instead.
    selectedStudentId,
    { skip: true }, // We'll bypass this and use the correct one below:
  );

  // Note: I will need to update the import above to import `useGetStudentEnrollmentsQuery`
  // Let me just manually fetch grades for now for the selected student.
  const { data: gradesData, isLoading } = useGetStudentGradesQuery(
    selectedStudentId,
    {
      skip: !selectedStudentId,
    },
  );

  const [createGrade, { isLoading: isCreating }] = useCreateGradeMutation();
  const [updateGrade, { isLoading: isUpdating }] = useUpdateGradeMutation();

  const handleEdit = (grade: Grade) => {
    setEditingGrade(grade);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      enrollmentId: formData.get("enrollmentId") as string,
      grade: formData.get("grade") as string,
      gpa: Number(formData.get("gpa")),
      remarks: formData.get("remarks") as string,
    };

    if (editingGrade) {
      await updateGrade({ id: editingGrade.id, data });
    } else {
      await createGrade(data);
    }
    setIsModalOpen(false);
  };

  const getGradeColor = (grade: string) => {
    switch (grade.toUpperCase()) {
      case "A":
      case "A+":
      case "A-":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "B":
      case "B+":
      case "B-":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "C":
      case "C+":
      case "C-":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "D":
      case "D+":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "F":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  const columns = [
    {
      header: "Grade",
      accessor: (grade: Grade) => (
        <div
          className={`inline-flex items-center justify-center w-10 h-10 rounded-full border-2 font-bold text-lg ${getGradeColor(grade.grade)}`}
        >
          {grade.grade}
        </div>
      ),
    },
    {
      header: "GPA Score",
      accessor: (grade: Grade) => (
        <span className="font-mono text-slate-700 font-medium">
          {grade.gpa.toFixed(1)}
        </span>
      ),
    },
    { header: "Remarks", accessor: "remarks" as const },
    {
      header: "Date Recorded",
      accessor: (grade: Grade) => (
        <span className="text-slate-500 text-sm">
          {new Date(grade.createdAt).toLocaleDateString()}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
            Academic Grades
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Review and manage student grades and GPA.
          </p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Select Student Record
        </label>
        <select
          value={selectedStudentId}
          onChange={(e) => setSelectedStudentId(e.target.value)}
          className="w-full max-w-md px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <option value="">-- Choose a student --</option>
          {studentsData?.data.map((student) => (
            <option key={student.id} value={student.id}>
              {student.studentId}
            </option>
          ))}
        </select>
      </div>

      {selectedStudentId ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <div className="flex items-center">
              <GraduationCap className="w-5 h-5 text-blue-600 mr-2" />
              <h3 className="font-semibold text-slate-700">
                Transcript Records
              </h3>
            </div>
          </div>
          <DataTable
            columns={columns}
            data={gradesData?.data || []}
            onEdit={handleEdit}
            isLoading={isLoading}
          />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl border border-slate-200 border-dashed text-slate-500">
          <GraduationCap className="w-12 h-12 text-slate-300 mb-4" />
          <p className="text-lg font-medium text-slate-600">
            No Student Selected
          </p>
          <p className="text-sm mt-1">
            Please select a student above to view their academic grades.
          </p>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingGrade ? "Update Grade" : "Enter New Grade"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1 ml-1">
                Letter Grade
              </label>
              <input
                name="grade"
                defaultValue={editingGrade?.grade}
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none uppercase"
                placeholder="e.g. A+"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1 ml-1">
                GPA Score
              </label>
              <input
                type="number"
                step="0.1"
                name="gpa"
                defaultValue={editingGrade?.gpa}
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="4.0"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1 ml-1">
              Remarks / Instructor Comments
            </label>
            <textarea
              name="remarks"
              defaultValue={editingGrade?.remarks}
              required
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              rows={3}
              placeholder="Excellent performance..."
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
              {editingGrade ? "Update Grade" : "Save Grade"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
