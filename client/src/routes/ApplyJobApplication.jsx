import { useState } from "react";
import axios from "axios";
import {
  JOB_APPLICANT_API_END_POINT,
  USER_API_END_POINT,
  BACKEND_BASE_URL,
} from "../utils/constant.js";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../redux/authSlice";
import { useParams } from "react-router-dom";

const ApplyJobForm = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth);

  const [coverLetter, setCoverLetter] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [uploadedResumeURL, setUploadedResumeURL] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [skillAnalysis, setSkillAnalysis] = useState(null);

  const handleResumeChange = (e) => {
    setResumeFile(e.target.files[0]);
    setUploadedResumeURL("");
  };

  const handleResumeUpload = async () => {
    if (!resumeFile) return toast.error("Please select a resume to upload.");
    const formData = new FormData();
    formData.append("resume", resumeFile);

    try {
      setLoading(true);
      const res = await axios.post(
        `${USER_API_END_POINT}/upload-resume`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        toast.success("Resume uploaded!");
        setUploadedResumeURL(res.data.user.resume);
        dispatch(setUser(res.data.user));
      } else {
        toast.error("Resume upload failed");
      }
    } catch (err) {
      toast.error("Error uploading resume");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);
    setSkillAnalysis(null);

    const finalResume = uploadedResumeURL || user?.resume;
    const finalCoverLetter = coverLetter || user?.cover_letter;

    if (!finalResume || !finalCoverLetter) {
      toast.error("Resume and cover letter are required");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(
        `${JOB_APPLICANT_API_END_POINT}/apply/${id}`,
        {
          resume: finalResume,
          cover_letter: finalCoverLetter,
        },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

      if (res.data.success) {
        toast.success("Application submitted successfully!");
        setSkillAnalysis({
          matched: res.data.matchedSkills || [],
          missing: res.data.missingSkills || [],
        });
        setCoverLetter("");
        setUploadedResumeURL("");
        setResumeFile(null);
      } else {
        setMessage(res.data.message || "Something went wrong.");
        toast.error(res.data.message || "Something went wrong.");
      }
    } catch (error) {
      console.error("Server response:", error.response?.data);
      setMessage(
        error.response?.data?.message || "Server error. Please try again later."
      );
      toast.error(error.response?.data?.message || "Error applying for job.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-start min-h-screen bg-[#f7e9d6] px-4  pb-20">
      <form
        onSubmit={handleSubmit}
        className="bg-[#FAF6E9] w-full max-w-2xl md:p-10 p-6 shadow-lg border mt-20 border-gray-300 rounded-2xl space-y-6"
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-blue-700">
          Apply for this Job
        </h2>

       
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-1">
            Upload Resume (PDF, DOC)
          </label>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleResumeChange}
            disabled={uploadedResumeURL === user?.resume}
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm"
          />

          {uploadedResumeURL && uploadedResumeURL === user?.resume ? (
            <p className="mt-2 text-sm text-gray-700">
              Using resume from profile:{" "}
              <a
                href={`${BACKEND_BASE_URL}/${uploadedResumeURL}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                View Resume
              </a>
            </p>
          ) : (
            resumeFile && (
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-2 gap-2 text-sm">
                <span className="text-gray-700 truncate">{resumeFile.name}</span>
                <button
                  type="button"
                  onClick={handleResumeUpload}
                  disabled={loading}
                  className="text-blue-600 hover:underline"
                >
                  {loading ? "Uploading..." : "Upload"}
                </button>
              </div>
            )
          )}

          {user?.resume && (
            <label className="flex items-center gap-2 mt-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={uploadedResumeURL === user.resume}
                onChange={(e) =>
                  setUploadedResumeURL(e.target.checked ? user.resume : "")
                }
              />
              Use resume from profile
            </label>
          )}
          {uploadedResumeURL && (
            <p className="text-sm text-green-600 mt-1">Resume ready ✔️</p>
          )}
        </div>

       
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-1">
            Cover Letter
          </label>
          <textarea
            rows="4"
            required
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm"
          />
          {user?.cover_letter && (
            <label className="flex items-center gap-2 mt-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={coverLetter === user.cover_letter}
                onChange={(e) =>
                  setCoverLetter(e.target.checked ? user.cover_letter : "")
                }
              />
              Use cover letter from profile
            </label>
          )}
        </div>

     
        <div className="text-center">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-md transition duration-200 w-full sm:w-auto"
          >
            {loading ? "Submitting..." : "Submit Application"}
          </button>
        </div>

        
        {message && (
          <p className="text-center text-sm text-red-600 mt-2">{message}</p>
        )}

        {skillAnalysis && (
          <div className="mt-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Skill Gap Analysis
            </h3>

           
            <div>
              <p className="font-medium text-green-700 mb-1">✅ Matched Skills:</p>
              <div className="flex flex-wrap gap-2">
                {skillAnalysis.matched.length > 0 ? (
                  skillAnalysis.matched.map((skill, i) => (
                    <span
                      key={i}
                      className="border border-green-400 bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-gray-600">No matched skills.</p>
                )}
              </div>
            </div>

           
            <div>
              <p className="font-medium text-red-700 mb-1">⚠️ Missing Skills:</p>
              <div className="flex flex-wrap gap-2">
                {skillAnalysis.missing.length > 0 ? (
                  skillAnalysis.missing.map((skill, i) => (
                    <span
                      key={i}
                      className="border border-red-400 bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-green-700">You're fully qualified!</p>
                )}
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default ApplyJobForm;
