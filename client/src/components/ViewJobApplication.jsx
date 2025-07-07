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
  Building2,
  MapPinned,
  Clock,
} from "lucide-react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import dayjs from "dayjs";

const ViewJobApplication = () => {
  const [jobApplication, setJobApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  const [hasApplied, setHasApplied] = useState(false);
  const [applyMessage, setApplyMessage] = useState("");
  const [applicationStatus, setApplicationStatus] = useState("");
  const [recruiterResponse, setRecruiterResponse] = useState("");
  const [appliedAt, setAppliedAt] = useState("");

  useEffect(() => {
    const fetchJobApplication = async () => {
      try {
        const response = await axios.get(
          `${JOB_APPLICATION_API_END_POINT}/get-job-application-by-id/${id}`,
          { withCredentials: true }
        );
        setJobApplication(response.data?.jobapplication || null);
        setLoading(false);

        if (user && user.role === "user") {
          const appliedRes = await axios.get(
            `${JOB_APPLICANT_API_END_POINT}/is-applied/${id}`,
            { withCredentials: true }
          );
          setHasApplied(appliedRes.data.applied);
          setApplyMessage(appliedRes.data.message);
          setApplicationStatus(appliedRes.data.status || "");
          setRecruiterResponse(appliedRes.data.recruiterResponse || "");
          setAppliedAt(appliedRes.data.appliedAt || "");
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
      await axios.put(
        `${JOB_APPLICATION_API_END_POINT}/approve-job/${id}`,
        {},
        { withCredentials: true }
      );
      toast.success("Job approved successfully!", {
        position: "bottom-right",
        theme: "dark",
      });
      navigate("/admin-dashboard");
    } catch (error) {
      toast.error(error.message || "Failed to approve job", {
        position: "bottom-right",
        theme: "dark",
      });
    }
  };

  const handleReject = async () => {
    try {
      await axios.delete(`${JOB_APPLICATION_API_END_POINT}/reject-job/${id}`, {
        withCredentials: true,
      });
      toast.success("Job rejected successfully!", {
        position: "bottom-right",
        theme: "dark",
      });
      navigate("/admin-dashboard");
    } catch (error) {
      toast.error(error.message || "Failed to reject job", {
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
              alt={jobApplication.company_name}
              className="w-14 h-14 object-contain rounded border"
              onError={(e) => (e.target.src = "/images/placeholder.jpg")}
            />
            <div>
              <h1 className="text-2xl font-bold text-blue-800">
                {jobApplication.title}
              </h1>
              <p className="text-blue-600 text-sm font-medium">
                {jobApplication.company_name}
              </p>
            </div>
          </div>
          <span className="text-xs px-3 py-1 border border-blue-500 text-blue-600 rounded-md font-semibold">
            {jobApplication.job_type}
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
                : jobApplication.skills.split(",").map((s) => s.trim())
              ).map((skill, index) => (
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

        {user?.role === "user" && hasApplied && (
          <div className="p-4 rounded-xl border shadow bg-white space-y-3 border-gray-200">
            <div className="text-lg font-semibold text-green-700">
              ✅ {applyMessage}
            </div>

            {applicationStatus && (
              <div className="flex items-center gap-2 text-sm font-medium">
                {applicationStatus === "shortlisted" && (
                  <>
                    <span className="text-yellow-600">📝 Shortlisted</span>
                    <span className="text-gray-600">(Await next steps)</span>
                  </>
                )}
                {applicationStatus === "interview" && (
                  <>
                    <span className="text-blue-600">
                      📅 Interview Scheduled
                    </span>
                    <span className="text-gray-600">
                      (Details will be sent soon)
                    </span>
                  </>
                )}
                {applicationStatus === "hired" && (
                  <>
                    <span className="text-green-600">
                      🎉 You’ve been Hired!
                    </span>
                    <span className="text-gray-600">(Congrats!)</span>
                  </>
                )}
                {applicationStatus === "rejected" && (
                  <>
                    <span className="text-red-600">❌ Not Selected</span>
                    <span className="text-gray-600">
                      (Better luck next time)
                    </span>
                  </>
                )}
                {["pending"].includes(applicationStatus) && (
                  <>
                    <span className="text-gray-700">⏳ Under Review</span>
                  </>
                )}
              </div>
            )}

            {recruiterResponse && (
              <div className="bg-gray-50 border border-gray-200 p-3 rounded-md text-sm text-gray-800 italic">
                <strong className="block text-gray-600 mb-1">
                  Recruiter Response:
                </strong>
                {recruiterResponse}
              </div>
            )}

            {appliedAt && (
              <div className="text-xs text-gray-500">
                Applied on: {dayjs(appliedAt).format("MMMM D, YYYY")}
              </div>
            )}
          </div>
        )}

        <div className="flex flex-wrap gap-4 mt-4">
          {(!user || (user.role === "user" && !hasApplied)) && (
            <button
              onClick={allow}
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition shadow"
            >
              Apply Now
            </button>
          )}

          {user?.role === "admin" && (
            <>
              <button
                onClick={handleApprove}
                className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
              >
                Approve Job
              </button>
              <button
                onClick={handleReject}
                className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
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
