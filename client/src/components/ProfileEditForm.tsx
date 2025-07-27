import axios from "axios";
import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { USER_API_END_POINT } from "../utils/constant";
import { setUser } from "../redux/authSlice";
import { RootState } from "../redux/store";
import { User } from "../types/models";
import { ApiResponse } from "../types/apiResponse";

interface Props {
  onClose?: () => void;
}

const ProfileEditForm: React.FC<Props> = ({ onClose }) => {
  const user = useSelector((state: RootState) => state.auth.user as User | null);
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
        mobileNumber: user.mobileNumber?.toString() || "",
      });
    }
  }, [user]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const updatedFields: Partial<Pick<User, "fullName" | "email" | "mobileNumber">> = {};
    if (formData.fullName !== user?.fullName) updatedFields.fullName = formData.fullName;
    if (formData.email !== user?.email) updatedFields.email = formData.email;
    if (parseInt(formData.mobileNumber) !== user?.mobileNumber)
      updatedFields.mobileNumber = parseInt(formData.mobileNumber);

    if (Object.keys(updatedFields).length === 0) {
      toast.info("No changes made.", { position: "bottom-right" });
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post<ApiResponse<User>>(
        `${USER_API_END_POINT}/updateprofile`,
        updatedFields,
        { withCredentials: true }
      );

      const { success, message, data } = response.data;

      if (success && data) {
        console.log(response.data);
        dispatch(setUser(data));
        await new Promise((resolve) => setTimeout(resolve, 200)); // wait for persist to save
        toast.success("Profile updated successfully!", { position: "bottom-right" });
        if (onClose) onClose();
      } else {
        toast.error(message || "Update failed", { position: "bottom-right" });
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong.", { position: "bottom-right" });
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
        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
        <input
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          className="w-full border border-gray-300 px-4 py-2 rounded-lg bg-white/80"
          placeholder="Enter full name"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full border border-gray-300 px-4 py-2 rounded-lg bg-white/80"
          placeholder="Enter email"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
        <input
          type="tel"
          name="mobileNumber"
          value={formData.mobileNumber}
          onChange={handleChange}
          className="w-full border border-gray-300 px-4 py-2 rounded-lg bg-white/80"
          placeholder="Enter mobile number"
          required
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-semibold"
      >
        {loading ? "Updating..." : "Update Profile"}
      </button>
    </form>
  );
};

export default ProfileEditForm;
