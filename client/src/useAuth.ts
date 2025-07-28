import { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUser, logout } from "./redux/authSlice";
import { USER_API_END_POINT } from "./utils/constant";



const useAuth = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      dispatch(logout());
      return;
    }

    axios.get(`${USER_API_END_POINT}/getuser`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((res) => {
      dispatch(setUser(res.data.user)); // set user in redux
    })
    .catch(() => {
      localStorage.removeItem("token");
      dispatch(logout());
    });
  }, []);
};

export default useAuth;
