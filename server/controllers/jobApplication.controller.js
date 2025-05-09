import { JobApplication } from "../models/jobApplication.model.js";
import { Applicant } from "../models/applicant.model.js";

export const PostJobApplication = async (req, res) => {
  try {
    const {
      user,
      title,
      salary,
      location,
      company_name,
      job_type,
      benefits,
      experience,
      responsibilities,
      skills,
      qualification,
      status,
    } = req.body;

    if(req.user.role !== "recruiter"){
        return res.status(400).json({
            message:"only recruiters can post job applications",
            success:false
        })
    }

    console.log(
      user,
      title,
      salary,
      location,
      company_name,
      job_type,
      benefits,
      experience,
      responsibilities,
      skills,
      qualification,
      status
    );

    if ( !user ||  !title ||!salary ||!location ||!company_name || !job_type ||!benefits ||!experience || !responsibilities 
      || !skills ||!qualification 
    ) {
      return res.status(400).json({
        message: "somnething is missing ",
        success: false,
      });
    }

    const jobapplication= await JobApplication.create({
      user:req.user._id,
      title,
      salary,
      location,
      company_name,
      job_type,
      benefits,
      experience,
      responsibilities,
      skills,
      qualification,
      status

    })

    return res.status(201).json({
        message:"job application created successfully",
        jobapplication,
        success:true
    })


    
  } catch (error) {
    console.log(error);
    return res.status(500).json({
        message:"error in creating job application",
        success:false
    })
  }
};


export const UpdateJobApplication = async(req,res) => {
  try{

    const{
      title,
      salary,
      location,
      company_name,
      job_type,
      benefits,
      experience,
      responsibilities,
      skills,
      qualification,
      status}=req.body;

      if(req.user.role!=="recruiter"){
        return res.status(403).json({
          message:"only recruiters can update job applications",
            success:false
        })
      }

      const jobapplicationId=req.params.id;
      console.log(jobapplicationId);
      const jobapplication= await JobApplication.findById(jobapplicationId);
      console.log(jobapplication);
      
      if(!jobapplication){
        return res.status(400).json({
          message:"job application not found",
          success:false
        })
      }

     if( title) jobapplication.title=title;
      if(salary) jobapplication.salary=salary;
      if(location) jobapplication.location=location;
     if (company_name) jobapplication.company_name=company_name;
     if (job_type) jobapplication.job_type=job_type;
      if(benefits) jobapplication.benefits=benefits;
     if (experience) jobapplication.experience=experience;
     if (responsibilities) jobapplication.responsibilities=responsibilities;
     if (skills) jobapplication.skills=skills;
     if (qualification) jobapplication.qualification=qualification;
     if (status) jobapplication.status=status;

     await jobapplication.save();

    

     return res.status(200).json({
      message:"job application updated successfully",
      jobapplication,
      success:true
     });

     

  }
  catch(error){
    console.log(error);
  }
}

export const GetJobApplication = async (req,res) => {
  try {
    const jobapplications= await JobApplication.find();
    console.log(jobapplications);

    if(jobapplications.length===0){
      return res.status(400).json({
        message:"no job applications found",
        success:false
      })
    }

    return res.status(200).json({
      jobapplications,
      success:true
    })

  } catch (error) {
    console.error("error fetching job applications: ",error.message,error.stack);
    return res.status(500).json({
      message: "An error occurred while fetching job applications",
      success: false,
    })
    
  }
}

export const DeleteJobApplication = async (req,res) => {
  try {
    const jobapplicationId= req.params.id;

    const jobapplication= await JobApplication.findById(jobapplicationId);



    if(!jobapplication){
      return res.status(400).json({
        message:"job application not found",
        success:false
      })
    }

    if(jobapplication.user.toString() !== req.user._id.toString()){
      return res.status(403).json({
        message:"You are not authorized to delete this job application",
        success:false
      })
    }

    await jobapplication.deleteOne();

    return res.status(200).json({
      message:"Job Application Deleted Successfully",
      success:true
    })

    
  } catch (error) {
    console.error("error deleting job application",error.message);
    return res.status(500).json({
      message:"Server error while deleting job application",
      success:false
    })
    
  }
}


export const GetJobApplicationForRecruiter = async (req, res) => {
  try {
    if (req.user.role !== "recruiter") {
      return res.status(403).json({
        message: "Access denied",
        success: false,
      });
    }

    const applicationsWithUsers = await Applicant.find()
    .populate({
      path: "job",
      match: { user: req.user._id }, 
    })
    .populate("user", "_id fullname email mobilenumber");

    const filteredApplications = applicationsWithUsers.filter(
      (application) => application.job !== null
    );

    return res.status(200).json({
       filteredApplications,
      success: true,
    });
    

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error while fetching recruiter job applications",
      success: false,
    });
  }
};



export const GetUserAppliedJobApplication = async (req, res) => {
  try {
   
    if (req.user.role !== "user") {
      return res.status(403).json({
        message: "Access denied",
        success: false,
      });
    }

  
    const jobapplications = await Applicant.find({ user: req.user._id }).populate(
      "job" 
    );


    return res.status(200).json({
      appliedJobs: jobapplications,
      success: true,
    });
  } catch (error) {
    console.error("Error fetching user's applied jobs:", error.message);
    return res.status(500).json({
      message: "Server error while fetching applied jobs",
      success: false,
    });
  }
};


