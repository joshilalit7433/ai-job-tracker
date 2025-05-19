import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { JOB_APPLICATION_API_END_POINT } from "../utils/constant.js";



const UserAppliedJobApplication = () => {
    const { user } = useSelector((store) => store.auth);
  const [jobs, setjobs] = useState([]);
  const [loading, setLoading] = useState(true);
  //eslint-disable-next-line
  const [error, setError] = useState("");

    useEffect(() => {
    const fetchJobApplications = async () => {
      try {
        setLoading(true);
        

        
        const Response = await axios.get(
          `${JOB_APPLICATION_API_END_POINT}/get-user-applied-job-application`,
          {
            withCredentials:true
          }
        );
        const fetchedjobs = Response.data.appliedJobs || [];
        console.log(fetchedjobs);
        setjobs(fetchedjobs);

        

      

        
      } catch (err) {
        console.error("Error fetching job applications:", err.message);
        setError("Failed to fetch job applications.");
      } finally {
        setLoading(false);
      }
    };

    if (user?._id) {
      fetchJobApplications();
    }
  }, [user]);



  return (
    <div className="bg-gray-100 min-h-screen mt-[50px] flex justify-center items-center py-10">
      <div className="max-w-4xl w-full p-4 md:p-6 bg-white shadow-md rounded-lg">
        <h1 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6 text-center">
          Your applied Job Applications
        </h1>

         {loading ? (
      <p className="text-center text-lg">Loading job applications...</p>
    ) : jobs.length === 0 ? (
      <p className="text-center text-lg">No job applications found.</p>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map((application) => (
          <div
            key={application._id}
            className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition duration-300 cursor-pointer overflow-hidden p-4 space-y-2"
          >
            <p className="text-black text-lg font-bold capitalize">Role: {application.job.title}</p>
            <p><strong>Salary:</strong> {application.job.salary}</p>
            <p><strong>Location:</strong> {application.job.location}</p>
            <p><strong>Company:</strong> {application.job.company_name}</p>
            <p><strong>Job Type:</strong> {application.job.job_type}</p>
            <p><strong>Benefits:</strong> {application.job.benefits}</p>
            <p><strong>Experience:</strong> {application.job.experience}</p>
            <p><strong>Responsibilities:</strong> {application.job.responsibilities}</p>
            <p><strong>Skills:</strong> {application.job.skills}</p>
            <p><strong>Qualification:</strong> {application.job.qualification}</p>
            <p><strong>Status:</strong> {application.job.status}</p>
          </div>
        ))}
      </div>
    )}


          </div>
      
      </div>
   
  )
}

export default UserAppliedJobApplication