import { useState, useRef, useEffect } from "react";
import axios from "axios";
import {
  JOB_APPLICANT_API_END_POINT,
  USER_API_END_POINT,
} from "../utils/constant.js";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../redux/authSlice";
import { useParams, useNavigate } from "react-router-dom";

const ApplyJobForm = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const [coverLetter, setCoverLetter] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [uploadedResumeURL, setUploadedResumeURL] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [skillAnalysis, setSkillAnalysis] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  
  useEffect(() => {
    const savedCoverLetter = localStorage.getItem("coverLetter");
    const savedResumeURL = localStorage.getItem("uploadedResumeURL");
    const submittedFlag = localStorage.getItem(`job_${id}_submitted`);

    if (savedCoverLetter) setCoverLetter(savedCoverLetter);
    if (savedResumeURL) setUploadedResumeURL(savedResumeURL);
    if (submittedFlag === "true") setIsSubmitted(true);
  }, [id]);

  
  useEffect(() => {
    localStorage.setItem("coverLetter", coverLetter);
  }, [coverLetter]);

  useEffect(() => {
    localStorage.setItem("uploadedResumeURL", uploadedResumeURL);
  }, [uploadedResumeURL]);

  const handleResumeChange = (e) => {
    const file = e.target.files[0];
    setResumeFile(file);
    setUploadedResumeURL("");
    localStorage.removeItem("uploadedResumeURL");
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
      const res = await axios.get(
        `${JOB_APPLICANT_API_END_POINT}/generate-cover-letter/${id}`,
        { withCredentials: true }
      );
      setCoverLetter(res.data.letter);
      toast.success("Cover letter generated!");
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
        toast.error("Resume upload failed", { position: "bottom-right" });
      }
    } catch (err) {
      toast.error("Error uploading resume", { position: "bottom-right" });
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
      toast.error("Resume and cover letter are required", {
        position: "bottom-right",
      });
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
        toast.success("Application submitted!");
        setSkillAnalysis({
          matched: res.data.matchedSkills || [],
          missing: res.data.missingSkills || [],
        });

        setCoverLetter("");
        setUploadedResumeURL("");
        setResumeFile(null);

       
        localStorage.setItem(`job_${id}_submitted`, "true");
        localStorage.removeItem("coverLetter");
        localStorage.removeItem("uploadedResumeURL");
        setIsSubmitted(true);

        navigate("/job-application-details");
      } else {
        setMessage(res.data.message || "Something went wrong.");
        toast.error(res.data.message || "Something went wrong.", {
          position: "bottom-right",
        });
      }
    } catch (error) {
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
                onClick={() => fileInputRef.current.click()}
                className="ml-2 text-blue-600 hover:text-blue-800"
              >
                Browse
              </button>
            </div>
          </div>
          {!uploadedResumeURL ? (
            <button
              type="button"
              onClick={handleResumeUpload}
              disabled={loading || !resumeFile}
              className="mt-2 text-blue-600 hover:underline text-sm"
            >
              {loading ? "Uploading..." : "Upload Resume"}
            </button>
          ) : (
            <p className="text-green-600 font-semibold mt-2">
              Resume Uploaded Successfully
            </p>
          )}
        </div>

        
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-1">
            Cover Letter
          </label>
          <textarea
            rows="6"
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            className="w-full px-4 py-2 border rounded-md text-sm"
            placeholder="Paste or generate your cover letter here"
          />
          <button
            type="button"
            onClick={handleGenerateCoverLetter}
            disabled={generating || !uploadedResumeURL}
            className="mt-2 text-white bg-green-600 hover:bg-green-700 px-4 py-1 rounded text-sm disabled:bg-gray-400"
          >
            {generating ? "Generating..." : "Generate Cover Letter"}
          </button>
        </div>

        
        <div className="text-center">
          <button
            type="submit"
            disabled={loading || isSubmitted}
            className={`${
              isSubmitted
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            } text-white font-semibold py-2 px-6 rounded-md transition w-full sm:w-auto`}
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
      </form>
    </div>
  );
};

export default ApplyJobForm;
