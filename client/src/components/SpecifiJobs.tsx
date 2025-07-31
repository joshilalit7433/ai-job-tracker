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
import { JobApplication } from "../types/models";
import { ApiResponse } from "../types/apiResponse";
import { toast } from "react-toastify";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

interface Filters {
  Salary: string;
  Location: string[];
  Company: string;
}

interface RouteParams extends Record<string, string | undefined> {
  categoryName?: string;
}

const SpecifiJobs = () => {
  const [allJobs, setAllJobs] = useState<JobApplication[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<JobApplication[]>([]);
  const [filters, setFilters] = useState<Filters>({
    Salary: "",
    Location: [],
    Company: "",
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 2;

  const { categoryName } = useParams<RouteParams>();

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await axios.get<ApiResponse<JobApplication[]>>(
        `${JOB_APPLICATION_API_END_POINT}/get-jobs-by-category/${encodeURIComponent(
          categoryName || ""
        )}`
      );

      setAllJobs(res.data.data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const isSalaryInRange = (salary: number, range: string): boolean => {
    if (!range) return true;
    if (range === "1200000+") return salary >= 1200000;
    const [min, max] = range.split("-").map(Number);
    return salary >= min && salary <= max;
  };

  const normalizeLocation = (location: string): string =>
    location.split(" ")[0].toLowerCase();

  useEffect(() => {
    fetchJobs();
    setCurrentPage(1); // reset page when category changes
  }, [categoryName]);

  useEffect(() => {
    const filtered = allJobs.filter((job) => {
      const matchSalary = isSalaryInRange(job.salary, filters.Salary);
      const matchLocation =
        filters.Location.length === 0 ||
        filters.Location.map(normalizeLocation).includes(
          normalizeLocation(job.location)
        );
      const matchCompany =
        !filters.Company ||
        job.companyName.toLowerCase().includes(filters.Company.toLowerCase());

      return matchSalary && matchLocation && matchCompany;
    });

    setFilteredJobs(filtered);
    setCurrentPage(1); // reset page on filter change
  }, [filters, allJobs]);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [categoryName]);

  const handleSaveJob = async (jobId: string) => {
    try {
      const res = await axios.post<ApiResponse<JobApplication>>(
        `${USER_API_END_POINT}/saved-job/${jobId}`,
        {},
        { withCredentials: true }
      );
      if (res.data.success) {
        toast.success("Job saved successfully!", { position: "bottom-right" });
      } else {
        toast.error("Failed to save job.", { position: "bottom-right" });
      }
    } catch (error) {
      console.error("Failed to save job:", error);
    }
  };

  const handleFilterChange = (updatedFilters: Filters) => {
    setFilters(updatedFilters);
  };

  const totalPages = Math.ceil(filteredJobs.length / limit);
  const paginatedJobs = filteredJobs.slice(
    (currentPage - 1) * limit,
    currentPage * limit
  );

  return (
    <div className="flex flex-col lg:flex-row bg-[#f7e9d6] pt-20">
      <FilterJobApplications onFilterChange={handleFilterChange} />

      <div className="flex-1 px-4 pb-20 pt-10 min-h-screen">
        <h1 className="text-center text-2xl lg:text-3xl font-semibold mb-6">
          {categoryName} Jobs
        </h1>

        {loading ? (
          <p className="text-center text-lg">Loading job applications...</p>
        ) : paginatedJobs.length === 0 ? (
          <p className="text-center text-lg">
            No job applications match your filters.
          </p>
        ) : (
          <>
            <div className="lg:ml-[320px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedJobs.map((job) => (
                <div
                  key={job._id}
                  className="bg-[#FAF6E9] border lg:w-[360px] border-gray-200 hover:shadow-lg transition duration-300 rounded-xl p-5 relative"
                >
                  <div className="flex justify-between items-center mb-3">
                    <img
                      src={job.image}
                      alt={job.companyName}
                      className="w-10 h-10 object-contain rounded"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "./images/placeholder.jpg";
                      }}
                    />
                    <span className="text-xs px-2 py-1 border border-blue-500 text-blue-600 rounded-md font-semibold">
                      {job.jobType}
                    </span>
                  </div>

                  <h3 className="text-md font-bold text-gray-900 mb-1">
                    {job.title}
                  </h3>

                  <p className="text-sm text-gray-600 mb-1">
                    <BriefcaseBusiness className="w-5 h-5 inline-block mr-2" />
                    {job.companyName}
                  </p>

                  <p className="text-sm text-gray-600 mb-1">
                    <MapPinned className="w-5 h-5 inline-block mr-2" />
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

            {totalPages > 1 && (
              <div className="mt-10 flex justify-center w-full">
                <div className="flex gap-4">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="p-2 rounded-full border text-[#131D4F] disabled:opacity-40 hover:bg-[#131D4F] hover:text-white transition-all"
                    title="Previous Page"
                  >
                    <FiChevronLeft size={20} />
                  </button>

                  <span className="text-sm font-semibold text-[#131D4F] self-center">
                    Page {currentPage} of {totalPages}
                  </span>

                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-full border text-[#131D4F] disabled:opacity-40 hover:bg-[#131D4F] hover:text-white transition-all"
                    title="Next Page"
                  >
                    <FiChevronRight size={20} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SpecifiJobs;
