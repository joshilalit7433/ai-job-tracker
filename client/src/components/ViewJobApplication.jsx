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
        }
      } catch (error) {
        console.error("Error fetching job application:", error);
      }
    };

    if (id) fetchJobApplication();
  }, [id, user]);

  const allow = () => {
    if (!user) {
      toast.error("You must login to apply.");
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
        position: "top-center",
        theme: "dark",
      });
      navigate("/admin-dashboard");
    } catch (error) {
      toast.error(error.message || "Failed to approve job", {
        position: "top-center",
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
        position: "top-center",
        theme: "dark",
      });
      navigate("/admin-dashboard");
    } catch (error) {
      toast.error(error.message || "Failed to reject job", {
        position: "top-center",
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
              <h1 className="text-2xl font-bold text-blue-800">{jobApplication.title}</h1>
              <p className="text-blue-600 text-sm font-medium">{jobApplication.company_name}</p>
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
            <strong className="text-gray-700">Salary:</strong> ₹{jobApplication.salary}/year
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
        </div>

        
        <div className="space-y-2">
          <p>
            <strong className="text-blue-700">Benefits:</strong> {jobApplication.benefits}
          </p>
          <p>
            <strong className="text-blue-700">Responsibilities:</strong> {jobApplication.responsibilities}
          </p>
        </div>

       
        {Array.isArray(jobApplication.skills) && jobApplication.skills.length > 0 ? (
          <div className="space-y-1">
            <p className="font-semibold text-blue-700">Skills:</p>
            <div className="flex flex-wrap gap-2">
              {jobApplication.skills[0]
                .split(",")
                .map((skill) => skill.trim())
                .filter((skill) => skill.length > 0)
                .map((skill, index) => (
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
          <div className="bg-green-50 p-4 rounded-md border border-green-200 space-y-2">
            <p className="text-green-600 font-semibold">{applyMessage}</p>
            {applicationStatus && (
              <p className="text-sm text-gray-800">
                <strong>Status:</strong> {applicationStatus}
              </p>
            )}
            {recruiterResponse && (
              <p className="text-sm text-gray-700">
                <strong>Recruiter Response:</strong> {recruiterResponse}
              </p>
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
