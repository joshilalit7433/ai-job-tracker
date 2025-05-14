import { BrowserRouter, Routes, Route } from "react-router-dom";
import './app.css'
import Home from './routes/Home'
import Navbar from "./components/Navbar";
import JobApplications from "./routes/JobApplications";
import JobApplicationForm from "./routes/JobApplicationForm";
import Login from "./routes/login";
import Signup from "./routes/Signup";
import { ToastContainer } from "react-toastify";
import UserProfile from "./components/UserProfile";
import UserAppliedJobApplication from "./components/UserAppliedJobApplication";
import EditProfile from "./routes/EditProfile";
import UploadResume from "./routes/UploadResume";




function App() {
 

  return (
    <>
    
    <BrowserRouter>
    <Navbar/>
    <ToastContainer/>
    <div className="pt-20">
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="job-applications" element={<JobApplications/>}/>
      <Route path="login" element={<Login/>}/>
      <Route path="signup" element={<Signup/>}/>
      <Route path="job-application-form" element={<JobApplicationForm/>}/>
      <Route path="user-profile" element={<UserProfile/>}/>
      <Route path="get-user-applied-job-application" element={<UserAppliedJobApplication/>}/>
      <Route path="edit-profile" element={<EditProfile/>}/>
      <Route path="upload-resume" element={<UploadResume/>}/>
    </Routes>
    </div>
    </BrowserRouter>

     
    </>
  )
}

export default App
