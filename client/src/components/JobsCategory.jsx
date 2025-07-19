import React, { useEffect, useState } from "react";
import {
  FaLaptopCode,
  FaUsers,
  FaMoneyBillWave,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { JOB_APPLICATION_API_END_POINT } from "../utils/constant";

const JobsCategory = () => {
  const navigate = useNavigate();
  const [categoryCounts, setCategoryCounts] = useState({});

  const fetchCategoryCounts = async () => {
    try {
      const res = await axios.get(`${JOB_APPLICATION_API_END_POINT}/get-job-category-count`);
      if (res.data.success) {
        setCategoryCounts(res.data.counts);
      }
    } catch (error) {
      console.error("Error fetching category counts:", error);
    }
  };

  useEffect(() => {
    fetchCategoryCounts();
  }, []);

  const categories = [
    {
      name: "Information Technology (IT)",
      icon: <FaLaptopCode />,
      highlighted: false,
    },
    {
      name: "Human Resources (HR)",
      icon: <FaUsers />,
      highlighted: false,
    },
    {
      name: "Finance & Accounting",
      icon: <FaMoneyBillWave />,
      highlighted: false,
    },
  ];

  const handleCategoryClick = (categoryName) => {
    navigate(`/jobs/category/${encodeURIComponent(categoryName)}`);
  };

  return (
    <div className="bg-[#f7e9d6]">
      <div className="px-6 py-12 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl font-bold">
            Explore by <span className="text-blue-500">category</span>
          </h2>
          <button
            onClick={() => navigate("/job-applications")}
            className="text-blue-500 font-medium hover:underline"
          >
            Show all jobs →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {categories.map((cat, idx) => (
            <div
              key={idx}
              onClick={() => handleCategoryClick(cat.name)}
              className={`rounded-lg border p-6 flex flex-col gap-4 cursor-pointer transition-all duration-200 ${
                cat.highlighted
                  ? "bg-blue-600 text-white border-blue-600"
                  : "hover:border-blue-500"
              }`}
            >
              <div className="text-2xl">{cat.icon}</div>
              <div className="text-lg font-semibold">{cat.name}</div>
              <div
                className={`text-sm ${
                  cat.highlighted ? "text-blue-100" : "text-gray-500"
                }`}
              >
                {categoryCounts[cat.name] || 0} jobs available →
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default JobsCategory;
