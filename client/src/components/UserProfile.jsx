import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import { Pencil, Dock, Eye, Contact, NotepadText } from "lucide-react";
import { BACKEND_BASE_URL } from "../utils/constant";

const UserProfile = () => {
  const { user } = useSelector((store) => store.auth);

  return (
    <div className="mt-10 min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-8 text-center">
            <div className="flex flex-col items-center">
              <div className="w-28 h-28 bg-white text-blue-600 rounded-full flex items-center justify-center text-3xl font-bold shadow-lg border-4 border-white">
                {user?.fullname?.charAt(0) || "U"}
              </div>
              <h1 className="text-3xl font-bold text-white mt-4">
                {user?.fullname || "Unknown User"}
              </h1>

              <div className="flex flex-wrap justify-center gap-4 mt-4">
                <Link
                  to="/edit-profile"
                  className="flex items-center gap-2 border border-gray-200 bg-white text-gray-800 rounded-md px-4 py-2 font-medium shadow hover:bg-gray-100 transition"
                >
                  <Pencil className="w-5 h-5 text-gray-600" />
                  Edit Profile
                </Link>

                {user?.role === "recruiter" && (
                  <Link
                    to="/recruiter-posted-job-applications"
                    className="flex items-center gap-2 border border-gray-200 bg-white text-gray-800 rounded-md px-4 py-2 font-medium shadow hover:bg-gray-100 transition"
                  >
                    <Eye className="w-5 h-5 text-gray-600" />
                    View My Job Applications
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="p-6 sm:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Contact Info */}
              <div className="bg-gray-50 p-6 rounded-xl">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <Contact className="w-6 h-6 mr-2" />
                  Contact Information
                </h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-gray-800 font-medium">{user?.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Mobile Number</p>
                    <p className="text-gray-800 font-medium">
                      {user?.mobilenumber || "Not Available"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Account Info */}
              <div className="bg-gray-50 p-6 rounded-xl">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <NotepadText className="w-6 h-6 mr-2" />
                  Account Details
                </h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Member Since</p>
                    <p className="text-gray-800 font-medium">
                      {dayjs(user.createdAt).format("MMMM D, YYYY")}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Account Type</p>
                    <p className="text-gray-800 font-medium capitalize">
                      {user?.role || "User"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* User Only Actions */}
            {user?.role === "user" && (
              <div className="mt-10 space-y-6">
                {/* Job Links */}
                <div className="flex flex-col sm:flex-row sm:justify-center gap-4">
                  <Link
                    to="/get-user-applied-job-application"
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition shadow"
                  >
                    <Dock className="w-5 h-5" />
                    View Applied Jobs
                  </Link>
                </div>

                {/* Resume & Cover Letter */}
                <div className="bg-gray-50 p-6 rounded-xl">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Saved Resume & Cover Letter
                  </h2>

                  {user?.resume ? (
                    <div className="mb-4">
                      <p className="text-sm text-gray-500">Resume:</p>
                      <a
                        href={`${BACKEND_BASE_URL}/${user.resume}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 underline text-sm"
                      >
                        View Resume
                      </a>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">
                      No resume uploaded yet.
                    </p>
                  )}

                  {user?.cover_letter ? (
                    <div className="mt-3">
                      <p className="text-sm text-gray-500">Cover Letter:</p>
                      <p className="text-sm text-gray-800 bg-white p-3 rounded shadow whitespace-pre-wrap">
                        {user.cover_letter}
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 mt-3">
                      No cover letter saved.
                    </p>
                  )}
                </div>

                
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
