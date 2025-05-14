import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { USER_API_END_POINT } from "../utils/constant.js";
import { useNavigate } from "react-router-dom";
import { setUser } from "../redux/authSlice.js";


const UploadResume = () => {
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate=useNavigate();
  const dispatch=useDispatch();


  const handleResumeChange = (e) => {
    setResume(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!resume) return toast.error("Please select a resume to upload.");

    const formData = new FormData();
    formData.append("resume", resume);

    try {
      setLoading(true);
      const response = await axios.post(
        `${USER_API_END_POINT}/upload-resume`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
            withCredentials: true,
        }
      );
        if (response.data.success) {
             toast.success("Resume uploaded successfully!");
              dispatch(setUser(response.data.user));
              setResume(null);
              navigate("/user-profile");
      


        }

     
    } catch (error) {
      toast.error("Failed to upload resume.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-gray-50">
      <div className="w-full max-w-lg bg-white shadow-md rounded-xl p-6 space-y-6">
        <h2 className="text-2xl font-semibold text-center text-blue-600">Upload Resume</h2>

        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleResumeChange}
          className="block w-full p-2 border border-gray-300 rounded-md"
        />

        {resume && (
          <p className="text-sm text-gray-600">Selected file: {resume.name}</p>
        )}

        <button
          onClick={handleUpload}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          {loading ? "Uploading..." : "Upload Resume"}
        </button>
      </div>
    </div>
  );
};

export default UploadResume;
