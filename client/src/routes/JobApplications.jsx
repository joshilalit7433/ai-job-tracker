import React, { useState } from "react";
import JobApplication from "../routes/JobApplication"
import FilterJobApplications from "../components/FilterJobApplications"

const JobApplications = () => {
      const [filters, setFilters] = useState({
        Salary: "",
        Location: "",
      });

        const handleFilterChange = (updatedFilters) => {
    setFilters(updatedFilters);
  };



  return (
    <>
       <FilterJobApplications onFilterChange={handleFilterChange} />
      <JobApplication filters={filters} />
      </>
  )
}

export default JobApplications