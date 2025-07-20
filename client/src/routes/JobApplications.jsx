import React, { useState } from "react";
import JobApplication from "../routes/JobApplication"
import FilterJobApplications from "../components/FilterJobApplications"

const JobApplications = () => {
  const [filters, setFilters] = useState({
    Salary: "",
    Location: "",
    Company: "",
  });

  const handleFilterChange = (updatedFilters) => {
    setFilters(updatedFilters);
  };

  return (
    <div className="relative">
      <FilterJobApplications onFilterChange={handleFilterChange} />
      <JobApplication filters={filters} />
    </div>
  );
};

export default JobApplications;