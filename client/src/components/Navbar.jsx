import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
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

const Navbar = () => {
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isLoginOrSignupPage =
    location.pathname === "/login" || location.pathname === "/signup";

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
    toast.success("You have successfully Logged Out.", {
      position: "bottom-right",
      autoClose: 3000,
      theme: "dark",
    });
  };

  const userLinks = [
    { id: 1, name: "Home", link: "/" },
    { id: 2, name: "Job Applications", link: "/job-applications" },
    ...(user?.role === "user"
      ? [{ id: 3, name: "Saved Jobs", link: "/user-saved-job-application" }]
      : []),
  ];

  const adminLinks = [
    { id: 1, name: "Home", link: "/" },
    { id: 2, name: "Dashboard", link: "/admin-dashboard" },
  ];

  const shouldShowNavbarLinks =
    user?.role !== "recruiter" && !isLoginOrSignupPage;

  return (
    <nav className="bg-[#f7e9d6] fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 lg:px-16 py-4 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold flex items-center space-x-1">
          <span className="text-purple-700 text-2xl">●</span>
          <span className="text-[#5e2b14]">Target</span>
          <span className="text-orange-600">Aims</span>
        </Link>

        {/* Center nav links */}
        {shouldShowNavbarLinks && (
          <div className="hidden sm:flex space-x-6 text-sm font-medium text-[#131D4F]">
            {(user?.role === "admin" ? adminLinks : userLinks).map((link) => (
              <Link key={link.id} to={link.link} className="hover:underline">
                {link.name}
              </Link>
            ))}
          </div>
        )}

        {/* Right-side profile/login */}
        <div className="hidden sm:flex space-x-3 items-center">
          {!user ? (
            !isLoginOrSignupPage && (
              <Link
                to="/login"
                className="bg-[#0a0a23] hover:bg-black text-white text-sm px-4 py-2 rounded-md font-semibold"
              >
                Login
              </Link>
            )
          ) : (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2">
                  <div className="w-9 h-9 bg-white text-[#131D4F] rounded-full flex items-center justify-center font-semibold">
                    {user?.fullname?.charAt(0) || "U"}
                  </div>
                  <span className="hidden md:block text-sm text-[#131D4F] font-medium">
                    {user?.fullname?.split(" ")[0]}
                  </span>
                  <ChevronDown className="w-4 h-4 text-[#131D4F]" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-40 p-2 bg-white rounded-md shadow-lg">
                <Link
                  to="/user-profile"
                  className="block px-4 py-2 text-sm hover:bg-gray-100 rounded"
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 rounded"
                >
                  Logout
                </button>
              </PopoverContent>
            </Popover>
          )}
        </div>

        {/* Mobile menu icon */}
        <div className="sm:hidden">
          <button
            onClick={toggleMenu}
            className="text-[#131D4F] focus:outline-none"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && shouldShowNavbarLinks && (
        <div className="sm:hidden px-4 pb-4 space-y-2">
          {(user?.role === "admin" ? adminLinks : userLinks).map((link) => (
            <Link
              key={link.id}
              to={link.link}
              className="block text-sm text-[#131D4F] font-medium"
              onClick={toggleMenu}
            >
              {link.name}
            </Link>
          ))}

          {!user && (
            <Link
              to="/login"
              className="block text-sm font-medium text-white bg-[#0a0a23] px-4 py-2 rounded-md mt-2 text-center"
              onClick={toggleMenu}
            >
              Login
            </Link>
          )}

          {user && (
            <>
              <Link
                to="/user-profile"
                className="block text-sm text-[#131D4F] font-medium"
                onClick={toggleMenu}
              >
                Profile
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  toggleMenu();
                }}
                className="block text-left w-full text-sm text-[#131D4F] font-medium"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
