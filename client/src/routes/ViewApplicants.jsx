import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { Mail, Phone, FileText, User, StickyNote } from "lucide-react";
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
    <div className="px-4 pb-20 bg-gray-100 min-h-screen">
      <h1 className="text-center text-4xl font-bold text-blue-700 mt-10 mb-12">
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
        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {applicantdetails.map((applicant) => (
            <div
              key={applicant._id}
              className="bg-white border border-gray-200 shadow-sm rounded-2xl p-6 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xl font-semibold text-gray-800">
                  <User className="w-5 h-5 text-blue-600" />
                  {applicant.fullname}
                </div>

                <div className="text-sm text-gray-700 space-y-2">
                  <p className="flex items-center">
                    <Mail className="w-4 h-4 mr-2 text-gray-500" />
                    {applicant.email}
                  </p>
                  <p className="flex items-center">
                    <Phone className="w-4 h-4 mr-2 text-gray-500" />
                    {applicant.mobilenumber}
                  </p>
                </div>

                <div className="border-t border-gray-200 pt-3">
                  <a
                    href={`${BACKEND_BASE_URL}/${applicant.resume}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-blue-600 text-sm hover:underline"
                  >
                    <FileText className="w-4 h-4 mr-2 text-gray-500" />
                    View Resume
                  </a>
                </div>

                <div className="border-t border-gray-200 pt-3">
                  <p className="flex items-start text-sm text-gray-700">
                    <StickyNote className="w-4 h-4 mt-1 mr-2 text-gray-500" />
                    <span>
                      <span className="font-medium text-gray-800">
                        Cover Letter:
                      </span>{" "}
                      {applicant.cover_letter?.slice(0, 120)}...
                    </span>
                  </p>
                </div>

                <div className="mt-4">
                  <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
                    Status: {applicant.status}
                  </span>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <Link
                  to={`/recruiter-response/${applicant._id}`}
                  className="px-5 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 shadow"
                >
                  Respond
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewApplicants;
