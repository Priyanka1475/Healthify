import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setUser } from "../redux/userSlice";
import { showLoading, hideLoading } from "../redux/alertsSlice";

function ProtectedRoute(props) {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true); // Local state for loading

  // Function to fetch user info
  const getUser = async () => {
    try {
      dispatch(showLoading());
  
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }
  
      const response = await axios.post(
        "/api/user/get-user-info-by-id",
        {}, // No request body needed
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      dispatch(hideLoading());
  
      if (response.data.success) {
        dispatch(setUser(response.data.data));
        setLoading(false); // Set loading to false when user data is fetched
      } else {
        localStorage.clear();
        navigate("/login");
      }
    } catch (error) {
      dispatch(hideLoading());
      localStorage.clear();
      navigate("/login");
    }
  };
  

  // Check user state and fetch user info if needed
  useEffect(() => {
    if (!user && localStorage.getItem("token")) {
      getUser();
    } else {
      setLoading(false); // Set loading to false if user is already present
    }
  }, [user, navigate, dispatch]);

  // Show a loading indicator while checking
  if (loading) {
    return <div>Loading...</div>;
  }

  // Render children if user is authenticated or token is present
  if (user || localStorage.getItem("token")) {
    return props.children;
  } else {
    return <Navigate to="/login" />;
  }
}

export default ProtectedRoute;
