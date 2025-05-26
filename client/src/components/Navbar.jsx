import  { useState } from "react";

import { Link,useLocation,useNavigate } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "../components/ui/popover";
import { Button } from "../components/ui/button";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const Navbar = () => {
  const {user}=useSelector((store)=>store.auth);
   const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const isLoginOrSignupPage= location.pathname === "/login" || location.pathname === "/signup";

     const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
    toast.success("You have successfully Logged Out.", {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
  };

 


     const userLinks = [
    { id: 1, name: "Home", link: "/" },
    { id: 2, name: "Job Applications", link: "/job-applications" },
    {id:3, name:"Saved Jobs", link:"/user-saved-job-application"}
  ];

  const recruiterLinks = [
    { id: 1, name: "Home", link: "/" },
    {id:2, name:"Job Application Form", link:"/job-application-form"}
  ];

  const adminLinks=[
    { id: 1, name: "Home", link: "/" },
    {id:2,name:"Dashboard",link:"/admin-dashboard"}
  ]

  return (
     <nav className="bg-blue-500 shadow-lg fixed top-0 left-0 right-0 z-50">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0">
             TARGET AIMS
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden sm:flex sm:items-center sm:space-x-8">
            {   user?.role !=="recruiter" && user?.role !=="admin" &&
              userLinks.map((link) => (
                <Link
                  key={link.id}
                  to={link.link}
                  className="text-white  hover:text-white px-3 py-2 rounded-md text-lg font-medium transition duration-150 ease-in-out"
                >
                  {link.name}
                </Link>
              ))}
            {user?.role === "recruiter" &&
              recruiterLinks.map((link) => (
                <Link
                  key={link.id}
                  to={link.link}
                  className="text-white  hover:text-white px-3 py-2 rounded-md text-lg font-medium transition duration-150 ease-in-out"
                >
                  {link.name}
                </Link>
              ))}
              {
                user?.role ==="admin" &&
                adminLinks.map((link)=>(
                  <Link
                  key={link.id}
                  to={link.link}
                  className="text-white  hover:text-white px-3 py-2 rounded-md text-lg font-medium transition duration-150 ease-in-out"
                  >
                    {link.name}
                  </Link>
                ))
              }
          </div>

          <div className="hidden sm:flex sm:items-center sm:space-x-4">
          

            {!user ? (
              !isLoginOrSignupPage && (
                <Link
                  to="/login"
                  className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-full text-sm font-medium transition duration-150 ease-in-out"
                >
                  Login
                </Link>
              )
            ) : (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center space-x-2 text-white  px-3 py-2 rounded-md transition duration-150 ease-in-out"
                  >
                    <div className="flex items-center space-x-2">
                      <div className="w-10 h-10 bg-white text-black  rounded-full flex items-center justify-center text-2xl font-bold">
                        {user?.fullname?.charAt(0) || "U"}
                      </div>
                      <span className="hidden md:block text-white font-medium">
                        {user?.fullname?.split(" ")[0]}
                      </span>
                    </div>
                    <ChevronDown className="h-4 w-4 text-white" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-48 p-2 bg-white rounded-md shadow-lg border-white">
                  <Link
                    to="/user-profile"
                    className="block px-4 py-2 text-sm text-black hover:bg-gray-100 rounded-md"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-black hover:bg-gray-100 rounded-md"
                  >
                    Logout
                  </button>
                </PopoverContent>
              </Popover>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-white "
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="sm:hidden ">
          <div className="space-y-1">
            {user?.role !== "recruiter" &&
              userLinks.map((link) => (
                <Link
                  key={link.id}
                  to={link.link}
                  className="block px-4 py-3 text-white "
                  onClick={toggleMenu}
                >
                  {link.name}
                </Link>
              ))}
            {user?.role === "recruiter" &&
              recruiterLinks.map((link) => (
                <Link
                  key={link.id}
                  to={link.link}
                  className="block px-4 py-3 text-white "
                  onClick={toggleMenu}
                >
                  {link.name}
                </Link>
              ))}

         

            {!user && !isLoginOrSignupPage && (
              <Link
                to="/login"
                className="block text-center bg-gray-800 hover:bg-gray-700 text-white py-3"
                onClick={toggleMenu}
              >
                Login
              </Link>
            )}
            {user && (
              <>
                <Link
                  to="/user-profile"
                  className="block px-4 py-3 text-white "
                  onClick={toggleMenu}
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    toggleMenu();
                  }}
                  className="block w-full text-left px-4 py-3 text-white "
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar