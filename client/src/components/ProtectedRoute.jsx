import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((store) => store.auth);
  const [isAllowed, setIsAllowed] = useState(false);

  useEffect(() => {
    const justLoggedOut = localStorage.getItem("justLoggedOut");

    if (!user) {
      //  suppress error toast if just logged out
      if (!justLoggedOut) {
        toast.error("You are not allowed to access this page", {
          position: "bottom-right",
        });
      } else {
        // cleanup flag
        localStorage.removeItem("justLoggedOut");
      }

      navigate("/", { replace: true });
    } else if (allowedRoles.length && !allowedRoles.includes(user.role)) {
      toast.error("You are not allowed to access this page", {
        position: "bottom-right",
      });
      navigate("/", { replace: true });
    } else {
      setIsAllowed(true);
    }
  }, [user, allowedRoles, navigate, location]);

  return isAllowed ? <>{children}</> : null;
};

export default ProtectedRoute;
