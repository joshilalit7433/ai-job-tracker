import { useState } from "react";
import axios from "axios";
import { Link,useNavigate } from "react-router-dom";
import {  useDispatch } from "react-redux";
import {USER_API_END_POINT} from "../utils/constant.js";
import { setUser } from "../redux/authSlice";
import { Mail,Lock } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLocation } from "react-router-dom";


const Login = () => {
  const navigate=useNavigate();
  const dispatch=useDispatch();
  const location=useLocation();

  const redirectPath=location.state?.from || "/";

   const initialvalues={
    email:"",
    password:"",
    role:"",
  };

  const [formvalues,setformvalues]=useState(initialvalues);
  const [formerrors,setformerrors]=useState({});
  //eslint-disable-next-line
  const [submit,setsubmit]=useState(false);


  

  const handleChange = (e) =>{
    const {name,value} = e.target;
    setformvalues({...formvalues,[name]:value});
  }

  const handleSubmit = async (e) =>{
    e.preventDefault();
    const errors=validate(formvalues);
    setformerrors(errors);
    setsubmit(true);
  



  try {
    const response = await axios.post(`${USER_API_END_POINT}/login`,formvalues,{
      headers:{ "Content-Type":"application/json"},
      withCredentials:true,
    });

    if(response.data.success){
      dispatch(setUser(response.data.user));
      

     

      toast.success(response.data.message, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "dark",
        });

        navigate(redirectPath);

    }

    else{
       toast.error(response.data.message || "Login failed. Please try again.", {
          position: "top-center",
          autoClose: 5000,
          theme: "dark",
        });
      
    }
    
  } catch (error) {
    console.log(error);
    toast.error(
        "An error occurred. Please check your credentials and try again.",
        {
          position: "top-center",
          autoClose: 5000,
          theme: "dark",
        }
      );
    
  }
}

  const validate = (values) =>{
    const errors={};
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

    if(!values.email){
      errors.email="email is required";
    }
    else if(!emailRegex.test(values.email)){
      errors.email="This is not a valid email format";
    }

    if(!values.password){
      errors.password="password is required";
    }
    else if(values.password.length<4){
      errors.password="password should not be less than 4 characters";
    }

    if(!values.role){
      errors.role="role is required";
    }

    return errors;

  }
 
  return (
       <div className="flex  justify-center items-center min-h-screen bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full  max-w-md bg-blue-500 p-6 rounded-lg shadow-lg"
      >
        <div className="text-center mb-6">
          <p className="text-2xl font-bold text-white">Login</p>
        </div>

        {/* Email Input */}
        <div className="mb-4">
          <label className="text-sm text-white">Email ID:</label>
          <div className="flex items-center border-b-2 border-white py-2 mt-2">
            <Mail className="text-white mr-2" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formvalues.email}
              onChange={handleChange}
              className="bg-transparent w-full text-white focus:outline-none"
            />
          </div>
          <p className="text-black text-sm">{formerrors.email}</p>
        </div>

        {/* Password Input */}
        <div className="mb-4">
          <label className="text-sm text-white">Password:</label>
          <div className="flex items-center border-b-2 border-white py-2 mt-2">
            <Lock className="text-white mr-2" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formvalues.password}
              onChange={handleChange}
              className="bg-transparent w-full text-white focus:outline-none"
            />
          </div>
          <p className="text-black text-sm">{formerrors.password}</p>
        </div>

        {/* Role Input */}
        <div className="mb-4">
          <label className="text-sm text-white">Role:</label>
          <div className="flex items-center space-x-4 mt-2">
            {["user", "recruiter", "admin"].map((role) => (
              <div key={role} className="flex items-center">
                <input
                  type="radio"
                  id={role}
                  name="role"
                  value={role}
                  onChange={handleChange}
                  className="mr-2"
                />
                <label htmlFor={role} className="text-white capitalize">
                  {role}
                </label>
              </div>
            ))}
          </div>
          <p className="text-black text-sm">{formerrors.role}</p>
        </div>

        {/* Forgot Password */}
        <div className="flex justify-between text-white text-sm mb-6">
          <Link to="/forgot-password" className="underline">
            Forgot Password?
          </Link>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <button className="w-full py-2 bg-white text-blue-500 rounded-lg font-bold hover:bg-gray-200 transition">
            LOGIN
          </button>
        </div>

        {/* Signup Link */}
        <div className="text-center mt-4">
          <Link to="/signup" className="text-white underline">
            Don't have an account?
          </Link>
        </div>
      </form>
    </div>

  )
}

export default Login