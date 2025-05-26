import { BrowserRouter, Routes, Route } from "react-router-dom";
import './app.css'
import Home from './routes/Home'
import Navbar from "./components/Navbar";
import JobApplications from "./routes/JobApplications";
import JobApplicationForm from "./routes/JobApplicationForm";
import Login from "./routes/Login";
import Signup from "./routes/Signup";
import { ToastContainer } from "react-toastify";
import UserProfile from "./components/UserProfile";
import UserAppliedJobApplication from "./components/UserAppliedJobApplication";
import EditProfile from "./routes/EditProfile";
import RecruiterPostedJobApplication from "./components/RecruiterPostedJobApplication";
import EditJobApplication from "./routes/EditJobApplication";
import ViewJobApplication from "./components/ViewJobApplication";
import ApplyJobApplication from "./routes/ApplyJobApplication";
import ProtectedRoute from "./components/ProtectedRoute";
import ViewApplicants from "./routes/ViewApplicants";
import AdminDashboard from "./components/AdminDashboard";
import UserSavedJobApplication from "./components/UserSavedJobApplication";




function App() {
 

  return (
    <>
    
    <BrowserRouter>
    <Navbar/>
    <div className="pt-20">
    <ToastContainer/>
    <Routes>
      {/* this page can only be accessed by admins */}
      <Route path="/admin-dashboard" element={<ProtectedRoute allowedRoles={["admin"]}><AdminDashboard/></ProtectedRoute>}/>
       
       {/* this page can be accessed by anyone who have not logged in */}
      <Route path="/" element={<Home/>}/>
      <Route path="/job-applications" element={<JobApplications/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/signup" element={<Signup/>}/>
      <Route path="/job-application-details/:id" element={<ViewJobApplication/>}/>
     


      {/* this page can be accessed by only users and recruiters */}
      <Route path="/user-profile" element={<ProtectedRoute allowedRoles={["user","recruiter","admin"]} ><UserProfile/></ProtectedRoute>}/>
      <Route path="/edit-profile" element={<ProtectedRoute allowedRoles={["user","recruiter","admin"]}><EditProfile/></ProtectedRoute>}/>

      {/* this page can be accessed by only users  */}
      <Route path="/get-user-applied-job-application" element={<ProtectedRoute allowedRoles={["user"]}><UserAppliedJobApplication/></ProtectedRoute>}/>
      <Route path="/apply-job-application/:id" element={<ProtectedRoute allowedRoles={["user"]}><ApplyJobApplication/></ProtectedRoute>}/>
       <Route path="/user-saved-job-application" element={<ProtectedRoute allowedRoles={["user"]}><UserSavedJobApplication/></ProtectedRoute>}/>



      {/* this page can be accessed by only  recruiters */}
      <Route path="/job-application-form" element={<ProtectedRoute allowedRoles={["recruiter"]}><JobApplicationForm/></ProtectedRoute>}/>
      <Route path="/recruiter-posted-job-applications" element={<ProtectedRoute  allowedRoles={["recruiter"]} ><RecruiterPostedJobApplication/></ProtectedRoute>}/>
      <Route path="/edit-job-applications/:id" element={<ProtectedRoute allowedRoles={["recruiter"]} ><EditJobApplication/></ProtectedRoute>}/>
      <Route path="/view-applicant/:jobId" element={<ProtectedRoute allowedRoles={["recruiter"]} ><ViewApplicants/></ProtectedRoute>}/>





    </Routes>
    </div>
    </BrowserRouter>

     
    </>
  )
}

export default App
