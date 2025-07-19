import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { FileText } from "lucide-react";
import {
  JOB_APPLICANT_API_END_POINT,
  BACKEND_BASE_URL,
} from "../utils/constant.js";

const ViewApplicants = () => {
  const [applicantdetails, setapplicantdetails] = useState([]);
  const [loading, setloading] = useState(false);
  const [error, setError] = useState("");
  const { jobId } = useParams();

  useEffect(() => {
    const fetchApplicantDetails = async () => {
      try {
        setloading(true);
        const response = await axios.get(
          `${JOB_APPLICANT_API_END_POINT}/get-job-applicants-for-recruiter/${jobId}`,
          { withCredentials: true }
        );
        if (response.data.success) {
          setapplicantdetails(response.data.applicants || []);
        }
      } catch (err) {
        console.error("Error fetching applicants:", err.message);
        setError("Failed to fetch applicants.");
      } finally {
        setloading(false);
      }
    };
    fetchApplicantDetails();
  }, [jobId]);

  return (
    <div className="px-4 bg-[#f7e9d6] min-h-screen pb-20">
      <h1 className="text-center text-4xl font-bold text-black pt-20 mb-12">
        Applicant Details
      </h1>

      {loading ? (
        <p className="text-center text-lg text-gray-700">Loading...</p>
      ) : error ? (
        <p className="text-center text-lg text-red-500">{error}</p>
      ) : applicantdetails.length === 0 ? (
        <p className="text-center text-lg text-gray-600">
          No applicants found for this job.
        </p>
      ) : (
        <>
          {/*  Desktop Table */}
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
                  <th className="px-6 py-3 text-left text-base font-semibold text-gray-800">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {applicantdetails.map((applicant) => (
                  <tr
                    key={applicant._id}
                    className="hover:bg-gray-50 transition"
                  >
                    <td className="px-6 py-4 text-gray-800 font-medium capitalize">
                      {applicant.fullname}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {applicant.email}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {applicant.mobilenumber}
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
                      {applicant.cover_letter || "N/A"}
                    </td>

                    <td className="px-6 py-4">
                      <Link
                        to={`/recruiter-response/${applicant._id}`}
                        className="inline-block bg-blue-600 text-white px-4 py-1.5 rounded-md text-sm font-medium hover:bg-blue-700"
                      >
                        Respond
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/*  Mobile Cards */}
          <div className="md:hidden space-y-4">
            {applicantdetails.map((applicant) => (
              <div
                key={applicant._id}
                className="bg-white rounded-xl shadow-md p-4 space-y-2"
              >
                <div>
                  <span className="font-semibold text-gray-800">Name:</span>{" "}
                  {applicant.fullname}
                </div>
                <div>
                  <span className="font-semibold text-gray-800">Email:</span>{" "}
                  {applicant.email}
                </div>
                <div>
                  <span className="font-semibold text-gray-800">Mobile:</span>{" "}
                  {applicant.mobilenumber}
                </div>
                <div>
                  <span className="font-semibold text-gray-800">Resume:</span>{" "}
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
                  <span className="font-semibold text-gray-800">
                    Cover Letter:
                  </span>
                  <div className="mt-1 text-sm text-gray-700 whitespace-pre-wrap break-words">
                    {applicant.cover_letter || "N/A"}
                  </div>
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
