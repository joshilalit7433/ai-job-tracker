import axios from "axios";
import { JOB_APPLICATION_API_END_POINT } from "../utils/constant.js";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const EditJobApplication = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [jobData, setJobData] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    salary: "",
    location: "",
    company_name: "",
    job_type: "",
    benefits: "",
    experience: "",
    responsibilities: "",
    skills: "",
    qualification: "",
    status: "",
    image: "",
  });

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await axios.get(
          `${JOB_APPLICATION_API_END_POINT}/get-job-application-by-id/${id}`,
          {
            withCredentials: true,
          }
        );

        if (res.data.success) {
          setFormData(res.data.jobapplication);
          setJobData(res.data.jobapplication);
        } else {
          toast.error("Failed to fetch job details.",{position:"bottom-right"});
        }
      } catch (err) {
        console.error(err);
        toast.error("Error fetching job data.",{position:"bottom-right"});
      }
    };

    if (id) fetchJob();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataToUpdate = {};
    for (let key in formData) {
      if (formData[key] !== jobData[key]) {
        dataToUpdate[key] = formData[key];
      }
    }

    if (Object.keys(dataToUpdate).length === 0) {
      toast.info("No changes made.");
      navigate("/recruiter-posted-job-applications");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.put(
        `${JOB_APPLICATION_API_END_POINT}/update-job-application/${id}`,
        dataToUpdate,
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success("Job application updated successfully!");
        navigate("/recruiter-posted-job-applications");
      } else {
        toast.error(res.data.message || "Update failed.",{position:"bottom-right"});
      }
    } catch (err) {
      console.error(err);
      toast.error("Error updating job application.",{position:"bottom-right"});
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
        toast.success("Image uploaded!");
      } else {
        throw new Error("Upload failed");
      }
    } catch (err) {
      toast.error("Image upload failed.",{position:"bottom-right"});
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4 pt-[90px] pb-[40px]">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md"
      >
        <h2 className="text-2xl font-semibold text-center mb-6">
          Edit Job Application
        </h2>

        {[
          { label: "Title", name: "title", type: "text" },
          { label: "Salary", name: "salary", type: "number" },
          { label: "Location", name: "location", type: "text" },
          { label: "Company Name", name: "company_name", type: "text" },
          { label: "Benefits", name: "benefits", type: "text" },
          { label: "Experience", name: "experience", type: "text" },
          { label: "Responsibilities", name: "responsibilities", type: "text" },
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
            />
          </div>
        ))}

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Job Type</label>
          <select
            name="job_type"
            value={formData.job_type}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
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

        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
          >
            <option value="">Select</option>
            <option value="open">Open</option>
            <option value="rejected">Rejected</option>
            <option value="closed">Closed</option>
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

          {loading && (
            <p className="text-sm text-blue-500 mt-1">Uploading...</p>
          )}

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

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200"
        >
          {loading ? "Updating..." : "Update Job Application"}
        </button>
      </form>
    </div>
  );
};

export default EditJobApplication;
