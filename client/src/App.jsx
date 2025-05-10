import { BrowserRouter, Routes, Route } from "react-router-dom";
import './app.css'
import Home from './routes/Home'
import Navbar from "./components/Navbar";
import JobApplications from "./routes/JobApplications";


function App() {
 

  return (
    <>
    
    <BrowserRouter>
    <Navbar/>
    <div className="pt-20">
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="job-applications" element={<JobApplications/>}/>
    </Routes>
    </div>
    </BrowserRouter>

     
    </>
  )
}

export default App
