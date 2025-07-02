import axios from "axios";
import { USER_API_END_POINT } from "../utils/constant.js";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { setUser } from "../redux/authSlice";

const EditProfile = () => {
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    mobilenumber: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        fullname: user.fullname || "",
        email: user.email || "",
        mobilenumber: user.mobilenumber || "",
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
    if (formData.fullname !== user.fullname) dataToUpdate.fullname = formData.fullname;
    if (formData.email !== user.email) dataToUpdate.email = formData.email;
    if (formData.mobilenumber !== user.mobilenumber)
      dataToUpdate.mobilenumber = formData.mobilenumber;

    if (Object.keys(dataToUpdate).length === 0) {
      toast.info("No changes made.");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(`${USER_API_END_POINT}/updateprofile`, dataToUpdate, {
        withCredentials: true,
      });

      if (res.data.success) {
        toast.success("Profile updated successfully!");
        dispatch(setUser(res.data.user));
        navigate("/user-profile");
      } else {
        toast.error(res.data.message || "Update failed.",{position:"bottom-right"});
      }
    } catch (err) {
      toast.error("Error updating profile",{position:"bottom-right"});
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7e9d6] flex items-center justify-center px-4 py-10">
      <form
        onSubmit={handleSubmit}
        className="bg-[#FAF6E9] shadow-xl rounded-2xl w-full max-w-md p-8 space-y-6"
      >
        <h2 className="text-3xl font-bold text-center text-gray-800">
          Edit Profile
        </h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            type="text"
            name="fullname"
            value={formData.fullname}
            onChange={handleChange}
            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter new email"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mobile Number
          </label>
          <input
            type="text"
            name="mobilenumber"
            value={formData.mobilenumber}
            onChange={handleChange}
            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter new number"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-200 font-semibold"
        >
          {loading ? "Updating..." : "Update Profile"}
        </button>
      </form>
    </div>
  );
};

export default EditProfile;
