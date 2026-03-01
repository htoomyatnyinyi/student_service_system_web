import { Users, Building2, BookOpen, Layers } from "lucide-react";
import { StatsCard } from "../components/StatsCard";

export const DashboardPage = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight">
            Overview
          </h2>
          <p className="text-slate-500 mt-1">
            Welcome back! Here's what's happening today.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 font-medium rounded-xl shadow-sm hover:bg-slate-50 transition-colors">
            Download Report
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white font-medium rounded-xl shadow-md shadow-blue-500/20 hover:bg-blue-700 transition-colors">
            New Enrollment
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Students"
          value="1,245"
          icon={Users}
          trend={{ value: 12, isUp: true }}
          colorClassName="text-blue-600 bg-blue-50"
        />
        <StatsCard
          title="Departments"
          value="8"
          icon={Building2}
          colorClassName="text-purple-600 bg-purple-50"
        />
        <StatsCard
          title="Active Courses"
          value="46"
          icon={BookOpen}
          trend={{ value: 2, isUp: true }}
          colorClassName="text-emerald-600 bg-emerald-50"
        />
        <StatsCard
          title="Class Sections"
          value="112"
          icon={Layers}
          colorClassName="text-amber-600 bg-amber-50"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-6 min-h-[400px]">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">
            Enrollment Trends
          </h3>
          <div className="flex items-center justify-center h-64 text-slate-400 bg-slate-50 rounded-xl border border-slate-100 border-dashed">
            [Chart Placeholder]
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 min-h-[400px]">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">
            Recent Announcements
          </h3>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-600"></div>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800 text-sm">
                    Exam Schedule Updated
                  </h4>
                  <p className="text-slate-500 text-xs mt-1 line-clamp-2">
                    The mid-term examination schedule for Computer Science
                    department has been revised.
                  </p>
                  <p className="text-slate-400 text-xs mt-2 font-medium">
                    2 hours ago
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
