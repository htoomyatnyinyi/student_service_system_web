import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Building2,
  BookOpen,
  Layers,
  UserCheck,
  GraduationCap,
  ClipboardCheck,
  CreditCard,
  Megaphone,
  Library,
  FileText,
  LogOut,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { logout } from "../store/authSlice";

const navItems = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "Students", path: "/students", icon: Users },
  { name: "Departments", path: "/departments", icon: Building2 },
  { name: "Courses", path: "/courses", icon: BookOpen },
  { name: "Sections", path: "/sections", icon: Layers },
  { name: "Enrollment", path: "/enrollment", icon: UserCheck },
  { name: "Grades", path: "/grades", icon: GraduationCap },
  { name: "Attendance", path: "/attendance", icon: ClipboardCheck },
  { name: "Fees", path: "/fees", icon: CreditCard },
  { name: "Announcements", path: "/announcements", icon: Megaphone },
  { name: "Library", path: "/library", icon: Library },
  { name: "Exams", path: "/exams", icon: FileText },
];

export const Sidebar = () => {
  const dispatch = useDispatch();

  return (
    <div className="flex flex-col w-64 bg-slate-900 border-r border-slate-800 text-slate-300">
      <div className="flex items-center justify-center h-16 border-b border-slate-800">
        <h2 className="text-2xl font-bold text-white tracking-widest">
          Adipati<span className="text-blue-500">Mon</span>
        </h2>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "hover:bg-slate-800 hover:text-white"
                }`
              }
            >
              <Icon className="w-5 h-5 mr-3" />
              {item.name}
            </NavLink>
          );
        })}
      </nav>
      <div className="p-4 border-t border-slate-800">
        <button
          onClick={() => dispatch(logout())}
          className="flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg hover:bg-slate-800 hover:text-white transition-colors"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Logout
        </button>
      </div>
    </div>
  );
};
