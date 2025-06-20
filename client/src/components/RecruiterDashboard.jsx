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
  MoveRight,
} from "lucide-react";
import { RECRUITER_DASHBOARD_API_END_POINT } from "../utils/constant";
import { useSelector } from "react-redux";
import axios from "axios";
import { Link } from "react-router-dom";

export default function RecruiterDashboard() {
  const [dashboardStats, setDashboardStats] = useState({
    totalJobsPosted: 0,
    totalApplicants: 0,
    shortlisted: 0,
    interviews: 0,
    barData: [],
    lineData: [],
  });
  const user = useSelector((store) => store.auth.user);
  const recruiterId = user?._id;

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get(
          `${RECRUITER_DASHBOARD_API_END_POINT}/recruiter-dashboard/${recruiterId}`,
          {
            withCredentials: true,
          }
        );
        const data = response.data;
        setDashboardStats(data);
      } catch (error) {
        console.log("Dashboard fetch error:", error);
      }
    };

    fetchDashboardData();
  }, []);

  const stats = [
    {
      icon: <Briefcase className="text-blue-600" />,
      label: "Total Jobs",
      value: dashboardStats.totalJobsPosted,
      btn: (
        <Link
          to="/recruiter-posted-job-applications"
          className="text-blue-500 flex justify-end  "
        >
          View all
          <MoveRight className="w-5 h-5 text-blue-500 inline-block ml-2 pt-1.5" />
        </Link>
      ),
    },
    {
      icon: <Users className="text-green-600" />,
      label: "Total Applicants",
      value: dashboardStats.totalApplicants,
    },
    {
      icon: <CheckCircle className="text-yellow-600" />,
      label: "Shortlisted",
      value: dashboardStats.shortlisted,
    },
    {
      icon: <CalendarCheck className="text-purple-600" />,
      label: "Interviews",
      value: dashboardStats.interviews,
    },
  ];

  return (
    <div className="p-6 bg-[#f7e9d6] min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Recruiter Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {stats.map((item, index) => (
          <div
            key={index}
            className="bg-[#FAF6E9] shadow-md p-4 rounded-2xl flex items-center gap-4 border border-gray-200"
          >
            <div className="bg-gray-100 p-2 rounded-full">{item.icon}</div>
            <div>
              <p className="text-gray-500 text-sm">{item.label}</p>
              <p className="text-xl font-semibold">{item.value}</p>
              <p>{item.btn}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#FAF6E9] shadow-md p-6 rounded-2xl border border-gray-200">
          <h2 className="text-lg font-semibold mb-4">Applications per Job</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={dashboardStats.barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="job" />
              <YAxis />
              <Tooltip />
              <Bar
                dataKey="applications"
                fill="#3b82f6"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-[#FAF6E9] shadow-md p-6 rounded-2xl border border-gray-200">
          <h2 className="text-lg font-semibold mb-4">
            Application Trend Over Time
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={dashboardStats.lineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
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
    </div>
  );
}
