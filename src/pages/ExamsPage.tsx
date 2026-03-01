import { useState } from "react";
import {
  useGetSectionExamsQuery,
  useCreateExamMutation,
  useCreateResultMutation,
  useGetStudentResultsQuery,
} from "../store/api/examsApi";
import { useGetSectionsQuery } from "../store/api/sectionsApi";
import { useGetCoursesQuery } from "../store/api/coursesApi";
import { useGetStudentsQuery } from "../store/api/studentsApi";
import { useGetSectionEnrollmentsQuery } from "../store/api/enrollmentApi";
import { DataTable } from "../components/DataTable";
import { Modal } from "../components/Modal";
import { FileText, Plus, CheckCircle2 } from "lucide-react";
import type { Exam, ExamType, ExamResult } from "../types";

export const ExamsPage = () => {
  const [selectedSectionId, setSelectedSectionId] = useState<string>("");
  const [isExamModalOpen, setIsExamModalOpen] = useState(false);
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);

  // Specific student for results entry
  const [selectedStudentForScore, setSelectedStudentForScore] =
    useState<string>("");

  const { data: sectionsData } = useGetSectionsQuery({ limit: 100 });
  const { data: coursesData } = useGetCoursesQuery({ limit: 100 });
  // Used to populate student selector for the scoring modal
  const { data: enrollmentsData } = useGetSectionEnrollmentsQuery(
    selectedSectionId,
    { skip: !selectedSectionId },
  );
  const { data: studentsData } = useGetStudentsQuery({ limit: 100 });

  const { data: examsData, isLoading: examsLoading } = useGetSectionExamsQuery(
    selectedSectionId,
    { skip: !selectedSectionId },
  );

  const [createExam, { isLoading: isCreatingExam }] = useCreateExamMutation();
  const [createResult, { isLoading: isCreatingResult }] =
    useCreateResultMutation();

  const handleExamSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      sectionId: selectedSectionId,
      type: formData.get("type") as ExamType,
      date: new Date(formData.get("date") as string).toISOString(),
      duration: Number(formData.get("duration")),
      location: formData.get("location") as string,
    };
    await createExam(data);
    setIsExamModalOpen(false);
  };

  const handleResultSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      examId: selectedExam!.id,
      studentId: selectedStudentForScore,
      score: Number(formData.get("score")),
      maxScore: Number(formData.get("maxScore")),
      remarks: formData.get("remarks") as string,
    };
    await createResult(data);
    setIsResultModalOpen(false);
    setSelectedStudentForScore(""); // Reset for next student
  };

  const columns = [
    {
      header: "Exam Type",
      accessor: (exam: Exam) => (
        <span
          className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wide border-2 ${
            exam.type === "FINAL"
              ? "bg-red-50 text-red-700 border-red-200"
              : exam.type === "MIDTERM"
                ? "bg-purple-50 text-purple-700 border-purple-200"
                : "bg-blue-50 text-blue-700 border-blue-200"
          }`}
        >
          {exam.type}
        </span>
      ),
    },
    {
      header: "Date & Time",
      accessor: (exam: Exam) => (
        <div>
          <div className="font-semibold text-slate-800">
            {new Date(exam.date).toLocaleDateString()}
          </div>
          <div className="text-xs text-slate-500 mt-0.5">
            {new Date(exam.date).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>
      ),
    },
    {
      header: "Duration",
      accessor: (exam: Exam) => (
        <span className="text-slate-600">{exam.duration} mins</span>
      ),
    },
    { header: "Location", accessor: "location" as const },
    {
      header: "Actions",
      accessor: (exam: Exam) => (
        <button
          onClick={() => {
            setSelectedExam(exam);
            setIsResultModalOpen(true);
          }}
          className="px-3 py-1.5 font-medium rounded-lg text-sm bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors flex items-center"
        >
          <CheckCircle2 className="w-4 h-4 mr-1.5" />
          Enter Scores
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
            Examinations
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Schedule exams and record scores.
          </p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-end space-x-4">
        <div className="flex-1 max-w-md">
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Class Section
          </label>
          <select
            value={selectedSectionId}
            onChange={(e) => setSelectedSectionId(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="">-- Choose a section --</option>
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
          onClick={() => setIsExamModalOpen(true)}
          disabled={!selectedSectionId}
          className="flex items-center px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg shadow-md shadow-blue-500/20 hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="w-5 h-5 mr-2" />
          Schedule Exam
        </button>
      </div>

      {selectedSectionId ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center">
            <FileText className="w-5 h-5 text-purple-600 mr-2" />
            <h3 className="font-semibold text-slate-700">Exam Schedule</h3>
          </div>
          <DataTable
            columns={columns}
            data={examsData?.data || []}
            isLoading={examsLoading}
          />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl border border-slate-200 border-dashed text-slate-500">
          <FileText className="w-12 h-12 text-slate-300 mb-4" />
          <p className="text-lg font-medium text-slate-600">
            No Section Selected
          </p>
          <p className="text-sm mt-1">
            Please select a class section to view or schedule exams.
          </p>
        </div>
      )}

      {/* Schedule Exam Modal */}
      <Modal
        isOpen={isExamModalOpen}
        onClose={() => setIsExamModalOpen(false)}
        title="Schedule New Exam"
      >
        <form onSubmit={handleExamSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1 ml-1">
              Exam Type
            </label>
            <select
              name="type"
              required
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="MIDTERM">Midterm Exam</option>
              <option value="FINAL">Final Exam</option>
              <option value="QUIZ">Quiz</option>
              <option value="ASSIGNMENT">Assignment</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1 ml-1">
              Date & Time
            </label>
            <input
              type="datetime-local"
              name="date"
              required
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1 ml-1">
                Duration (mins)
              </label>
              <input
                type="number"
                min="15"
                step="15"
                name="duration"
                defaultValue={60}
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1 ml-1">
                Location / Room
              </label>
              <input
                name="location"
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="e.g. Main Hall"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 space-x-3">
            <button
              type="button"
              onClick={() => setIsExamModalOpen(false)}
              className="px-5 py-2.5 text-slate-600 font-medium hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreatingExam}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors shadow-md shadow-blue-500/20"
            >
              Schedule Exam
            </button>
          </div>
        </form>
      </Modal>

      {/* Enter Result Modal */}
      <Modal
        isOpen={isResultModalOpen}
        onClose={() => setIsResultModalOpen(false)}
        title="Record Individual Score"
      >
        <form onSubmit={handleResultSubmit} className="space-y-4">
          <div className="p-4 bg-purple-50 text-purple-800 rounded-lg border border-purple-100 mb-4">
            <div className="font-semibold">{selectedExam?.type} Exam</div>
            <div className="text-xs mt-1 text-purple-600/80">
              Scheduled:{" "}
              {selectedExam && new Date(selectedExam.date).toLocaleDateString()}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1 ml-1">
              Select Enrolled Student
            </label>
            <select
              value={selectedStudentForScore}
              onChange={(e) => setSelectedStudentForScore(e.target.value)}
              required
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">-- Choose student --</option>
              {enrollmentsData?.data.map((enrollment) => {
                const student = studentsData?.data.find(
                  (s) => s.id === enrollment.studentId,
                );
                return (
                  <option key={student?.id} value={student?.id}>
                    {student?.studentId}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1 ml-1">
                Score Obtained
              </label>
              <input
                type="number"
                step="1"
                name="score"
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono text-lg font-bold"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1 ml-1">
                Maximum Score
              </label>
              <input
                type="number"
                step="1"
                name="maxScore"
                defaultValue={100}
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1 ml-1">
              Remarks (Optional)
            </label>
            <input
              name="remarks"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="e.g. Needs improvement"
            />
          </div>

          <div className="flex justify-end pt-4 space-x-3">
            <button
              type="button"
              onClick={() => setIsResultModalOpen(false)}
              className="px-5 py-2.5 text-slate-600 font-medium hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreatingResult || !selectedStudentForScore}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl transition-colors shadow-md shadow-emerald-500/20"
            >
              Save Score
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
