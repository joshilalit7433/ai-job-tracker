import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { JOB_APPLICATION_API_END_POINT } from "../utils/constant";

const JobApplicationForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

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
    jobApplicationImages: "",
    jobApplicationCategory: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log("Submitting form data:", formData);

      const res = await axios.post(
        `${JOB_APPLICATION_API_END_POINT}/post-job-applications`,
        formData,
        { withCredentials: true }
      );
      console.log("Submitting formData:", formData);

      if (res.data.success) {
        toast.success("Job posted successfully!");
        navigate("/job-applications");
      }
    } catch (err) {
      toast.error("Failed to post job. Check form or server.", {
        position: "bottom-right",
      });
      console.error(err.response?.data || err.message);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "target");

    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dogh78y3a/image/upload",
        {
          method: "POST",
          body: data,
        }
      );

      const uploadedImage = await res.json();

      if (uploadedImage.secure_url) {
        setFormData({ ...formData, image: uploadedImage.secure_url });
      } else {
        throw new Error("Upload failed. No URL returned.");
      }

      setLoading(false);
    } catch (err) {
      toast.error("Image upload failed. Please try again.", {
        position: "bottom-right",
        autoClose: 3000,
        theme: "dark",
      });
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div className="flex bg-[#f7e9d6]  justify-center items-center px-4 py-6 sm:py-8 md:py-10 lg:py-[70px]">
      <form
        onSubmit={handleSubmit}
        className="w-full mt-[50px] max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl bg-[#FAF6E9] p-4 sm:p-6 md:p-8 rounded-lg shadow-lg"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Post a New Job</h2>
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
          <div key={name} className="mb-4">
            <label className="block font-semibold mb-1">{label}</label>
            <input
              type={type}
              name={name}
              value={formData[name]}
              onChange={handleChange}
              className="w-full border border-[#131D4F] rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        ))}

        <div className="mb-4">
          <label className="block font-semibold mb-1">Job Type</label>
          <select
            name="job_type"
            value={formData.job_type}
            onChange={handleChange}
            className="w-full border border-[#131D4F] rounded-md p-2"
          >
            <option value="full-time">Full-time</option>
            <option value="part-time">Part-time</option>
            <option value="contract">Contract</option>
            <option value="internship">Internship</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block font-semibold mb-1">Job Category</label>
          <select
            name="jobCategory"
            value={formData.jobCategory}
            onChange={handleChange}
            className="w-full border border-[#131D4F] rounded-md p-2"
          >
            <option value="">Select a category</option>
            <option value="Information Technology (IT)">
              Information Technology (IT)
            </option>
            <option value="Human Resources (HR)">Human Resources (HR)</option>
            <option value="Finance & Accounting">Finance & Accounting</option>
            <option value="Marketing & Advertising">
              Marketing & Advertising
            </option>
            <option value="Customer Service">Customer Service</option>
            <option value="Product Management">Product Management</option>
            <option value="Design & Creative">Design & Creative</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block font-semibold mb-1">Upload Job Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="w-full border border-[#131D4F] rounded-md p-2"
          />

          {loading && (
            <p className="text-sm text-blue-500 mt-2">Uploading...</p>
          )}

          {formData.jobApplicationImages && (
            <div className="mt-2">
              <img
                src={formData.jobApplicationImages}
                alt="Uploaded Preview"
                className="w-32 h-32 object-cover rounded-md shadow"
              />
            </div>
          )}
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
