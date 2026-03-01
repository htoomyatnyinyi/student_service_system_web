import { useState } from "react";
import {
  useGetSectionAttendanceQuery,
  useCreateAttendanceMutation,
  useBulkAttendanceMutation,
} from "../store/api/attendanceApi";
import { useGetSectionEnrollmentsQuery } from "../store/api/enrollmentApi";
import { useGetSectionsQuery } from "../store/api/sectionsApi";
import { useGetStudentsQuery } from "../store/api/studentsApi";
import { useGetCoursesQuery } from "../store/api/coursesApi";
import { DataTable } from "../components/DataTable";
import { ClipboardCheck, Save } from "lucide-react";
import type { AttendanceStatus } from "../types";

export const AttendancePage = () => {
  const [selectedSectionId, setSelectedSectionId] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0],
  );

  // Track attendance state locally before saving
  const [attendanceDraft, setAttendanceDraft] = useState<
    Record<string, AttendanceStatus>
  >({});

  const { data: sectionsData } = useGetSectionsQuery({ limit: 100 });
  const { data: coursesData } = useGetCoursesQuery({ limit: 100 });
  const { data: studentsData } = useGetStudentsQuery({ limit: 100 });

  const { data: enrollmentsData } = useGetSectionEnrollmentsQuery(
    selectedSectionId,
    { skip: !selectedSectionId },
  );
  const { data: attendanceData, isLoading } = useGetSectionAttendanceQuery(
    {
      sectionId: selectedSectionId,
      date: new Date(selectedDate).toISOString(),
    },
    { skip: !selectedSectionId || !selectedDate },
  );

  const [bulkAttendance, { isLoading: isSaving }] = useBulkAttendanceMutation();

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setAttendanceDraft((prev) => ({ ...prev, [studentId]: status }));
  };

  const handleSaveAll = async () => {
    if (!selectedSectionId || Object.keys(attendanceDraft).length === 0) return;

    const records = Object.entries(attendanceDraft).map(
      ([studentId, status]) => ({
        studentId,
        status,
      }),
    );

    await bulkAttendance({
      sectionId: selectedSectionId,
      date: new Date(selectedDate).toISOString(),
      records,
    });

    // Reset draft after successful save
    setAttendanceDraft({});
  };

  // Build the table rows based on enrolled students
  const tableData =
    enrollmentsData?.data.map((enrollment) => {
      const student = studentsData?.data.find(
        (s) => s.id === enrollment.studentId,
      );
      // Prefer drafted status, fallback to saved status, or 'ABSENT' by default (for new entries)
      const savedRecord = attendanceData?.data.find(
        (a) => a.studentId === enrollment.studentId,
      );
      const currentStatus =
        attendanceDraft[enrollment.studentId] ||
        savedRecord?.status ||
        "PRESENT";

      return {
        id: enrollment.studentId,
        studentIdDisplay: student?.studentId || "Unknown",
        name: student?.userId || "Unknown",
        status: currentStatus as AttendanceStatus,
        isChanged: !!attendanceDraft[enrollment.studentId],
        isNew: !savedRecord,
      };
    }) || [];

  const columns = [
    { header: "Student ID", accessor: "studentIdDisplay" as const },
    { header: "Student Name", accessor: "name" as const },
    {
      header: "Attendance Status",
      accessor: (row: any) => (
        <select
          value={row.status}
          onChange={(e) =>
            handleStatusChange(row.id, e.target.value as AttendanceStatus)
          }
          className={`px-3 py-1.5 rounded-lg text-sm font-bold outline-none border-2 transition-colors ${
            row.status === "PRESENT"
              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
              : row.status === "ABSENT"
                ? "bg-red-50 text-red-700 border-red-200"
                : row.status === "LATE"
                  ? "bg-amber-50 text-amber-700 border-amber-200"
                  : "bg-blue-50 text-blue-700 border-blue-200"
          }`}
        >
          <option value="PRESENT">Present</option>
          <option value="ABSENT">Absent</option>
          <option value="LATE">Late</option>
          <option value="EXCUSED">Excused</option>
        </select>
      ),
    },
    {
      header: "Save Status",
      accessor: (row: any) =>
        row.isChanged ? (
          <span className="text-amber-600 text-xs font-semibold">
            Unsaved Changes
          </span>
        ) : row.isNew ? (
          <span className="text-slate-400 text-xs font-semibold">
            Not Recorded Yet
          </span>
        ) : (
          <span className="text-emerald-600 text-xs font-semibold">Saved</span>
        ),
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
            Attendance Roll Call
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Mark student attendance for specific class sessions.
          </p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Class Section
          </label>
          <select
            value={selectedSectionId}
            onChange={(e) => {
              setSelectedSectionId(e.target.value);
              setAttendanceDraft({});
            }}
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

        <div className="w-full md:w-64">
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Session Date
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => {
              setSelectedDate(e.target.value);
              setAttendanceDraft({});
            }}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
      </div>

      {selectedSectionId ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center">
              <ClipboardCheck className="w-5 h-5 text-indigo-600 mr-2" />
              <h3 className="font-semibold text-slate-700">
                Roster ({tableData.length} students)
              </h3>
            </div>

            <button
              onClick={handleSaveAll}
              disabled={Object.keys(attendanceDraft).length === 0 || isSaving}
              className={`flex items-center px-5 py-2.5 font-medium rounded-lg shadow-md transition-all ${
                Object.keys(attendanceDraft).length > 0
                  ? "bg-indigo-600 text-white shadow-indigo-500/20 hover:bg-indigo-700"
                  : "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none"
              }`}
            >
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? "Saving..." : "Save Attendance Records"}
            </button>
          </div>
          <DataTable columns={columns} data={tableData} isLoading={isLoading} />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl border border-slate-200 border-dashed text-slate-500">
          <ClipboardCheck className="w-12 h-12 text-slate-300 mb-4" />
          <p className="text-lg font-medium text-slate-600">Get Started</p>
          <p className="text-sm mt-1">
            Select a class section and date above to mark attendance.
          </p>
        </div>
      )}
    </div>
  );
};
