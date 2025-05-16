import axios from 'axios';
import { JOB_APPLICATION_API_END_POINT } from '../utils/constant';
import { useEffect, useState } from 'react';
import { BriefcaseBusiness} from 'lucide-react';
import { Banknote } from 'lucide-react';
import { Building2 } from 'lucide-react';
import { MapPinned } from 'lucide-react';
import { Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MoveRight } from 'lucide-react';


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
      <div className="grid grid-cols-1 place-items-center md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobApplications.map((job) => (
          <div
            key={job._id}
            className="bg-white rounded-xl shadow-lg hover:shadow-2xl w-[350px] h-[250px] transition duration-300 cursor-pointer overflow-hidden p-4 space-y-2"
          >
            <p className="text-black text-lg font-bold capitalize text-center">
              <BriefcaseBusiness className="w-5 h-5 text-gray-600 inline-block" /> {job.title}</p>
            <p >  <Building2 className="w-5 h-5 text-gray-600 inline-block" /> {job.company_name}</p>
            <p>  <Banknote className="w-5 h-5 text-gray-600 inline-block" /> {job.salary}</p>
            <p>  <MapPinned className="w-5 h-5 text-gray-600 inline-block"  /> {job.location}</p>
            <p> <Clock  className="w-5 h-5 text-gray-600 inline-block"/> {job.job_type}</p>
            <Link
            to={`/job-application-details/${job._id}`}
            className='text-blue-500 flex justify-end  '
            >View Details
            <MoveRight  className="w-5 h-5 text-blue-500 inline-block ml-2 pt-1.5"/></Link>

          </div>
        ))}
      </div>
    )}
  </div>
  );
};

export default JobApplications;
