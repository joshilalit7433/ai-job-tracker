import axios from 'axios';
import { JOB_APPLICATION_API_END_POINT } from '../utils/constant';
import { useEffect, useState } from 'react';


const JobApplications = () => {
  const [jobApplications, setJobApplications] = useState([]);
    const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchJobApplications = async () => {
    try {
      const response = await axios.get(`${JOB_APPLICATION_API_END_POINT}/get-job-applications`);
     const data=response.data;
      console.log("job applications", data);

   
     

      setTimeout(()=>{
        setJobApplications(data?.jobapplications || []);
       setLoading(false);


      },500)
    } catch (error) {
      console.error("Error fetching job applications:", error);
    } 
  };
  fetchJobApplications();
}, []);


  return (
    
     <div className="pt-20 px-4 pb-20">
    <h1 className="text-center text-2xl lg:text-3xl font-semibold mb-6">
      Available Jobs
    </h1>

    {loading ? (
      <p className="text-center text-lg">Loading job applications...</p>
    ) : jobApplications.length === 0 ? (
      <p className="text-center text-lg">No job applications found.</p>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobApplications.map((job) => (
          <div
            key={job._id}
            className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition duration-300 cursor-pointer overflow-hidden p-4 space-y-2"
          >
            <p className="text-black text-lg font-bold capitalize">Role: {job.title}</p>
            <p><strong>Salary:</strong> {job.salary}</p>
            <p><strong>Location:</strong> {job.location}</p>
            <p><strong>Company:</strong> {job.company_name}</p>
            <p><strong>Job Type:</strong> {job.job_type}</p>
            <p><strong>Benefits:</strong> {job.benefits}</p>
            <p><strong>Experience:</strong> {job.experience}</p>
            <p><strong>Responsibilities:</strong> {job.responsibilities}</p>
            <p><strong>Skills:</strong> {job.skills}</p>
            <p><strong>Qualification:</strong> {job.qualification}</p>
            <p><strong>Status:</strong> {job.status}</p>
          </div>
        ))}
      </div>
    )}
  </div>
  );
};

export default JobApplications;
