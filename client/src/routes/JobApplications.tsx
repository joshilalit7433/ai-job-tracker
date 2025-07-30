import React, { useState } from "react";
import JobApplication from "../routes/JobApplication"; // child that shows jobs
import FilterJobApplications from "../components/FilterJobApplications";


interface Filters {
  Salary: string;
  Location: string[];
  Company: string;
}

const JobApplications: React.FC = () => {
  const [filters, setFilters] = useState<Filters>({
    Salary: "",
    Location: [],
    Company: "",
  });

  const handleFilterChange = (updatedFilters: Filters) => {
    setFilters(updatedFilters);
  };

  return (
    <div className="relative bg-[#f7e9d6] min-h-screen pt-20">
      <FilterJobApplications onFilterChange={handleFilterChange} />
      <JobApplication filters={filters} />
    </div>
  );
};

export default JobApplications;
