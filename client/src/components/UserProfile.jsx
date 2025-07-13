import { useSelector} from "react-redux";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import { Pencil, Dock, Contact, NotepadText, X } from "lucide-react";
import { BACKEND_BASE_URL } from "../utils/constant";
import { useState } from "react";
import ProfileEditForm from "./ProfileEditForm";

const UserProfile = () => {
  const { user } = useSelector((store) => store.auth);
  const [showEdit, setShowEdit] = useState(false);

  return (
    <div className="bg-gradient-to-br from-[#f7e9d6] to-[#f0e6d0] min-h-screen py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="relative rounded-3xl shadow-2xl overflow-hidden mt-[70px] bg-white/80 backdrop-blur-lg p-8">
          {/* Floating Edit Button */}
          <button
            onClick={() => setShowEdit(true)}
            className="absolute top-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition"
            title="Edit Profile"
          >
            <Pencil className="w-5 h-5" />
          </button>

          <div className="flex flex-col items-center">
            <div className="w-28 h-28 bg-gradient-to-tr from-blue-500 to-purple-400 text-white rounded-full flex items-center justify-center text-4xl font-bold shadow-lg border-4 border-white">
              {user?.fullname?.charAt(0) || "U"}
            </div>
            <h1 className="text-3xl font-bold mt-4 text-[#131D4F]">{user?.fullname || "Unknown User"}</h1>
            <p className="text-gray-500 mt-1">{user?.email}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
            <div className="bg-white/90 p-6 rounded-2xl shadow-sm">
              <h2 className="text-xl font-semibold text-[#131D4F] mb-4 flex items-center">
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

            <div className="bg-white/90 p-6 rounded-2xl shadow-sm">
              <h2 className="text-xl font-semibold text-[#131D4F] mb-4 flex items-center">
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
            <div className="space-y-6 mt-10">
              <div className="flex flex-col sm:flex-row sm:justify-center gap-4">
                <Link
                  to="/get-user-applied-job-application"
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition shadow"
                >
                  <Dock className="w-5 h-5" />
                  View Applied Jobs
                </Link>
              </div>

              <div className="bg-white/90 p-6 rounded-2xl shadow-sm">
                <h2 className="text-xl font-semibold text-[#131D4F] mb-4">
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

        {/* Edit Profile Modal */}
        {showEdit && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/30 backdrop-blur-xs">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg relative animate-fadeIn">
              <button
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
                onClick={() => setShowEdit(false)}
                title="Close"
              >
                <X className="w-6 h-6" />
              </button>
              <ProfileEditForm onClose={() => setShowEdit(false)} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
