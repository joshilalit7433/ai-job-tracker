import { useEffect, useState } from "react";
import axios from "axios";
import {
  JOB_APPLICATION_API_END_POINT,
  USER_API_END_POINT,
} from "../utils/constant";
import {
  BriefcaseBusiness,
  MapPinned,
  BookMarked,
  MoveRight,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import FilterJobApplications from "../components/FilterJobApplications";

const SpecifiJobs = () => {
  const [allJobs, setAllJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [filters, setFilters] = useState({
    Salary: "",
    Location: [],
    Company: "",
  });
  const [loading, setLoading] = useState(true);

  const { categoryName } = useParams();

  const fetchJobApplications = async () => {
    try {
      const response = await axios.get(
        `${JOB_APPLICATION_API_END_POINT}/get-job-applications`
      );
      const data = response.data;

      const approvedJobs = data.jobapplications.filter(
        (job) =>
          job.isApproved === true &&
          job.jobCategory === decodeURIComponent(categoryName)
      );
      setAllJobs(approvedJobs);
      setFilteredJobs(approvedJobs);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching job applications:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobApplications();
  }, [categoryName]);

  // Scroll to top when this page mounts or categoryName changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior:"auto" });
  }, [categoryName]);

  const isSalaryInRange = (salary, range) => {
    if (!range) return true;
    if (range === "1200000+") return salary >= 1200000;
    const [min, max] = range.split("-").map(Number);
    return salary >= min && salary <= max;
  };

  const normalizeLocation = (location) =>
    typeof location === "string" && location.length > 0
      ? location.split(" ")[0].toLowerCase()
      : "";

  useEffect(() => {
    const filtered = allJobs.filter((job) => {
      const matchesSalary = isSalaryInRange(job.salary, filters.Salary);

      const jobLocation = normalizeLocation(job.location);
      const matchesLocation =
        filters.Location.length === 0 ||
        filters.Location.map(normalizeLocation).includes(jobLocation);

      const matchesCompany =
        !filters.Company ||
        job.companyName.toLowerCase().includes(filters.Company.toLowerCase());

      return matchesSalary && matchesLocation && matchesCompany;
    });

    setFilteredJobs(filtered);
  }, [filters, allJobs]);

  const handleSaveJob = async (jobId) => {
    try {
      const res = await axios.post(
        `${USER_API_END_POINT}/saved-job/${jobId}`,
        {},
        { withCredentials: true }
      );
      if (res.data.success) {
        alert("Job saved successfully!");
      }
    } catch (error) {
      console.error("Failed to save job:", error);
    }
  };

  const handleFilterChange = (updatedFilters) => {
    setFilters(updatedFilters);
  };

  return (
    <div className="flex flex-col lg:flex-row bg-[#f7e9d6] pt-20">
      <FilterJobApplications onFilterChange={handleFilterChange} />

      <div className="flex-1 px-4 pb-20 pt-10 min-h-screen ">
        <h1 className="text-center text-2xl lg:text-3xl font-semibold mb-6">
          {categoryName} Jobs
        </h1>

        {loading ? (
          <p className="text-center text-lg">Loading job applications...</p>
        ) : filteredJobs.length === 0 ? (
          <p className="text-center text-lg">
            No job applications match your filters.
          </p>
        ) : (
          <div className="lg:ml-[320px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job) => (
              <div
                key={job._id}
                className="bg-[#FAF6E9] border lg:w-[360px] border-gray-200 hover:shadow-lg transition duration-300 rounded-xl p-5 relative"
              >
                <div className="flex justify-between items-center mb-3">
                  <img
                    src={job.image}
                    alt={job.companyName}
                    className="w-10 h-10 object-contain rounded"
                    onError={(e) => (e.target.src = "./images/placeholder.jpg")}
                  />
                  <span className="text-xs px-2 py-1 border border-blue-500 text-blue-600 rounded-md font-semibold">
                    {job.jobType}
                  </span>
                </div>

                <h3 className="text-md font-bold text-gray-900 mb-1">
                  {job.title}
                </h3>

                <p className="text-sm text-gray-600 mb-1">
                  <BriefcaseBusiness className="w-5 h-5 text-gray-600 inline-block mr-2" />
                  {job.companyName}
                </p>

                <p className="text-sm text-gray-600 mb-1">
                  <MapPinned className="w-5 h-5 text-gray-600 inline-block mr-2" />
                  {job.location}
                </p>

                <div className="flex gap-2 flex-wrap mb-4">
                  {job.skills?.slice(0, 3).map((skill, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-2 py-1 rounded-full bg-blue-100"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="flex justify-between items-center">
                  <Link
                    to={`/job-application-details/${job._id}`}
                    className="text-blue-600 text-sm font-medium hover:underline flex items-center"
                  >
                    View Details
                    <MoveRight className="w-4 h-4 ml-1" />
                  </Link>

                  <button
                    onClick={() => handleSaveJob(job._id)}
                    className="text-blue-500 hover:text-blue-700"
                    title="Save Job"
                  >
                    <BookMarked className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SpecifiJobs;
