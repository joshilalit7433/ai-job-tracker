import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import { Pencil, Dock, Eye, Contact, NotepadText } from "lucide-react";
import { BACKEND_BASE_URL } from "../utils/constant";

const UserProfile = () => {
  const { user } = useSelector((store) => store.auth);

  return (
    <div className="bg-[#f7e9d6] min-h-screen py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="rounded-2xl shadow-lg overflow-hidden mt-[70px] bg-[#FAF6E9]">

        
          <div className="bg-[#ead695] px-6 py-10 text-center text-white">
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 bg-white text-blue-600 rounded-full flex items-center justify-center text-3xl font-bold shadow-md border-4 border-white">
                {user?.fullname?.charAt(0) || "U"}
              </div>
              <h1 className="text-3xl font-bold mt-4">{user?.fullname || "Unknown User"}</h1>

              <div className="flex flex-wrap justify-center gap-4 mt-6">
                <Link
                  to="/edit-profile"
                  className="bg-white text-gray-800 hover:bg-gray-100 px-5 py-2 rounded-md shadow transition flex items-center gap-2"
                >
                  <Pencil className="w-5 h-5 text-gray-600" />
                  Edit Profile
                </Link>

                {user?.role === "recruiter" && (
                  <Link
                    to="/recruiter-posted-job-applications"
                    className="bg-white text-gray-800 hover:bg-gray-100 px-5 py-2 rounded-md shadow transition flex items-center gap-2"
                  >
                    <Eye className="w-5 h-5 text-gray-600" />
                    My Job Posts
                  </Link>
                )}
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <Contact className="w-6 h-6 mr-2" />
                  Contact Information
                </h2>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="text-gray-900 font-medium">{user?.email}</p>
                  <p className="text-sm text-gray-600">Mobile</p>
                  <p className="text-gray-900 font-medium">{user?.mobilenumber || "Not Provided"}</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <NotepadText className="w-6 h-6 mr-2" />
                  Account Details
                </h2>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Member Since</p>
                  <p className="text-gray-900 font-medium">
                    {dayjs(user.createdAt).format("MMMM D, YYYY")}
                  </p>
                  <p className="text-sm text-gray-600">Account Type</p>
                  <p className="text-gray-900 font-medium capitalize">
                    {user?.role || "User"}
                  </p>
                </div>
              </div>
            </div>

            {user?.role === "user" && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:justify-center gap-4">
                  <Link
                    to="/get-user-applied-job-application"
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition shadow"
                  >
                    <Dock className="w-5 h-5" />
                    View Applied Jobs
                  </Link>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Saved Resume & Cover Letter
                  </h2>
                  {user?.resume ? (
                    <div className="mb-3">
                      <p className="text-sm text-gray-600">Resume:</p>
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
                    <p className="text-sm text-gray-600">No resume uploaded yet.</p>
                  )}

                  {user?.cover_letter ? (
                    <div className="mt-3">
                      <p className="text-sm text-gray-600">Cover Letter:</p>
                      <p className="text-sm text-gray-800 bg-gray-100 p-3 rounded shadow whitespace-pre-wrap">
                        {user.cover_letter}
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-600 mt-2">No cover letter saved.</p>
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
