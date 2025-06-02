import { useState } from "react";

const FilterJobApplications = ({ onFilterChange }) => {
  const filterData = [
    {
      filterType: "Salary",
      filterOptions: ["100000-300000", "500000-800000", "800000-1200000", "1200000+"]
    },
    {
      filterType: "Location",
      filterOptions: ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Pune", "Rajasthan"]
    }
  ];

  const [selectedFilters, setSelectedFilters] = useState({
    Salary: "",
    Location: "",
    Company: ""
  });

  const handleFilterChange = (filterType, value) => {
    const updated = { ...selectedFilters, [filterType]: value };
    setSelectedFilters(updated);
    onFilterChange(updated);
  };

  const handleCompanyInputChange = (e) => {
    setSelectedFilters((prev) => ({ ...prev, Company: e.target.value }));
  };

  const handleFindCompany = () => {
    onFilterChange(selectedFilters);
  };

  const resetFilters = () => {
    const resetState = { Salary: "", Location: "", Company: "" };
    setSelectedFilters(resetState);
    onFilterChange(resetState);
  };

  return (
    <div className="mt-16">
      <div className="hidden lg:block p-4 fixed top-[64px] h-[calc(100vh-64px)] w-[200px] bg-[#f7e9d6] shadow-md border-r z-10 overflow-y-auto">
        <h1 className="text-xl font-bold text-blue-500 mb-6">Filter Jobs</h1>

        {filterData.map(({ filterType, filterOptions }) => (
          <div key={filterType} className="mb-6">
            <h2 className="text-base font-medium mb-2">{filterType}</h2>
            {filterOptions.map((option) => (
              <label key={option} className="flex items-center gap-2 text-sm mb-1">
                <input
                  type="radio"
                  name={filterType}
                  value={option}
                  checked={selectedFilters[filterType] === option}
                  onChange={() => handleFilterChange(filterType, option)}
                  className="form-radio text-blue-500"
                />
                {option}
              </label>
            ))}
          </div>
        ))}

       
        <div className="mb-6">
          <h2 className="text-base font-medium mb-2">Company</h2>
          <div className="relative">
            <input
              type="text"
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 pr-16"
              placeholder="Search for company"
              value={selectedFilters.Company}
              onChange={handleCompanyInputChange}
            />
            <button
              onClick={handleFindCompany}
              className="absolute top-0 right-0 h-full px-3 text-sm bg-blue-500 text-white rounded-r hover:bg-blue-600 transition"
            >
              Find
            </button>
          </div>
        </div>

        <button
          onClick={resetFilters}
          className="w-full mt-4 bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
};

export default FilterJobApplications;
