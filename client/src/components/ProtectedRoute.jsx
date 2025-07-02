import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.auth);

  useEffect(() => {
    if (!user || (allowedRoles.length > 0 && !allowedRoles.includes(user.role))) {
      toast.error("You are not allowed to access this page",{position:"bottom-right"});
      navigate("/");
    }
  }, [user, allowedRoles, navigate]);

  return <>{children}</>;
};

export default ProtectedRoute;
