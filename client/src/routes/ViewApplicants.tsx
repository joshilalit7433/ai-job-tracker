import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { FileText } from "lucide-react";
import {
  JOB_APPLICANT_API_END_POINT,
  BACKEND_BASE_URL,
} from "../utils/constant";
import { ApiResponse } from "../types/apiResponse";
import { Applicant } from "../types/models";
import { toast } from "react-toastify";
import { FaChartLine } from "react-icons/fa6";

const ViewApplicants = () => {
  const [applicantDetails, setApplicantDetails] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { jobId } = useParams();

  useEffect(() => {
    const fetchApplicantDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get<ApiResponse<Applicant[]>>(
          `${JOB_APPLICANT_API_END_POINT}/get-job-applicants-for-recruiter/${jobId}`,
          { withCredentials: true }
        );
        if (response.data.success) {
          setApplicantDetails(response.data.data || []);
        } else {
          toast.error("Failed to fetch applicants.");
          setError("Failed to fetch applicants.");
        }
      } catch (error) {
        console.error("Error fetching applicants:", error);
        toast.error("Failed to fetch applicants.");
        setError("Failed to fetch applicants.");
      } finally {
        setLoading(false);
      }
    };

    fetchApplicantDetails();
  }, [jobId]);

  const renderStatusBadge = (status: Applicant["status"]) => {
    let bg = "bg-gray-200";
    let text = "text-gray-800";

    if (status === "hired") {
      bg = "bg-green-200";
      text = "text-green-800";
    } else if (status === "rejected") {
      bg = "bg-red-200";
      text = "text-red-800";
    } else if (status === "interview") {
      bg = "bg-blue-200";
      text = "text-blue-800";
    } else if (status === "shortlisted") {
      bg = "bg-yellow-200";
      text = "text-yellow-800";
    }

    return (
      <span className={`px-2 py-1 rounded text-xs font-semibold ${bg} ${text}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="px-4 bg-[#f7e9d6] min-h-screen pb-20">
      <h1 className="text-center text-4xl font-bold text-black pt-20 mb-12">
        Applicant Details
      </h1>

      {loading ? (
        <p className="text-center text-lg text-gray-700">Loading...</p>
      ) : error ? (
        <p className="text-center text-lg text-red-500">{error}</p>
      ) : applicantDetails.length === 0 ? (
        <p className="text-center text-lg text-gray-600">
          No applicants found for this job.
        </p>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto bg-white rounded-xl shadow-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-[#FAF6E9]">
                <tr>
                  <th className="px-6 py-3 text-left text-lg font-bold text-gray-800">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-base font-medium text-gray-600">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-base font-medium text-gray-600">
                    Mobile
                  </th>
                  <th className="px-6 py-3 text-left text-base font-medium text-gray-600">
                    Resume
                  </th>
                  <th className="px-6 py-3 text-left text-base font-medium text-gray-600">
                    Cover Letter
                  </th>
                  <th className="px-6 py-3 text-left text-base font-medium text-gray-600">
                    Matched Skills
                  </th>
                  <th className="px-6 py-3 text-left text-base font-medium text-gray-600">
                    Missing Skills
                  </th>
                  <th className="px-6 py-3 text-left text-base font-semibold text-gray-800">
                    Action
                  </th>
                  <th className="px-6 py-3 text-left text-base font-semibold text-gray-800">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-base font-semibold text-gray-800">
                    Resume Summary
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {applicantDetails.map((applicant) => (
                  <tr
                    key={applicant._id}
                    className="hover:bg-gray-50 transition"
                  >
                    <td className="px-6 py-4 text-gray-800 font-medium capitalize">
                      {applicant.fullName}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {applicant.email}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {applicant.mobileNumber}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <a
                        href={`${BACKEND_BASE_URL}/${applicant.resume}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline flex items-center gap-1"
                      >
                        <FileText className="w-4 h-4" />
                        Resume
                      </a>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 max-w-xs whitespace-pre-wrap break-words">
                      {applicant.coverLetter || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm text-green-700">
                      {applicant.matchedSkills?.length
                        ? applicant.matchedSkills.join(", ")
                        : "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm text-red-600">
                      {applicant.missingSkills?.length
                        ? applicant.missingSkills.join(", ")
                        : "N/A"}
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        to={`/recruiter-response/${applicant.job}`}
                        className="inline-block bg-blue-600 text-white px-4 py-1.5 rounded-md text-sm font-medium hover:bg-blue-700"
                      >
                        Respond
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      {renderStatusBadge(applicant.status)}
                    </td>
                    <td>
                      <Link
                        to={`/recruiter-resume-analysis/${applicant._id}`}
                        className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300"
                      >
                        <FaChartLine className="text-lg" />
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4">
            {applicantDetails.map((applicant) => (
              <div
                key={applicant._id}
                className="bg-white rounded-xl shadow-md p-4 space-y-2"
              >
                <div>
                  <strong>Name:</strong> {applicant.fullName}
                </div>
                <div>
                  <strong>Email:</strong> {applicant.email}
                </div>
                <div>
                  <strong>Mobile:</strong> {applicant.mobileNumber}
                </div>
                <div>
                  <strong>Resume:</strong>{" "}
                  <a
                    href={`${BACKEND_BASE_URL}/${applicant.resume}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    View
                  </a>
                </div>
                <div>
                  <strong>Cover Letter:</strong>
                  <div className="mt-1 text-sm text-gray-700 whitespace-pre-wrap break-words">
                    {applicant.coverLetter || "N/A"}
                  </div>
                </div>
                <div>
                  <strong>Matched Skills:</strong>{" "}
                  <span className="text-green-700">
                    {applicant.matchedSkills?.length
                      ? applicant.matchedSkills.join(", ")
                      : "N/A"}
                  </span>
                </div>
                <div>
                  <strong>Missing Skills:</strong>{" "}
                  <span className="text-red-600">
                    {applicant.missingSkills?.length
                      ? applicant.missingSkills.join(", ")
                      : "N/A"}
                  </span>
                </div>
                <div>
                  <strong>Status:</strong> {renderStatusBadge(applicant.status)}
                </div>
                <div className="pt-2">
                  <Link
                    to={`/recruiter-response/${applicant._id}`}
                    className="inline-block bg-blue-600 text-white px-4 py-1.5 rounded-md text-sm font-medium hover:bg-blue-700"
                  >
                    Respond
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ViewApplicants;
