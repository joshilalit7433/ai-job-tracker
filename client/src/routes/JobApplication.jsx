import axios from "axios";
import { JOB_APPLICATION_API_END_POINT } from "../utils/constant";
import { useEffect, useState } from "react";
import { BriefcaseBusiness } from "lucide-react";
import { Banknote } from "lucide-react";
import { Building2 } from "lucide-react";
import { MapPinned } from "lucide-react";
import { Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { MoveRight } from "lucide-react";

const JobApplications = ({ filters }) => {
  const [jobApplications, setJobApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobApplications = async () => {
      try {
        const response = await axios.get(
          `${JOB_APPLICATION_API_END_POINT}/get-job-applications`
        );
        const data = response.data;

        setTimeout(() => {
          const approvedJobs = data.jobapplications.filter(
            (jobs) => jobs.isApproved === true
          );

          setJobApplications(approvedJobs);
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error("Error fetching job applications:", error);
      }
    };
    fetchJobApplications();
  }, []);

  const isSalaryInRange = (salary, range) => {
    if (!range) return true;
    if (range === "1200000+") return salary >= 1200000;

    const [min, max] = range.split("-").map(Number);
    return salary >= min && salary <= max;
  };

  const normalizeLocation = (location) => {
    return location.split(" ")[0].toLowerCase();
  };

  const filteredJobApplications = jobApplications.filter((job) => {
    const matchesSalary = isSalaryInRange(job.salary, filters.Salary);
    const matchesLocation =
      !filters.Location ||
      normalizeLocation(job.location) === normalizeLocation(filters.Location);
    return matchesSalary && matchesLocation;
  });

  return (
    <div className=" px-4 pb-20">
      <h1 className="text-center text-2xl lg:text-3xl font-semibold mb-6">
        Available Jobs
      </h1>

      {loading ? (
        <p className="text-center text-lg">Loading job applications...</p>
      ) : jobApplications.length === 0 ? (
        <p className="text-center text-lg">No job applications found.</p>
      ) : (
        <div className="lg:ml-[210px] grid justify-self-center grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobApplications.map((job) => (
            <div
              key={job._id}
              className="bg-white rounded-xl shadow-lg hover:shadow-2xl w-[350px] h-[250px] transition duration-300 cursor-pointer overflow-hidden p-4 space-y-2"
            >
              <p className="text-black text-lg font-bold capitalize text-center">
                <BriefcaseBusiness className="w-5 h-5 text-gray-600 inline-block" />{" "}
                {job.title}
              </p>
              <p>
                {" "}
                <Building2 className="w-5 h-5 text-gray-600 inline-block" />{" "}
                {job.company_name}
              </p>
              <p>
                {" "}
                <Banknote className="w-5 h-5 text-gray-600 inline-block" />{" "}
                {job.salary}
              </p>
              <p>
                {" "}
                <MapPinned className="w-5 h-5 text-gray-600 inline-block" />{" "}
                {job.location}
              </p>
              <p>
                {" "}
                <Clock className="w-5 h-5 text-gray-600 inline-block" />{" "}
                {job.job_type}
              </p>
              <Link
                to={`/job-application-details/${job._id}`}
                className="text-blue-500 flex justify-end  "
              >
                View Details
                <MoveRight className="w-5 h-5 text-blue-500 inline-block ml-2 pt-1.5" />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobApplications;
