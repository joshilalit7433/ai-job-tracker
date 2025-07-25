export interface User {
  _id: string;
  fullName: string;
  email: string;
  password: string;
  mobileNumber: number;
  role: 'user' | 'recruiter' | 'admin';
  resume: string;
  coverLetter: string;
  resumeAnalysis: string;
  savedJobs: string[];
  totalJobsPosted: number;
}


export interface JobApplication {
  _id: string;
  user: string;
  title: string;
  salary: number;
  location: string;
  companyName: string;
  jobType: 'part-time' | 'full-time';
  benefits: string;
  experience: string;
  responsibilities: string;
  skills: string[];
  qualification: string;
  status: 'applied' | 'interviewing' | 'offered' | 'rejected' | 'open' | 'closed';
  isApproved: boolean;
  image: string;
  jobCategory: 'Information Technology (IT)' | 'Human Resources (HR)' | 'Finance & Accounting' | 'Marketing & Advertising' | 'Customer Service' | 'Product Management' | 'Design & Creative';
}

export interface Applicant {
  _id: string;
  job: string; 
  user: string;
  fullName: string;
  email: string;
  mobileNumber: number;
  resume: string;
  appliedAt: Date;
  status: 'pending' | 'interview' | 'rejected' | 'shortlisted' | 'hired';
  coverLetter: string;
  recruiterResponse: string;
  matchedSkills: string[];
  missingSkills: string[];
  respondedAt?: Date;

}


export interface Notification{
  _id: string;
  user: string;
  title: string;
  companyName: string;
  location: string;
  isRead: boolean;
  createdAt: string;
}

