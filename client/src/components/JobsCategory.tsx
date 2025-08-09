import React, { useEffect, useState } from "react";
import {
  FaLaptopCode,
  FaUsers,
  FaMoneyBillWave,
  FaBullhorn,
  FaHeadset,
} from "react-icons/fa";
import { MdOutlineDashboard } from "react-icons/md";
import { FiPenTool, FiArrowRight, FiTrendingUp } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { JOB_APPLICATION_API_END_POINT } from "../utils/constant";
import { ApiResponse } from "../types/apiResponse";

interface Category {
  name: string;
  icon: JSX.Element;
  highlighted: boolean;
  gradient: string;
  hoverGradient: string;
}

const JobsCategory = () => {
  const navigate = useNavigate();
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);

  const fetchCategoryCounts = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get<ApiResponse<Record<string, number>>>(
        `${JOB_APPLICATION_API_END_POINT}/get-job-category-count`
      );
      if (res.data.success) {
        setCategoryCounts(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching category counts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoryCounts();
  }, []);

  const categories: Category[] = [
    {
      name: "Information Technology (IT)",
      icon: <FaLaptopCode />,
      highlighted: false,
      gradient: "from-blue-500 to-purple-600",
      hoverGradient: "from-blue-600 to-purple-700",
    },
    {
      name: "Human Resources (HR)",
      icon: <FaUsers />,
      highlighted: false,
      gradient: "from-green-500 to-teal-600",
      hoverGradient: "from-green-600 to-teal-700",
    },
    {
      name: "Finance & Accounting",
      icon: <FaMoneyBillWave />,
      highlighted: false,
      gradient: "from-yellow-500 to-orange-600",
      hoverGradient: "from-yellow-600 to-orange-700",
    },
    {
      name: "Marketing & Advertising",
      icon: <FaBullhorn />,
      highlighted: false,
      gradient: "from-pink-500 to-rose-600",
      hoverGradient: "from-pink-600 to-rose-700",
    },
    {
      name: "Customer Service",
      icon: <FaHeadset />,
      highlighted: false,
      gradient: "from-indigo-500 to-blue-600",
      hoverGradient: "from-indigo-600 to-blue-700",
    },
    {
      name: "Product Management",
      icon: <MdOutlineDashboard />,
      highlighted: false,
      gradient: "from-purple-500 to-indigo-600",
      hoverGradient: "from-purple-600 to-indigo-700",
    },
    {
      name: "Design & Creative",
      icon: <FiPenTool />,
      highlighted: false,
      gradient: "from-red-500 to-pink-600",
      hoverGradient: "from-red-600 to-pink-700",
    },
  ];

  const handleCategoryClick = (categoryName: string) => {
    navigate(`/jobs/category/${encodeURIComponent(categoryName)}`);
  };

  const totalJobs = Object.values(categoryCounts).reduce((sum, count) => sum + count, 0);

  return (
    <div className="min-h-screen bg-[#f7e9d6]">
      <div className="px-6 py-16 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
            <FiTrendingUp className="w-4 h-4" />
            {totalJobs.toLocaleString()} Total Opportunities
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Explore by{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Category
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Discover your next career opportunity across diverse industries and specializations
          </p>
          <button
            onClick={() => navigate("/job-applications")}
            className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            View All Jobs
            <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
          </button>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((category, idx) => {
            const jobCount = categoryCounts[category.name] || 0;
            
            return (
              <div
                key={idx}
                onClick={() => handleCategoryClick(category.name)}
                className="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl cursor-pointer transform hover:scale-105 transition-all duration-300 border border-gray-100"
              >
                {/* Background Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                
                {/* Card Content */}
                <div className="relative p-8">
                  {/* Icon Container */}
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${category.gradient} text-white text-2xl mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    {category.icon}
                  </div>
                  
                  {/* Category Name */}
                  <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-gray-800 transition-colors duration-200">
                    {category.name}
                  </h3>
                  
                  {/* Job Count */}
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      {isLoading ? (
                        <div className="animate-pulse">
                          <div className="h-6 w-16 bg-gray-200 rounded mb-1"></div>
                          <div className="h-4 w-20 bg-gray-200 rounded"></div>
                        </div>
                      ) : (
                        <>
                          <span className="text-2xl font-bold text-gray-900">
                            {jobCount.toLocaleString()}
                          </span>
                          <span className="text-sm text-gray-500">
                            {jobCount === 1 ? 'position' : 'positions'} available
                          </span>
                        </>
                      )}
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-200">
                      <FiArrowRight className="w-6 h-6 text-gray-400" />
                    </div>
                  </div>
                  
                  {/* Bottom Border Animation */}
                  <div className={`absolute bottom-0 left-0 h-1 w-0 group-hover:w-full bg-gradient-to-r ${category.gradient} transition-all duration-300`} />
                </div>
              </div>
            );
          })}
        </div>

        
      </div>
    </div>
  );
};

export default JobsCategory;