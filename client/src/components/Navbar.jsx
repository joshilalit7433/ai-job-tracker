import { useState, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  ChevronDown,
  User,
  Bell,
  LogOut,
  Briefcase,
} from "lucide-react";
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
  const isLoginOrSignup = ["/login", "/signup"].includes(location.pathname);
  const isRecruiter = user?.role === "recruiter";

  const links = useMemo(() => {
    if (user?.role === "admin")
      return [
        { id: 1, name: "Dashboard", link: "/admin-dashboard", icon: Briefcase },
      ];
    if (user?.role === "user")
      return [
        {
          id: 1,
          name: "Job Applications",
          link: "/job-applications",
          icon: Briefcase,
        },
        {
          id: 2,
          name: "Saved Jobs",
          link: "/user-saved-job-application",
          icon: Bell,
        },
      ];
    return [
      {
        id: 1,
        name: "Job Applications",
        link: "/job-applications",
        icon: Briefcase,
      },
    ];
  }, [user]);

  const handleLogout = () => {
    localStorage.setItem("justLoggedOut", "true"); 
    dispatch(logout());
    navigate("/");
    toast.success("You have successfully Logged Out.", {
      position: "bottom-right",
      autoClose: 3000,
      theme: "dark",
    });
  };

  const renderLinks = () =>
    links.map(({ id, name, link, icon: Icon }) => (
      <Link
        key={id}
        to={link}
        onClick={() => setIsMenuOpen(false)}
        className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:text-purple-600 rounded-lg hover:bg-white transition"
      >
        <Icon size={20} />
        <span className="font-medium">{name}</span>
      </Link>
    ));

  return (
    <nav className="bg-[#f7e9d6] fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 lg:px-16 py-4 flex justify-between items-center">
        <Link
          to={
            isRecruiter
              ? "/recruiter-dashboard"
              : user?.role === "admin"
              ? "/admin-dashboard"
              : "/"
          }
          className={`font-bold flex items-center space-x-1 ${
            isRecruiter ? "text-lg lg:text-xl" : "text-xl"
          }`}
        >
          <span className="text-purple-700 text-2xl">●</span>
          <span className="text-[#5e2b14]">Target</span>
          <span className="text-orange-600">Aims</span>
        </Link>

        {/* Center links */}
        {!isLoginOrSignup && !isRecruiter && (
          <div className="hidden lg:flex space-x-6 text-sm font-medium text-[#131D4F]">
            {(user
              ? links
              : [{ id: 0, name: "Job Applications", link: "/job-applications" }]
            ).map(({ id, name, link }) => (
              <Link key={id} to={link} className="hover:underline">
                {name}
              </Link>
            ))}
          </div>
        )}

        {/* Right profile/login */}
        {!isRecruiter && (
          <div className="hidden lg:flex items-center space-x-3">
            {!user ? (
              !isLoginOrSignup && (
                <Link
                  to="/login"
                  className="bg-[#0a0a23] text-white text-sm px-4 py-2 rounded-md font-semibold hover:bg-black"
                >
                  Login
                </Link>
              )
            ) : (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center space-x-2"
                  >
                    <div className="w-9 h-9 bg-white text-[#131D4F] rounded-full flex justify-center items-center font-semibold">
                      {user.fullname?.charAt(0)}
                    </div>
                    <span className="hidden md:block text-sm font-medium">
                      {user.fullname?.split(" ")[0]}
                    </span>
                    <ChevronDown className="w-4 h-4" />
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
        )}

        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="lg:hidden text-[#131D4F]"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute left-0 top-0 w-80 h-full bg-[#f7e9d6] shadow-xl p-6">
            <div className="flex justify-between mb-8">
              <Link
                to={
                  user?.role === "admin"
                    ? "/admin-dashboard"
                    : isRecruiter
                    ? "/recruiter-dashboard"
                    : "/"
                }
                onClick={() => setIsMenuOpen(false)}
                className="font-bold flex items-center space-x-1 text-xl"
              >
                <span className="text-purple-700 text-2xl">●</span>
                <span className="text-[#5e2b14]">Target</span>
                <span className="text-orange-600">Aims</span>
              </Link>
              <button onClick={() => setIsMenuOpen(false)}>
                <X size={24} className="text-gray-500 hover:text-gray-700" />
              </button>
            </div>

            {user && (
              <div className="bg-white rounded-lg p-4 mb-6 shadow-sm">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center font-semibold text-lg">
                    {user.fullname?.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">{user.fullname}</h3>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                </div>
                <div className="mt-3">
                  <span className="inline-block bg-gray-100 text-xs text-gray-700 px-2 py-1 rounded-full">
                    {user.role === "admin"
                      ? "Admin Account"
                      : isRecruiter
                      ? "Recruiter Account"
                      : "User Account"}
                  </span>
                </div>
              </div>
            )}

            <div className="space-y-2">
              {renderLinks()}
              {user && (
                <Link
                  to="/user-profile"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:text-purple-600 rounded-lg hover:bg-white transition"
                >
                  <User size={20} />
                  <span className="font-medium">Profile</span>
                </Link>
              )}
              {!user && !isLoginOrSignup && (
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:text-purple-600 rounded-lg hover:bg-white transition"
                >
                  <User size={20} />
                  <span className="font-medium">Login</span>
                </Link>
              )}
              {user && (
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:text-red-600 rounded-lg hover:bg-white transition w-full text-left"
                >
                  <LogOut size={20} />
                  <span className="font-medium">Logout</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
