import { ReactNode, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { RootState } from "../redux/store";
import { clearJustLoggedOut } from "../redux/authSlice";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute = ({
  children,
  allowedRoles = [],
}: ProtectedRouteProps) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const justLoggedOut = useSelector(
    (state: RootState) => state.auth.justLoggedOut
  );
  const [isAllowed, setIsAllowed] = useState(false);

  useEffect(() => {
    const checkAccess = () => {
      if (!user) {
        if (!justLoggedOut) {
          toast.error("You are not allowed to access this page", {
            position: "bottom-right",
          });
        } else {
          dispatch(clearJustLoggedOut());
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
  }, [user, justLoggedOut, allowedRoles, navigate, dispatch]);

  return isAllowed ? <>{children}</> : null;
};

export default ProtectedRoute;
