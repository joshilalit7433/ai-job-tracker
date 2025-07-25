import axios from "axios";
import { USER_API_END_POINT } from "../utils/constant.js";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { setUser } from "../redux/authSlice";

const ProfileEditForm = ({ onClose }) => {
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobileNumber: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || "",
        email: user.email || "",
        mobileNumber: user.mobileNumber || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataToUpdate = {};
    if (formData.fullName !== user.fullName) dataToUpdate.fullName = formData.fullName;
    if (formData.email !== user.email) dataToUpdate.email = formData.email;
    if (formData.mobileNumber !== user.mobileNumber)
      dataToUpdate.mobileNumber = formData.mobileNumber;

    if (Object.keys(dataToUpdate).length === 0) {
      toast.info("No changes made.",{position:"bottom-right"});
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(`${USER_API_END_POINT}/updateprofile`, dataToUpdate, {
        withCredentials: true,
      });

      if (res.data.success) {
        // Debug: log the user object
        console.log("Updated user object:", res.data.user);

        // Fallback: merge with existing user if needed
        const updatedUser = {
          ...user,
          ...res.data.user,
        };

        // Check for required fields
        if (!updatedUser._id || !updatedUser.role || !updatedUser.email) {
          toast.error("Update failed: incomplete user data from server.", { position: "bottom-right" });
          setLoading(false);
          return;
        }

        toast.success("Profile updated successfully!",{position:"bottom-right"});
        dispatch(setUser(updatedUser));
        if (onClose) {
          onClose();
        }
        setTimeout(() => {
          navigate("/user-profile", { replace: true });
        }, 100);
      } else {
        toast.error(res.data.message || "Update failed.", { position: "bottom-right" });
      }
    } catch (err) {
      toast.error("Error updating profile", { position: "bottom-right" });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white/90 shadow-2xl rounded-2xl w-full p-8 space-y-6 backdrop-blur-md"
    >
      <h2 className="text-2xl font-bold text-center text-[#131D4F] mb-2">
        Edit Profile
      </h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Full Name
        </label>
        <input
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/80"
          placeholder="Enter new name"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/80"
          placeholder="Enter new email"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Mobile Number
        </label>
        <input
          type="text"
          name="mobileNumber"
          value={formData.mobileNumber}
          onChange={handleChange}
          className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/80"
          placeholder="Enter new number"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-200 font-semibold shadow"
      >
        {loading ? "Updating..." : "Update Profile"}
      </button>
    </form>
  );
};

export default ProfileEditForm; 