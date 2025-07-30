import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { USER_API_END_POINT } from "../utils/constant";
import { Mail, Lock, Phone, UserRound } from "lucide-react";
import { ApiResponse } from "../types/apiResponse";
import { User } from "../types/models";
import { InputField } from "../components/InputField";

interface SignupForm {
  fullName: string;
  email: string;
  password: string;
  mobileNumber: string;
  role: string;
}

const Signup = () => {
  const initialvalues: SignupForm = {
    fullName: "",
    email: "",
    password: "",
    mobileNumber: "",
    role: "",
  };

  const navigate = useNavigate();
  const [formvalues, setFormvalues] = useState<SignupForm>(initialvalues);
  const [formerrors, setformerrors] = useState<Partial<SignupForm>>({});
  const [submit, setsubmit] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormvalues({ ...formvalues, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errors = validate(formvalues);
    setformerrors(errors);
    setsubmit(true);

    if (Object.keys(errors).length > 0) return;

    try {
      const response = await axios.post<ApiResponse<User>>(
        `${USER_API_END_POINT}/register`,
        formvalues,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: false,
        }
      );

      if (response.data.success) {
        navigate("/login");
        toast.success("Registered successfully", {
          position: "bottom-right",
          autoClose: 5000,
          theme: "dark",
        });
      }
    } catch (error) {
      console.error("Signup Error:", error);
      toast.error("Registration failed", {
        position: "bottom-right",
        autoClose: 5000,
        theme: "dark",
      });
    }
  };

  const validate = (values: SignupForm): Partial<SignupForm> => {
    const errors: Partial<SignupForm> = {};
    const regx = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

    if (!values.fullName) errors.fullName = "Full name is required";

    if (!values.email) errors.email = "Email is required";
    else if (!regx.test(values.email)) errors.email = "Invalid email format";

    if (!values.password) errors.password = "Password is required";
    else if (values.password.length < 4)
      errors.password = "Password must be at least 4 characters";

    if (!values.mobileNumber) {
      errors.mobileNumber = "Mobile number is required";
    } else if (
      values.mobileNumber.length < 10 ||
      values.mobileNumber.length > 11
    ) {
      errors.mobileNumber = "Invalid mobile number";
    }

    if (!values.role) errors.role = "Role is required";

    return errors;
  };

  return (
    <>
      <div className="flex bg-[#f7e9d6] justify-center items-center px-4 py-6 sm:py-8 md:py-10 lg:py-12">
        <form
          onSubmit={handleSubmit}
          className="w-full mt-[50px] max-w-md bg-[#FAF6E9] p-4 sm:p-6 md:p-8 rounded-lg shadow-lg"
        >
          <div className="text-center mb-4 sm:mb-6">
            <p className="text-xl sm:text-2xl font-bold text-[#131D4F]">
              Sign Up
            </p>
          </div>

          {/* Full Name */}
          <InputField
            label="Full Name:"
            name="fullName"
            type="text"
            icon={<UserRound className="text-[#131D4F] mr-2 h-5 w-5" />}
            value={formvalues.fullName}
            onChange={handleChange}
            error={formerrors.fullName}
          />

          {/* Email */}
          <InputField
            label="Email:"
            name="email"
            type="email"
            icon={<Mail className="text-[#131D4F] mr-2 h-5 w-5" />}
            value={formvalues.email}
            onChange={handleChange}
            error={formerrors.email}
          />

          {/* Password */}
          <InputField
            label="Password:"
            name="password"
            type="password"
            icon={<Lock className="text-[#131D4F] mr-2 h-5 w-5" />}
            value={formvalues.password}
            onChange={handleChange}
            error={formerrors.password}
          />

          {/* Mobile Number */}
          <InputField
            label="Mobile Number:"
            name="mobileNumber"
            type="number"
            icon={<Phone className="text-[#131D4F] mr-2 h-5 w-5" />}
            value={formvalues.mobileNumber}
            onChange={handleChange}
            error={formerrors.mobileNumber}
          />

          {/* Role Selection */}
          <div className="mb-4">
            <label className="text-base sm:text-lg text-[#131D4F]">Role:</label>
            <div className="flex items-center space-x-4 border-b-2 border-[#131D4F] py-2 mt-1">
              {["user", "recruiter"].map((role) => (
                <div key={role} className="flex items-center">
                  <input
                    type="radio"
                    id={role}
                    name="role"
                    value={role}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <label
                    htmlFor={role}
                    className="text-[#131D4F] text-sm sm:text-base capitalize"
                  >
                    {role}
                  </label>
                </div>
              ))}
            </div>
            <p className="text-[#131D4F] text-xs sm:text-sm mt-1">
              {formerrors.role}
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center mt-6">
            <button className="text-base sm:text-lg w-full py-2 text-white bg-blue-600 rounded-lg font-bold transition-colors hover:bg-blue-700">
              SIGN UP
            </button>
          </div>

          <div className="text-center mt-4">
            <Link
              to="/login"
              className="text-[#131D4F] text-sm sm:text-base underline "
            >
              Already have an account?
            </Link>
          </div>
        </form>
      </div>
      <ToastContainer />
    </>
  );
};

export default Signup;
