import axios from "axios";
import { JOB_APPLICATION_API_END_POINT } from "../utils/constant";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  BriefcaseBusiness,
  Banknote,
  Building2,
  MapPinned,
  Clock,
} from "lucide-react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const ViewJobApplication = () => {
  const [jobApplication, setJobApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobApplication = async () => {
      try {
        const response = await axios.get(
          `${JOB_APPLICATION_API_END_POINT}/get-job-application-by-id/${id}`,
          { withCredentials: true }
        );
        const data = response.data;
        console.log("job application", data);

        setTimeout(() => {
          setJobApplication(data?.jobapplication || null);
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error("Error fetching job application:", error);
      }
    };

    if (id) fetchJobApplication();
  }, [id]);

  if (loading) {
    return <p className="text-center text-lg mt-10">Loading job details...</p>;
  }

  if (!jobApplication) {
    return (
      <p className="text-center text-lg mt-10">Job application not found.</p>
    );
  }

  const allow = () => {
    if (!user) {
      toast.error("You must login to apply.");
      navigate("/login", { state: { from: `/apply-job-application/${id}` } });
    } else {
      navigate(`/apply-job-application/${id}`);
    }
  };

  const handleApprove = async () => {
    try {
      await axios.put(
        `${JOB_APPLICATION_API_END_POINT}/approve-job/${id}`,
        {},
        { withCredentials: true }
      );
      toast.success("job approved successfully!", {
        position: "top-center",
        theme: "dark",
      });
      navigate("/admin-dashboard");
    } catch (error) {
      toast.error(error, {
        position: "top-center",
        theme: "dark",
      });
    }
  };

  const handleReject = async () => {
    try {
      await axios.delete(`${JOB_APPLICATION_API_END_POINT}/reject-job/${id}`, {
        withCredentials: true,
      });
      toast.success("job rejected successfully!", {
        position: "top-center",
        theme: "dark",
      });
      navigate("/admin-dashboard");
    } catch (error) {
      toast.error(error, {
        position: "top-center",
        theme: "dark",
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 shadow-lg border rounded-lg mb-6 lg:mt-[100px] bg-white space-y-4">
      <h1 className="text-3xl font-bold text-center mb-6">
        {jobApplication.title}
      </h1>

      <div className="space-y-4 text-lg">
        <p>
          <BriefcaseBusiness className="w-5 h-5 text-gray-600 inline-block mr-2" />{" "}
          <strong>Title:</strong> {jobApplication.title}
        </p>
        <p>
          <Building2 className="w-5 h-5 text-gray-600 inline-block mr-2" />{" "}
          <strong>Company:</strong> {jobApplication.company_name}
        </p>
        <p>
          <Banknote className="w-5 h-5 text-gray-600 inline-block mr-2" />{" "}
          <strong>Salary:</strong> {jobApplication.salary}/year
        </p>
        <p>
          <MapPinned className="w-5 h-5 text-gray-600 inline-block mr-2" />{" "}
          <strong>Location:</strong> {jobApplication.location}
        </p>
        <p>
          <Clock className="w-5 h-5 text-gray-600 inline-block mr-2" />{" "}
          <strong>Type:</strong> {jobApplication.job_type}
        </p>
        <p>
          <strong>Benefits:</strong> {jobApplication.benefits}
        </p>

        <p>
          <strong>Experience:</strong> {jobApplication.experience}
        </p>

        <p>
          <strong>Responsibilities:</strong> {jobApplication.responsibilities}
        </p>
        <strong>Skills:</strong>
        <div className="flex flex-wrap gap-2 mt-1">
          {(Array.isArray(jobApplication.skills)
            ? jobApplication.skills.flatMap((skill) => skill.split(","))
            : jobApplication.skills?.split(",")
          )?.map((skill, index) => (
            <span
              key={index}
              className="inline-block border border-gray-400 rounded-full px-3 py-1 text-sm bg-gray-100"
            >
              {skill.trim()}
            </span>
          ))}
        </div>

        <p>
          <strong>Qualification:</strong> {jobApplication.qualification}
        </p>
        {(!user || user?.role === "user") && (
          <button
            onClick={() => allow()}
            className=" h-[35px] inline-flex items-center justify-center px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-700 transition duration-200 shadow-lg hover:shadow-xl"
          >
            Apply Now
          </button>
        )}

        {user?.role === "admin" && (
          <div className="mt-8 flex space-x-4">
            <button
              onClick={handleApprove}
              className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              Approve Turf
            </button>
            <button
              onClick={handleReject}
              className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Reject Turf
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewJobApplication;
