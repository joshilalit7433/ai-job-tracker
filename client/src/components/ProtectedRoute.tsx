import { ReactNode, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { RootState } from "../redux/store"; // adjust path if needed

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute = ({
  children,
  allowedRoles = [],
}: ProtectedRouteProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state: RootState) => state.auth.user);
  const [isAllowed, setIsAllowed] = useState(false);

  useEffect(() => {
    const justLoggedOut = localStorage.getItem("justLoggedOut");

    const checkAccess = () => {
      if (!user) {
        if (!justLoggedOut) {
          toast.error("You are not allowed to access this page", {
            position: "bottom-right",
          });
        } else {
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
    };

    const timeout = setTimeout(checkAccess, 300); 

    return () => clearTimeout(timeout);
  }, [user, allowedRoles, navigate]);

  return isAllowed ? <>{children}</> : null;
};

export default ProtectedRoute;
