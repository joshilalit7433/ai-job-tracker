import React from "react";
import { FaPaintBrush, FaChartLine, FaBullhorn, FaMoneyBillWave, FaLaptopCode, FaCogs, FaBriefcase, FaUsers } from "react-icons/fa";

const categories = [
  { name: "Design", jobs: 235, icon: <FaPaintBrush />, highlighted: false },
  { name: "Sales", jobs: 756, icon: <FaChartLine />, highlighted: false },
  { name: "Marketing", jobs: 140, icon: <FaBullhorn />, highlighted: true },
  { name: "Finance", jobs: 325, icon: <FaMoneyBillWave />, highlighted: false },
  { name: "Technology", jobs: 436, icon: <FaLaptopCode />, highlighted: false },
  { name: "Engineering", jobs: 542, icon: <FaCogs />, highlighted: false },
  { name: "Business", jobs: 211, icon: <FaBriefcase />, highlighted: false },
  { name: "Human Resource", jobs: 346, icon: <FaUsers />, highlighted: false },
];

const JobsCategory = () => {
  return (
    <div className="bg-[#f7e9d6]">
    <div className="px-6 py-12 max-w-7xl mx-auto  ">
      <div className="flex items-center justify-between mb-10">
        <h2 className="text-3xl font-bold">
          Explore by <span className="text-blue-500">category</span>
        </h2>
        <a href="#" className="text-blue-500 font-medium hover:underline">
          Show all jobs →
        </a>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {categories.map((cat, idx) => (
          <div
            key={idx}
            className={`rounded-lg border p-6 flex flex-col gap-4 cursor-pointer transition ${
              cat.highlighted
                ? "bg-blue-600 text-white border-blue-600"
                : "hover:border-blue-500"
            }`}
          >
            <div className="text-2xl">{cat.icon}</div>
            <div className="text-lg font-semibold">{cat.name}</div>
            <div className={`text-sm ${cat.highlighted ? "text-blue-100" : "text-gray-500"}`}>
              {cat.jobs} jobs available →
            </div>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
};

export default JobsCategory;
