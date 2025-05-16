import React, { useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { JOB_APPLICATION_API_END_POINT } from "../utils/constant";

const JobApplicationForm = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    salary: "",
    location: "",
    company_name: "",
    job_type: "full-time",
    benefits: "",
    experience: "",
    responsibilities: "",
    skills: "",
    qualification: "",
  });

  if (!user || user.role !== "recruiter") {
    toast.error("Access denied. Only recruiters can post jobs.");
    navigate("/");
    return null;
  }

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await axios.post(
      `${JOB_APPLICATION_API_END_POINT}/post-job-applications`,
      formData,
      { withCredentials: true }
    );

    if (res.data.success) {
      toast.success("Job posted successfully!");
      navigate("/job-applications");
    }

  } catch (err) {
    toast.error("Failed to post job. Check form or server.");
    console.error(err.response?.data || err.message);
  }
};


  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-2xl mt-[80px] mb-[40px] rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Post a New Job</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {[
          { name: "title", label: "Job Title" },
          { name: "salary", label: "Salary", type: "number" },
          { name: "location", label: "Location" },
          { name: "company_name", label: "Company Name" },
          { name: "benefits", label: "Benefits" },
          { name: "experience", label: "Experience" },
          { name: "responsibilities", label: "Responsibilities" },
          { name: "skills", label: "Skills" },
          { name: "qualification", label: "Qualification" },
        ].map(({ name, label, type = "text" }) => (
          <div key={name}>
            <label className="block font-semibold mb-1">{label}</label>
            <input
              type={type}
              name={name}
              value={formData[name]}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        ))}

        <div>
          <label className="block font-semibold mb-1">Job Type</label>
          <select
            name="job_type"
            value={formData.job_type}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
          >
            <option value="full-time">Full-time</option>
            <option value="part-time">Part-time</option>
            <option value="contract">Contract</option>
            <option value="internship">Internship</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
        >
          Post Job
        </button>
      </form>
    </div>
  );
};

export default JobApplicationForm;
