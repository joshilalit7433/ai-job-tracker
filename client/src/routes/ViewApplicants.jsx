import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Mail, Phone, FileText, User, StickyNote } from "lucide-react";
import { JOB_APPLICANT_API_END_POINT } from "../utils/constant.js";

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
        const data = response.data;
        if (data.success) {
          setapplicantdetails(data.applicants || []);
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
      <h1 className="text-center text-3xl font-bold text-blue-600 mt-8 mb-10">
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
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {applicantdetails.map((applicant) => (
            <div
              key={applicant._id}
              className="bg-white shadow-lg rounded-xl p-6 transition hover:shadow-2xl"
            >
              <div className="space-y-2">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  {applicant.fullname}
                </h2>

                <p className="flex items-center text-sm text-gray-700">
                  <Mail className="w-4 h-4 mr-2 text-gray-500" />
                  {applicant.email}
                </p>

                <p className="flex items-center text-sm text-gray-700">
                  <Phone className="w-4 h-4 mr-2 text-gray-500" />
                  {applicant.mobilenumber}
                </p>

                <p className="flex items-center text-sm text-gray-700 break-words">
                  <FileText className="w-4 h-4 mr-2 text-gray-500" />
                  Resume: {applicant.resume}
                </p>

                <p className="flex items-start text-sm text-gray-700 mt-2">
                  <StickyNote className="w-4 h-4 mr-2 text-gray-500 mt-1" />
                  <span>
                    <span className="font-medium text-gray-800">Cover Letter:</span>{" "}
                    {applicant.cover_letter?.slice(0, 120)}...
                  </span>
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewApplicants;
