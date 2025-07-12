import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Briefcase,
  Users,
  CheckCircle,
  CalendarCheck,
  LayoutDashboard,
  Bell,
  FileText,
  LogOut,
} from "lucide-react";
import { RECRUITER_DASHBOARD_API_END_POINT } from "../utils/constant";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/authSlice";
import { toast } from "react-toastify";

export default function SidebarDashboard() {
  const [dashboardStats, setDashboardStats] = useState({
    totalJobsPosted: 0,
    totalApplicants: 0,
    shortlisted: 0,
    interviews: 0,
    hired: 0,
    barData: [],
    lineData: [],
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get(
          `${RECRUITER_DASHBOARD_API_END_POINT}/recruiter-dashboard`,
          { withCredentials: true }
        );
        setDashboardStats(response.data);
      } catch (error) {
        console.error("Dashboard fetch error:", error);
      }
    };

    fetchDashboardData();
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
    toast.success("You have successfully Logged Out.", {
      position: "bottom-right",
      autoClose: 3000,
      theme: "dark",
    });
  };

  const navLinks = [
    { icon: <LayoutDashboard />, label: "Dashboard", path: "/recruiter-dashboard" },
    { icon: <FileText />, label: "Job Application Form", path: "/job-application-form" },
    { icon: <Bell />, label: "Job Notifications", path: "/notifications" },
    { icon: <Briefcase />, label: "Home", path: "/" },
  ];

  const stats = [
    { icon: <Briefcase />, label: "Total Jobs", value: dashboardStats.totalJobsPosted },
    { icon: <Users />, label: "Total Applicants", value: dashboardStats.totalApplicants },
    { icon: <CheckCircle />, label: "Shortlisted", value: dashboardStats.shortlisted },
    { icon: <CalendarCheck />, label: "Interviews", value: dashboardStats.interviews },
    { icon: <CalendarCheck />, label: "Hired", value: dashboardStats.hired },
  ];

  const firstName = user?.fullname?.split(" ")[0] || "Recruiter";

  return (
    <div className="flex min-h-screen bg-[#f7e9d6] text-[#131D4F]">
      {/* Sidebar */}
      <aside className="w-64 bg-[#FAF6E9] p-6 flex flex-col justify-between border-r border-gray-300">
        <div>
          <Link to="/" className="text-xl font-bold flex items-center space-x-1 mb-10">
            <span className="text-purple-700 text-2xl">●</span>
            <span className="text-[#5e2b14]">Target</span>
            <span className="text-orange-600">Aims</span>
          </Link>
          <nav className="space-y-6">
            {navLinks.map((link, index) => (
              <Link
                to={link.path}
                key={index}
                className="flex items-center gap-3 text-[#131D4F] hover:underline"
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            ))}
          </nav>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-[#ff4444] hover:underline"
        >
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-10 mt-20">
        <h2 className="text-3xl font-semibold mb-10">
          Welcome back, {firstName}
        </h2>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-10">
          {stats.map((item, index) => (
            <div key={index} className="bg-[#fff7eb] rounded-xl p-6 shadow-md border border-gray-200">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-[#f1f1f1] rounded-full">{item.icon}</div>
                <div>
                  <p className="text-sm text-gray-500">{item.label}</p>
                  <p className="text-2xl font-bold">{item.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Bar Chart */}
          <div className="bg-[#fff7eb] p-6 rounded-xl shadow-md border border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Applications per Job</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart
                data={dashboardStats.barData}
                margin={{ top: 10, right: 20, left: -10, bottom: 80 }}
                barCategoryGap={20}
                barGap={5}
                barSize={50}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="job"
                  angle={-45}
                  interval={0}
                  textAnchor="end"
                  height={100}
                  stroke="#475569"
                />
                <YAxis stroke="#475569" />
                <Tooltip contentStyle={{ backgroundColor: "#fff7eb", borderColor: "#e2e8f0" }} />
                <Bar
                  dataKey="applications"
                  fill="#3b82f6"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Line Chart */}
          <div className="bg-[#fff7eb] p-6 rounded-xl shadow-md border border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Application Trend Over Time</h3>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={dashboardStats.lineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="time" stroke="#475569" />
                <YAxis stroke="#475569" />
                <Tooltip contentStyle={{ backgroundColor: "#fff7eb", borderColor: "#e2e8f0" }} />
                <Line
                  type="monotone"
                  dataKey="applications"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </main>
    </div>
  );
}
