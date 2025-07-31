import { useState } from "react";
import axios from "axios";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { USER_API_END_POINT } from "../utils/constant";
import { setUser } from "../redux/authSlice";
import { Mail, Lock } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { connectSocket } from "../utils/socket";
import { ApiResponse } from "../types/apiResponse";
import { User } from "../types/models";
import { signInWithGoogle, auth } from "../firebase";
import { GoogleAuthProvider } from "firebase/auth";
import { BACKEND_BASE_URL } from "../utils/constant";

interface LoginForm {
  email: string;
  password: string;
}

interface LoginResponse {
  user: User;
  token: string;
  message: string;
  success: boolean;
}

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const redirectPath = location.state?.from || "/";

  const initialvalues: LoginForm = {
    email: "",
    password: "",
  };

  const [formvalues, setFormvalues] = useState<LoginForm>(initialvalues);
  const [formerrors, setFormerrors] = useState<Partial<LoginForm>>({});
  const [submit, setSubmit] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormvalues({ ...formvalues, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errors = validate(formvalues);
    setFormerrors(errors);
    setSubmit(true);

    if (Object.keys(errors).length > 0) return;

    try {
      const response = await axios.post<ApiResponse<User>>(
        `${USER_API_END_POINT}/login`,
        formvalues,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (response.data.success && response.data.data && response.data.token) {
        const user = response.data.data;
        dispatch(setUser(user));
        localStorage.setItem("token", response.data.token);
        connectSocket();

        toast.success(response.data.message, {
          position: "bottom-right",
          autoClose: 5000,
          theme: "dark",
        });

        // Role-based redirection
        if (user.role === "recruiter") {
          navigate("/recruiter-dashboard");
        } else if (user.role === "admin") {
          navigate("/admin-dashboard");
        } else {
          navigate(redirectPath);
        }
      } else {
        toast.error(
          response.data.message || "Login failed. Please try again.",
          {
            position: "bottom-right",
            autoClose: 5000,
            theme: "dark",
          }
        );
      }
    } catch (error) {
      console.log(error);
      toast.error(
        "An error occurred. Please check your credentials and try again.",
        {
          position: "bottom-right",
          autoClose: 5000,
          theme: "dark",
        }
      );
    }
  };

  const validate = (values: LoginForm): Partial<LoginForm> => {
    const errors: Partial<LoginForm> = {};
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

    if (!values.email) errors.email = "Email is required";
    else if (!emailRegex.test(values.email))
      errors.email = "Invalid email format";

    if (!values.password) errors.password = "Password is required";
    else if (values.password.length < 4)
      errors.password = "Password must be at least 4 characters";

    return errors;
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithGoogle();
      const idToken = await result.user.getIdToken();

      // Send token to your backend
      const response = await axios.post<ApiResponse<User>>(
        `${USER_API_END_POINT}/google`,
        {
          idToken,
        }
      );

      if (response.data.success && response.data.data && response.data.token) {
        const user = response.data.data;
        dispatch(setUser(user));
        localStorage.setItem("token", response.data.token);
        connectSocket();

        toast.success(response.data.message, {
          position: "bottom-right",
          autoClose: 5000,
          theme: "dark",
        });

        // Role-based redirection
        if (user.role === "recruiter") {
          navigate("/recruiter-dashboard");
        } else if (user.role === "admin") {
          navigate("/admin-dashboard");
        } else {
          navigate(redirectPath);
        }
      }
    } catch (err) {
      console.error("Google Sign-in failed", err);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#f7e9d6] px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm sm:max-w-md bg-[#FAF6E9] p-6 sm:p-8 rounded-xl shadow-xl border border-[#ccc] backdrop-blur-sm"
      >
        <div className="text-center mb-6">
          <p className="text-2xl sm:text-3xl font-bold text-[#131D4F]">LOGIN</p>
        </div>

        {/* Email */}
        <div className="mb-4">
          <div className="flex items-center bg-[#d9ded5] rounded-md px-3 py-2">
            <Mail className="text-[#131D4F] mr-2" size={18} />
            <input
              type="email"
              name="email"
              placeholder="Email ID"
              value={formvalues.email}
              onChange={handleChange}
              className="bg-transparent w-full text-[#131D4F] placeholder:text-[#131D4F]/60 focus:outline-none"
            />
          </div>
          {formerrors.email && (
            <p className="text-xs text-red-600 mt-1">{formerrors.email}</p>
          )}
        </div>

        {/* Password */}
        <div className="mb-6">
          <div className="flex items-center bg-[#d9ded5] rounded-md px-3 py-2">
            <Lock className="text-[#131D4F] mr-2" size={18} />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formvalues.password}
              onChange={handleChange}
              className="bg-transparent w-full text-[#131D4F] placeholder:text-[#131D4F]/60 focus:outline-none"
            />
          </div>
          {formerrors.password && (
            <p className="text-xs text-red-600 mt-1">{formerrors.password}</p>
          )}
        </div>

        {/* Login Button */}
        <button
          type="submit"
          className=" cursor-pointer w-full bg-[#131D4F] text-white py-2 rounded-md font-semibold hover:bg-[#0f1840] transition"
        >
          Login
        </button>

        {/* Google Login */}
        <div className="mt-4 flex justify-center">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            className=" cursor-pointer w-full flex items-center justify-center gap-2 py-2 bg-[#d9ded5] rounded-md text-[#131D4F] font-medium hover:bg-[#c9cfc4] transition"
          >
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google"
              className="w-5 h-5"
            />
            Google
          </button>
        </div>

        {/* Sign Up Link */}
        <div className="text-center mt-4 text-sm">
          <span className="text-[#131D4F]">Don't have an account? </span>
          <Link to="/signup" className="text-blue-600 hover:underline">
            Signup
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
