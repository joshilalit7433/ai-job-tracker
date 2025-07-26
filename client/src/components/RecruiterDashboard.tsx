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
  Menu,
  X,
  User,
  Settings,
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
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
    localStorage.setItem("justLoggedOut", "true"); 
    dispatch(logout());
    navigate("/");
  };

  const navLinks = [
    {
      icon: <Bell className="w-5 h-5" />,
      label: "Job Notifications",
      path: "/notifications",
    },
    {
      icon: <User className="w-5 h-5" />,
      label: "Profile",
      path: "/user-profile",
    },
  ];

  const addJobButton = {
    icon: <FileText className="w-5 h-5" />,
    label: "Add a New Job",
    path: "/job-application-form",
  };

  const stats = [
    {
      icon: <Briefcase className="w-6 h-6" />,
      label: "Total Jobs",
      value: dashboardStats.totalJobsPosted,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      icon: <Users className="w-6 h-6" />,
      label: "Total Applicants",
      value: dashboardStats.totalApplicants,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      label: "Shortlisted",
      value: dashboardStats.shortlisted,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
    },
    {
      icon: <CalendarCheck className="w-6 h-6" />,
      label: "Interviews",
      value: dashboardStats.interviews,
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50",
      iconColor: "text-orange-600",
    },
    {
      icon: <CalendarCheck className="w-6 h-6" />,
      label: "Hired",
      value: dashboardStats.hired,
      color: "from-emerald-500 to-emerald-600",
      bgColor: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
  ];

  const firstName = user?.fullName?.split(" ")[0] || "Recruiter";
  const userEmail = user?.email || "recruiter@example.com";

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#f7e9d6] to-[#f0e6d0] text-[#131D4F]">
      {/* Mobile Menu Button - Right side for small/medium devices */}
      <div className="lg:hidden fixed top-4 right-4 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 bg-white rounded-lg shadow-lg border border-gray-200"
        >
          {sidebarOpen ? (
            <X className="w-6 h-6 text-[#131D4F]" />
          ) : (
            <Menu className="w-6 h-6 text-[#131D4F]" />
          )}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-40 w-64 lg:w-80 h-screen bg-[#FAF6E9] border-r border-gray-300 pt-10 flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Logo */}
        <div className="flex items-center space-x-2 mb-10 px-4">
          <span className="bg-gradient-to-tr from-purple-500 to-orange-400 w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-xl">T</span>
          <span className="text-[#5e2b14] text-2xl font-bold tracking-wide">Target</span>
          <span className="text-orange-600 text-2xl font-bold tracking-wide">Aims</span>
        </div>
        <div className="flex-1 flex flex-col">
          {/* Profile Section */}
          <div className="mb-8 p-4 bg-white rounded-xl border border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-[#131D4F]">
                  {user?.fullName || "Recruiter"}
                </p>
                <p className="text-xs text-gray-500">{userEmail}</p>
              </div>
            </div>
            <div className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-md">
              Recruiter Account
            </div>
          </div>

          {/* Add New Job Button */}
          <div className="mb-6 px-4">
            <Link
              to={addJobButton.path}
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-3 w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {addJobButton.icon}
              <span className="font-semibold">{addJobButton.label}</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-2 mb-8 px-4">
            {navLinks.map((link, index) => (
              <Link
                to={link.path}
                key={index}
                onClick={() => setSidebarOpen(false)}
                className="flex items-center gap-3 text-[#131D4F] hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors duration-200"
              >
                {link.icon}
                <span className="font-medium">{link.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        <div className="px-4 pb-6">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full cursor-pointer bg-[#fff7eb] text-[#131D4F] px-4 py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-semibold">Logout</span>
          </button>
        </div>
      </aside>

      {/* Overlay for mobile - Transparent background */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 opacity-10  backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <main className="flex-1 p-4 lg:p-10 pt-8 bg-gradient-to-br from-[#f7e9d6] to-[#f0e6d0] min-h-screen text-[#131D4F] lg:ml-64 xl:ml-80">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-2">Welcome back, {firstName}</h2>
          <p className="text-gray-500 mb-8">Measure your advertising ROI and report website traffic.</p>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 lg:gap-6 mb-8 lg:mb-10">
            {stats.map((item, index) => (
              <div
                key={index}
                className="group relative bg-white rounded-2xl p-4 lg:p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`p-3 rounded-xl ${item.bgColor} group-hover:scale-110 transition-transform duration-300`}
                  >
                    <div className={item.iconColor}>{item.icon}</div>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs lg:text-sm text-gray-500 font-medium">
                      {item.label}
                    </p>
                    <p className="text-xl lg:text-2xl font-bold text-[#131D4F]">
                      {item.value}
                    </p>
                  </div>
                </div>

                {item.label === "Total Jobs" && (
                  <Link
                    to="/recruiter-posted-job-applications"
                    className="mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium self-start inline-flex items-center gap-1 group-hover:gap-2 transition-all duration-200"
                  >
                    View All →
                  </Link>
                )}

                {/* Gradient border effect */}
                <div
                  className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${item.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300 -z-10`}
                ></div>
              </div>
            ))}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Bar Chart */}
            <div className="bg-white p-4 lg:p-6 rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300">
              <h3 className="text-lg font-semibold mb-4 text-[#131D4F]">
                Applications per Job
              </h3>
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
                    fontSize={12}
                  />
                  <YAxis stroke="#475569" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff7eb",
                      borderColor: "#e2e8f0",
                      borderRadius: "12px",
                      boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                      color: '#131D4F',
                    }}
                  />
                  <Bar
                    dataKey="applications"
                    fill="url(#barGradient)"
                    radius={[6, 6, 0, 0]}
                  />
                  <defs>
                    <linearGradient
                      id="barGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#1d4ed8" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Line Chart */}
            <div className="bg-white p-4 lg:p-6 rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300">
              <h3 className="text-lg font-semibold mb-4 text-[#131D4F]">
                Application Trend Over Time
              </h3>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={dashboardStats.lineData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="time" stroke="#475569" fontSize={12} />
                  <YAxis stroke="#475569" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff7eb",
                      borderColor: "#e2e8f0",
                      borderRadius: "12px",
                      boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                      color: '#131D4F',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="applications"
                    stroke="url(#lineGradient)"
                    strokeWidth={3}
                    dot={{ r: 4, fill: "#10b981" }}
                    activeDot={{ r: 6, fill: "#10b981" }}
                  />
                  <defs>
                    <linearGradient
                      id="lineGradient"
                      x1="0"
                      y1="0"
                      x2="1"
                      y2="0"
                    >
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="#059669" />
                    </linearGradient>
                  </defs>
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
