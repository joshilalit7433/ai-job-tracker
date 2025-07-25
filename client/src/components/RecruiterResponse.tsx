import axios from "axios";
import { useState, useEffect } from "react";
import { JOB_APPLICANT_API_END_POINT } from "../utils/constant";
import { useParams } from "react-router-dom";

const RecruiterResponse = () => {
  const [recruiterResponse, setRecruiterResponse] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const { id: applicantId } = useParams();

  useEffect(() => {
    const fetchRecruiterResponse = async () => {
      try {
        const response = await axios.get(
          `${JOB_APPLICANT_API_END_POINT}/response-to-applicant/${applicantId}`,
          { withCredentials: true }
        );
        const data = response.data;
        if (data.success) {
          setRecruiterResponse(data.recruiterResponse || "");
          setStatus(data.status || "");
        } else {
          console.error("Failed to fetch recruiter response:", data.message);
        }
      } catch (error) {
        console.error("Error fetching recruiter response:", error);
      }
    };

    if (applicantId) fetchRecruiterResponse();
  }, [applicantId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        `${JOB_APPLICANT_API_END_POINT}/response-to-applicant/${applicantId}`,
        { recruiterResponse, status },
        { withCredentials: true }
      );

      const data = response.data;
      if (data.success) {
        setMessage("Response sent successfully!");
        setRecruiterResponse("");
        setStatus("");
      } else {
        setMessage("Failed to send response.");
      }
    } catch (error) {
      console.error("Error sending recruiter response:", error);
      setMessage("An error occurred while sending response.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7e9d6] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl bg-[#FAF6E9] rounded-xl shadow-md p-6 sm:p-8 md:p-10">
        <h2 className="text-3xl font-bold text-blue-700 mb-6 text-center">
          Respond to Applicant
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6 ">
          {/* Status Selector */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">
              Application Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select status</option>
              <option value="pending">Pending</option>
              <option value="interview">Interview</option>
              <option value="shortlisted">Shortlisted</option>
              <option value="hired">Hired</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {/* Message Area */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">
              Message
            </label>
            <textarea
              value={recruiterResponse}
              onChange={(e) => setRecruiterResponse(e.target.value)}
              rows={6}
              required
              placeholder="Write your response here..."
              className="w-full border border-gray-300 rounded-md px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            ></textarea>
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition duration-200 disabled:opacity-50"
            >
              {loading ? "Sending..." : "Submit Response"}
            </button>
          </div>

          {/* Message Display */}
          {message && (
            <p
              className={`text-center text-sm mt-2 ${
                message.includes("success")
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default RecruiterResponse;
