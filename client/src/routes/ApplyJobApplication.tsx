import { useState, useRef, useEffect } from "react";
import axios from "axios";
import {
  JOB_APPLICANT_API_END_POINT,
  USER_API_END_POINT,
} from "../utils/constant";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../redux/authSlice";
import { useParams } from "react-router-dom";
import { RootState } from "../redux/store";
import { Applicant, User, AppliedStatus } from "../types/models";
import { ApiResponse } from "../types/apiResponse";
import { FaChartLine } from "react-icons/fa";
import { Link } from "react-router-dom";

interface SkillAnalysis {
  matched: string[];
  missing: string[];
}

const ApplyJobForm = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [coverLetter, setCoverLetter] = useState<string>("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [uploadedResumeURL, setUploadedResumeURL] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [skillAnalysis, setSkillAnalysis] = useState<SkillAnalysis | null>(
    null
  );
  const [generating, setGenerating] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (user) {
      const storedResume = localStorage.getItem("uploadedResumeURL");
      const storedCover = localStorage.getItem("coverLetter");
      if (storedResume) setUploadedResumeURL(storedResume);
      if (storedCover) setCoverLetter(storedCover);
    }
  }, [user]);

  useEffect(() => {
    const checkIfAlreadyApplied = async () => {
      try {
        const res = await axios.get<ApiResponse<AppliedStatus>>(
          `${JOB_APPLICANT_API_END_POINT}/is-applied/${id}`,
          { withCredentials: true }
        );

        setIsSubmitted(res.data.success && res.data.data?.applied);
      } catch (err) {
        console.error("Error checking if already applied:", err);
        setIsSubmitted(false);
      }
    };

    if (user && id) checkIfAlreadyApplied();
  }, [id, user]);

  useEffect(() => {
    localStorage.setItem("coverLetter", coverLetter);
  }, [coverLetter]);

  useEffect(() => {
    localStorage.setItem("uploadedResumeURL", uploadedResumeURL);
  }, [uploadedResumeURL]);

  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setResumeFile(file);
      setUploadedResumeURL("");
      setUploadSuccess(false);
      localStorage.removeItem("uploadedResumeURL");
    }
  };

  const handleGenerateCoverLetter = async () => {
    if (!uploadedResumeURL) {
      toast.error("Please upload a resume first to generate a cover letter.", {
        position: "bottom-right",
      });
      return;
    }

    try {
      setGenerating(true);
      const res = await axios.get<ApiResponse<string>>(
        `${JOB_APPLICANT_API_END_POINT}/generate-cover-letter/${id}`,
        { withCredentials: true }
      );
      setCoverLetter(res.data.data);
      toast.success( res.data.message || "Cover letter generated!", {
        position: "bottom-right",
      });
    } catch (error) {
      console.error("Cover letter generation failed:", error);
      toast.error("Failed to generate cover letter", {
        position: "bottom-right",
      });
    } finally {
      setGenerating(false);
    }
  };

  const handleResumeUpload = async () => {
    if (!resumeFile) {
      return toast.error("Please select a resume to upload.", {
        position: "bottom-right",
      });
    }

    const formData = new FormData();
    formData.append("resume", resumeFile);

    try {
      setLoading(true);
      const res = await axios.post<ApiResponse<User>>(
        `${USER_API_END_POINT}/upload-resume`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        toast.success( res.data.message || "Resume uploaded!", { position: "bottom-right" });
        setUploadedResumeURL(res.data.data.resume);
        dispatch(setUser(res.data.data));
        setUploadSuccess(true);
      } else {
        toast.error("Resume upload failed", { position: "bottom-right" });
      }
    } catch (err) {
      toast.error("Error uploading resume", { position: "bottom-right" });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);
    setSkillAnalysis(null);

    const finalResume = uploadedResumeURL || user?.resume;
    const finalCoverLetter = coverLetter || user?.coverLetter;

    if (!finalResume || !finalCoverLetter) {
      toast.error("Resume and cover letter are required", {
        position: "bottom-right",
      });
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post<
        ApiResponse<{
          matchedSkills: string[];
          missingSkills: string[];
          coverLetter: string;
        }>
      >(
        `${JOB_APPLICANT_API_END_POINT}/apply/${id}`,
        {
          resume: finalResume,
          coverLetter: finalCoverLetter,
        },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

      if (res.data.success && res.data.data) {
        const { matchedSkills, missingSkills } = res.data.data;

        toast.success( res.data.message  || "Application submitted!", {
          position: "bottom-right",
        });

        setSkillAnalysis({
          matched: matchedSkills,
          missing: missingSkills,
        });

        setCoverLetter("");
        setUploadedResumeURL("");
        setResumeFile(null);

        localStorage.setItem(`job_${id}_submitted`, "true");
        localStorage.removeItem("coverLetter");
        localStorage.removeItem("uploadedResumeURL");
        setIsSubmitted(true);
      } else {
        setMessage(res.data.message || "Something went wrong.");
        toast.error(res.data.message || "Something went wrong.", {
          position: "bottom-right",
        });
      }
    } catch (error: any) {
      console.error("Error submitting:", error);
      setMessage(error.response?.data?.message || "Server error.");
      toast.error(error.response?.data?.message || "Error applying.", {
        position: "bottom-right",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-start min-h-screen bg-[#f7e9d6] px-4 pb-20">
      <form
        onSubmit={handleSubmit}
        className="bg-[#FAF6E9] w-full max-w-2xl md:p-10 p-6 shadow-lg border mt-20 border-gray-300 rounded-2xl space-y-6"
      >
        <h2 className="text-3xl font-bold text-center text-blue-700">
          Apply for this Job
        </h2>

        {/* Resume Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-1">
            Upload Resume
          </label>
          <div className="relative">
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleResumeChange}
              ref={fileInputRef}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              id="resume-upload"
            />
            <div className="flex items-center justify-between w-full px-3 py-2 border rounded-md text-sm bg-white">
              <span className="truncate">
                {resumeFile ? resumeFile.name : "Choose a file"}
              </span>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="ml-2 text-blue-600 hover:text-blue-800"
              >
                Browse
              </button>
            </div>
          </div>
          {resumeFile && !uploadedResumeURL ? (
            <button
              type="button"
              onClick={handleResumeUpload}
              disabled={loading}
              className="mt-2 text-blue-600 hover:underline text-sm"
            >
              {loading ? "Uploading..." : "Upload Resume"}
            </button>
          ) : uploadSuccess ? (
            <p className="text-green-600 font-semibold mt-2">
              Resume Uploaded Successfully
            </p>
          ) : null}
        </div>

        {/* Cover Letter */}
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-1">
            Cover Letter
          </label>
          <textarea
            rows={6}
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            className="w-full px-4 py-2 border rounded-md text-sm"
            placeholder="Paste or generate your cover letter here"
          />
          <button
            type="button"
            onClick={handleGenerateCoverLetter}
            disabled={generating || !uploadedResumeURL}
            className=" cursor-pointer mt-2 text-white bg-green-600 hover:bg-green-700 px-4 py-1 rounded text-sm disabled:bg-gray-400"
          >
            {generating ? "Generating..." : "Generate Cover Letter"}
          </button>
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button
            type="submit"
            disabled={loading || isSubmitted}
            className={`${
              isSubmitted
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            } text-white font-semibold py-2 px-6 rounded-md transition w-full sm:w-auto cursor-pointer`}
          >
            {isSubmitted
              ? "Already Submitted"
              : loading
              ? "Submitting..."
              : "Submit Application"}
          </button>
        </div>

        {message && (
          <p className="text-center text-sm text-red-600 mt-2">{message}</p>
        )}

        {/* Skill Analysis */}
        {skillAnalysis && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-800">
              Skill Gap Analysis
            </h3>
            <div className="mt-2">
              <p className="font-medium text-green-700 mb-1">
                ✅ Matched Skills:
              </p>
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
              <p className="font-medium text-red-700 mt-4 mb-1">
                ⚠️ Missing Skills:
              </p>
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
                  <p className="text-sm text-green-700">
                    You're fully qualified!
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {isSubmitted && (
          <div className="text-center mt-6">
            <Link
              to={`/resume-analysis/${id}`}
              className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300"
            >
              <FaChartLine className="text-lg" />
              View Your Chances of Getting Selected
            </Link>
          </div>
        )}
      </form>
    </div>
  );
};

export default ApplyJobForm;
