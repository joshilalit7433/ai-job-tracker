import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./app.css";
import { Home } from "./routes/Home";
import Navbar from "./components/Navbar";
import JobApplications from "./routes/JobApplications";
import JobApplicationForm from "./routes/JobApplicationForm";
import Login from "./routes/Login";
import Signup from "./routes/Signup";
import { ToastContainer } from "react-toastify";
import UserProfile from "./components/UserProfile";
import UserAppliedJobApplication from "./components/UserAppliedJobApplication";
import EditProfile from "./routes/EditProfile";
import RecruiterPostedJobApplications from "./components/RecruiterPostedJobApplications";
import EditJobApplication from "./routes/EditJobApplication";
import ViewJobApplication from "./components/ViewJobApplication";
import ApplyJobApplication from "./routes/ApplyJobApplication";
import ProtectedRoute from "./components/ProtectedRoute";
import ViewApplicants from "./routes/ViewApplicants";
import AdminDashboard from "./components/AdminDashboard";
import UserSavedJobApplication from "./components/UserSavedJobApplication";
import NotificationPanel from "./components/NotificationPanel";
import RecruiterResponse from "./components/RecruiterResponse";
import RecruiterDashboard from "./components/RecruiterDashboard";
import SpecifiJobs from "./components/SpecifiJobs";
import { useAppSelector } from "./redux/hooks";

function App() {
  const { user } = useAppSelector((state) => state.auth);
  return (
    <>
      <BrowserRouter>
        {user?.role !== "recruiter" && <Navbar />}
        <ToastContainer
          toastClassName="bg-black text-white rounded shadow-lg"
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        <div>
          <Routes>
            {/*  Public Routes (Accessible by all) */}
            <Route path="/" element={<Home />} />
            <Route path="/job-applications" element={<JobApplications />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/job-application-details/:id"
              element={<ViewJobApplication />}
            />
            <Route
              path="/jobs/category/:categoryName"
              element={<SpecifiJobs />}
            />

            {/*  Admin Only */}
            <Route
              path="/admin-dashboard"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            {/*  User, Recruiter, Admin */}
            <Route
              path="/user-profile"
              element={
                <ProtectedRoute allowedRoles={["user", "recruiter", "admin"]}>
                  <UserProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/edit-profile"
              element={
                <ProtectedRoute allowedRoles={["user", "recruiter", "admin"]}>
                  <EditProfile />
                </ProtectedRoute>
              }
            />

            {/*  User Only */}
            <Route
              path="/get-user-applied-job-application"
              element={
                <ProtectedRoute allowedRoles={["user"]}>
                  <UserAppliedJobApplication />
                </ProtectedRoute>
              }
            />
            <Route
              path="/apply-job-application/:id"
              element={
                <ProtectedRoute allowedRoles={["user"]}>
                  <ApplyJobApplication />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user-saved-job-application"
              element={
                <ProtectedRoute allowedRoles={["user"]}>
                  <UserSavedJobApplication />
                </ProtectedRoute>
              }
            />

            {/*  Recruiter Only */}
            <Route
              path="/job-application-form"
              element={
                <ProtectedRoute allowedRoles={["recruiter"]}>
                  <JobApplicationForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/recruiter-posted-job-applications"
              element={
                <ProtectedRoute allowedRoles={["recruiter"]}>
                  <RecruiterPostedJobApplications />
                </ProtectedRoute>
              }
            />
            <Route
              path="/edit-job-applications/:id"
              element={
                <ProtectedRoute allowedRoles={["recruiter"]}>
                  <EditJobApplication />
                </ProtectedRoute>
              }
            />
            <Route
              path="/view-applicant/:jobId"
              element={
                <ProtectedRoute allowedRoles={["recruiter"]}>
                  <ViewApplicants />
                </ProtectedRoute>
              }
            />
            <Route
              path="/notifications"
              element={
                <ProtectedRoute allowedRoles={["recruiter"]}>
                  <NotificationPanel />
                </ProtectedRoute>
              }
            />
            <Route
              path="/recruiter-response/:id"
              element={
                <ProtectedRoute allowedRoles={["recruiter"]}>
                  <RecruiterResponse />
                </ProtectedRoute>
              }
            />
            <Route
              path="/recruiter-dashboard"
              element={
                <ProtectedRoute allowedRoles={["recruiter"]}>
                  <RecruiterDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;
