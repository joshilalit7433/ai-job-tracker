import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { JOB_APPLICATION_API_END_POINT } from "../utils/constant";

const JobApplicationForm = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    salary: "",
    location: "",
    companyName: "",
    jobType: "",
    benefits: "",
    experience: "",
    responsibilities: "",
    skills: "",
    qualification: "",
    image: "",
    jobCategory: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      setLoading(true);
      const res = await axios.post(
        `${JOB_APPLICATION_API_END_POINT}/post-job-applications`,
        {
          ...formData,
          skills: formData.skills.split(',').map((s) => s.trim()),
        },
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success("Job posted successfully!",{position: "bottom-right"});
        setFormData({
          title: "",
          salary: "",
          location: "",
          companyName: "",
          jobType: "",
          benefits: "",
          experience: "",
          responsibilities: "",
          skills: "",
          qualification: "",
          image: "",
          jobCategory: "",
        });
      }
    } catch (err) {
      toast.error("Failed to post job. Check form or server.", {
        position: "bottom-right",
      });
      console.error(err);
    } finally {
      setLoading(false);
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
        setFormData((prev) => ({ ...prev, image: uploadedImage.secure_url }));
        toast.success("Image uploaded!",{position: "bottom-right"});
      } else {
        throw new Error("Upload failed");
      }
    } catch (err) {
      toast.error("Image upload failed.", { position: "bottom-right" });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#f7e9d6] px-4 pt-[90px] pb-[40px]">
      <form
        onSubmit={handleSubmit}
        className="bg-[#FAF6E9] shadow-lg rounded-xl p-8 w-full max-w-5xl"
      >
        <h2 className="text-2xl font-semibold text-center mb-6">
          Post a New Job
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { label: "Title", name: "title", type: "text" },
            { label: "Salary", name: "salary", type: "number" },
            { label: "Location", name: "location", type: "text" },
            { label: "Company Name", name: "companyName", type: "text" },
            { label: "Benefits", name: "benefits", type: "text" },
            { label: "Experience", name: "experience", type: "text" },
            {
              label: "Responsibilities",
              name: "responsibilities",
              type: "text",
            },
            { label: "Skills", name: "skills", type: "text" },
            { label: "Qualification", name: "qualification", type: "text" },
          ].map(({ label, name, type }) => (
            <div key={name} className="mb-4">
              <label className="block text-sm font-medium mb-1">{label}</label>
              <input
                type={type}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={`Enter ${label.toLowerCase()}`}
                required
              />
            </div>
          ))}

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Job Type</label>
            <select
              name="jobType"
              value={formData.jobType}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2"
              required
            >
              <option value="">Select</option>
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
              required
            >
              <option value="">Select a category</option>
              <option value="Information Technology (IT)">Information Technology (IT)</option>
              <option value="Human Resources (HR)">Human Resources (HR)</option>
              <option value="Finance & Accounting">Finance & Accounting</option>
              <option value="Marketing & Advertising">Marketing & Advertising</option>
              <option value="Customer Service">Customer Service</option>
              <option value="Product Management">Product Management</option>
              <option value="Design & Creative">Design & Creative</option>
            </select>
          </div>

          

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Upload Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="w-full border border-gray-300 rounded-md p-2"
            />

            {loading && <p className="text-sm text-blue-500 mt-1">Uploading...</p>}

            {formData.image && (
              <div className="mt-2">
                <img
                  src={formData.image}
                  alt="Job"
                  className="w-32 h-32 object-cover rounded-md border"
                />
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-center mt-6">
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-8 py-3 text-base font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Posting..." : "Post Job"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default JobApplicationForm;
