import axios from "axios";
import {
  JOB_APPLICANT_API_END_POINT,
  JOB_APPLICATION_API_END_POINT,
} from "../utils/constant";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  BriefcaseBusiness,
  Banknote,
  MapPinned,
  Clock,
  CheckCircle,
  FileCheck,
  CalendarCheck,
  PartyPopper,
  Ban,
  Check,
  AlertCircle,
  Hourglass,
} from "lucide-react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import { RootState } from "../redux/store";
import { JobApplication, Applicant } from "../types/models";
import { ApiResponse } from "../types/apiResponse";
import { Link } from "react-router-dom";
import { FaChartLine } from "react-icons/fa6";

interface SkillAnalysis {
  matched: string[];
  missing: string[];
}

const ViewJobApplication = () => {
  const [jobApplication, setJobApplication] = useState<JobApplication>();
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const user = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();
  const [hasApplied, setHasApplied] = useState<Applicant | null>(null);
  const [skillAnalysis, setSkillAnalysis] = useState<SkillAnalysis | null>(
    null
  );

  useEffect(() => {
    const fetchJobApplication = async () => {
      try {
        const response = await axios.get<ApiResponse<JobApplication>>(
          `${JOB_APPLICATION_API_END_POINT}/get-job-application-by-id/${id}`,
          { withCredentials: true }
        );
        setJobApplication(response.data.data);
        setLoading(false);

        if (user && user.role === "user") {
          const appliedRes = await axios.get<ApiResponse<Applicant>>(
            `${JOB_APPLICANT_API_END_POINT}/is-applied/${id}`,
            { withCredentials: true }
          );
          setHasApplied(appliedRes.data.data);
        }
      } catch (error) {
        console.error("Error fetching job application:", error);
      }
    };

    if (id) fetchJobApplication();
  }, [id, user]);

  const allow = () => {
    if (!user) {
      toast.error("You must login to apply.", { position: "bottom-right" });
      navigate("/login", { state: { from: `/apply-job-application/${id}` } });
    } else {
      navigate(`/apply-job-application/${id}`);
    }
  };

  const handleApprove = async () => {
    try {
      await axios.put<ApiResponse<JobApplication>>(
        `${JOB_APPLICATION_API_END_POINT}/approve-job/${id}`,
        {},
        { withCredentials: true }
      );
      toast.success( "Job approved successfully!", {
        position: "bottom-right",
        theme: "dark",
      });
      navigate("/admin-dashboard");
    } catch (error) {
      toast.error("Failed to approve job", {
        position: "bottom-right",
        theme: "dark",
      });
    }
  };

  const handleReject = async () => {
    try {
      await axios.delete<ApiResponse<null>>(
        `${JOB_APPLICATION_API_END_POINT}/reject-job/${id}`,
        {
          withCredentials: true,
        }
      );
      toast.success("Job rejected successfully!", {
        position: "bottom-right",
        theme: "dark",
      });
      navigate("/admin-dashboard");
    } catch (error) {
      toast.error("Failed to reject job", {
        position: "bottom-right",
        theme: "dark",
      });
    }
  };

  if (loading) {
    return <p className="text-center text-lg mt-10">Loading job details...</p>;
  }

  if (!jobApplication) {
    return (
      <p className="text-center text-lg mt-10">Job application not found.</p>
    );
  }

  return (
    <div className="px-4 pb-6 pt-2 bg-[#f7e9d6] min-h-screen">
      <div className="max-w-4xl mx-auto mt-10 lg:mt-[100px] p-6 shadow-md border border-gray-200 rounded-xl bg-[#FAF6E9] space-y-6 text-gray-900">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <img
              src={jobApplication.image}
              alt={jobApplication.companyName}
              className="w-14 h-14 object-contain rounded border"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "./images/placeholder.jpg";
              }}
            />
            <div>
              <h1 className="text-2xl font-bold text-blue-800">
                {jobApplication.title}
              </h1>
              <p className="text-blue-600 text-sm font-medium">
                {jobApplication.companyName}
              </p>
            </div>
          </div>
          <span className="text-xs px-3 py-1 border border-blue-500 text-blue-600 rounded-md font-semibold">
            {jobApplication.jobType}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <p className="text-gray-800">
            <MapPinned className="w-4 h-4 inline-block mr-2 text-gray-500" />
            <strong className="text-gray-700">Location:</strong>{" "}
            {jobApplication.location}
          </p>
          <p className="text-gray-800">
            <Banknote className="w-4 h-4 inline-block mr-2 text-gray-500" />
            <strong className="text-gray-700">Salary:</strong> ₹
            {jobApplication.salary}/year
          </p>
          <p className="text-gray-800">
            <Clock className="w-4 h-4 inline-block mr-2 text-gray-500" />
            <strong className="text-gray-700">Experience:</strong>{" "}
            {jobApplication.experience}
          </p>
          <p className="text-gray-800">
            <BriefcaseBusiness className="w-4 h-4 inline-block mr-2 text-gray-500" />
            <strong className="text-gray-700">Qualification:</strong>{" "}
            {jobApplication.qualification}
          </p>

          <p className="text-gray-800">
            <strong className="text-gray-700">Job Category:</strong>{" "}
            {jobApplication.jobCategory}
          </p>
        </div>

        <div className="space-y-2">
          <p>
            <strong className="text-blue-700">Benefits:</strong>{" "}
            {jobApplication.benefits}
          </p>
          <p>
            <strong className="text-blue-700">Responsibilities:</strong>{" "}
            {jobApplication.responsibilities}
          </p>
        </div>

        {jobApplication.skills &&
        (Array.isArray(jobApplication.skills) ||
          typeof jobApplication.skills === "string") ? (
          <div className="space-y-2">
            <p className="font-semibold text-blue-700">Skills:</p>
            <div className="flex flex-wrap gap-2">
              {(Array.isArray(jobApplication.skills)
                ? jobApplication.skills
                : (jobApplication.skills as string)
                    .split(",")
                    .map((s: string) => s.trim())
              ).map((skill: string, index: number) => (
                <span
                  key={index}
                  className="inline-block bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-500">No skills listed.</p>
        )}

        {user?.role === "user" && hasApplied?.applied && (
          <div className="p-4 rounded-xl border shadow bg-white space-y-4 border-gray-200">
            <div className="flex items-center gap-2 text-green-700 text-lg font-semibold">
              <CheckCircle className="w-5 h-5" />
              You have successfully applied for this job.
            </div>

            {hasApplied.status && (
              <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                {hasApplied.status === "shortlisted" && (
                  <>
                    <FileCheck className="text-yellow-600 w-4 h-4" />
                    <span className="text-yellow-700">Shortlisted</span>
                    <span className="text-gray-600">(Await next steps)</span>
                  </>
                )}
                {hasApplied.status === "interview" && (
                  <>
                    <CalendarCheck className="text-blue-600 w-4 h-4" />
                    <span className="text-blue-700">Interview Scheduled</span>
                    <span className="text-gray-600">
                      (Details will be sent soon)
                    </span>
                  </>
                )}
                {hasApplied.status === "hired" && (
                  <>
                    <PartyPopper className="text-green-600 w-4 h-4" />
                    <span className="text-green-700">You’ve been Hired!</span>
                    <span className="text-gray-600">(Congratulations!)</span>
                  </>
                )}
                {hasApplied.status === "rejected" && (
                  <>
                    <Ban className="text-red-600 w-4 h-4" />
                    <span className="text-red-700">Not Selected</span>
                    <span className="text-gray-600">
                      (Better luck next time)
                    </span>
                  </>
                )}
                {hasApplied.status === "pending" && (
                  <>
                    <Hourglass className="text-gray-600 w-4 h-4 " />
                    <span className="text-gray-700">Under Review</span>
                  </>
                )}
              </div>
            )}

            {hasApplied.recruiterResponse && (
              <div className="bg-blue-50 border border-blue-200 p-3 rounded-md text-sm text-blue-900">
                <strong className="block text-sm mb-1 text-blue-700">
                  Recruiter Response:
                </strong>
                {hasApplied.recruiterResponse}
              </div>
            )}

            {hasApplied.appliedAt && (
              <p className="text-xs text-gray-500">
                <Clock className="w-3 h-3 inline-block mr-1" />
                Applied on: {dayjs(hasApplied.appliedAt).format("MMMM D, YYYY")}
              </p>
            )}

            {hasApplied.matchedSkills &&
              hasApplied.matchedSkills.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-green-700 mb-1 flex items-center gap-1">
                    <Check className="w-4 h-4" /> Matched Skills
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {hasApplied.matchedSkills.map((skill, i) => (
                      <span
                        key={i}
                        className="border border-green-400 bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

            {hasApplied.missingSkills &&
              hasApplied.missingSkills.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-red-700 mb-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" /> Missing Skills
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {hasApplied.missingSkills.map((skill, i) => (
                      <span
                        key={i}
                        className="border border-red-400 bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

            <div className="text-center mt-6">
              <Link
                to={`/resume-analysis/${id}`}
                className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300"
              >
                <FaChartLine className="text-lg" />
                View Your Chances of Getting Selected
              </Link>
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-4 mt-4">
          {(!user || (user.role === "user" && !hasApplied)) && (
            <button
              onClick={allow}
              className="cursor-pointer px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition shadow"
            >
              Apply Now
            </button>
          )}

          {user?.role === "admin" && (
            <>
              <button
                onClick={handleApprove}
                className=" cursor-pointer px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
              >
                Approve Job
              </button>
              <button
                onClick={handleReject}
                className=" cursor-pointer px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                Reject Job
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewJobApplication;
