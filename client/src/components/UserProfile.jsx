import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import { Pencil } from "lucide-react";
import { Upload } from 'lucide-react';
import { Eye } from 'lucide-react';



const UserProfile = () => {

     const { user } = useSelector((store) => store.auth);
   
  

  return (
    <div className="mt-10 min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-8">
            <div className="flex flex-col items-center">
              <div className="w-28 h-28 bg-white text-blue-600 rounded-full flex items-center justify-center text-3xl font-bold shadow-lg border-4 border-white">
                {user?.fullname?.charAt(0) || "U"}
              </div>
              <h1 className="text-3xl font-bold text-white mt-4">
                {user?.fullname || "Unknown User"}
              </h1>

              <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-4 ">

                {user?.role !== "recruiter" && (
                <Link
                  to="/edit-profile"
                  className="mt-2 justify-center flex  gap-2 border border-gray-300 bg-white text-gray-800 rounded-md md:w-[150px] px-4 py-2 text-base font-medium shadow hover:bg-gray-100 transition duration-200"
                >
                  <Pencil className="w-5 h-5 text-gray-600" />
                  Edit Profile
                </Link>)}

                {user?.role !== "user" && (
                  <span>
                     <Link
                  to="/edit-profile"
                  className="mt-2 justify-center flex  gap-2 border border-gray-300 bg-white text-gray-800 rounded-md md:w-[150px] px-4 py-2 text-base font-medium shadow hover:bg-gray-100 transition duration-200"
                >
                  <Pencil className="w-5 h-5 text-gray-600" />
                  Edit Profile
                </Link>

                  <Link
                    to="/recruiter-posted-job-applications"
                    className="mt-2 flex items-center gap-2 border border-gray-300 bg-white text-gray-800 rounded-md px-4 py-2 text-base font-medium shadow hover:bg-gray-100 transition duration-200"
                  >
                    <Eye className="w-5 h-5 text-gray-600" />
                    View My Job Applications
                  </Link>
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-6 rounded-xl">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  Contact Information
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-500">Email</label>
                    <p className="text-gray-800 font-medium">
                      {user?.email || "Not Available"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">
                      Mobile Number
                    </label>
                    <p className="text-gray-800 font-medium">
                      {user?.mobilenumber || "Not Available"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                  Account Details
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-500">
                      Member Since
                    </label>
                    <p className="text-gray-800 font-medium">
                      {dayjs(user.createdAt).format("MMMM D, YYYY")}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm text-gray-500">
                      Account Type
                    </label>
                    <p className="text-gray-800 font-medium capitalize">
                      {user?.role || "User"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              {user?.role !== "recruiter" && (
                <Link
                  to="/get-user-applied-job-application"
                  className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition duration-200 shadow-lg hover:shadow-xl"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                  View applied jobs
                </Link>
              )}
             
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile