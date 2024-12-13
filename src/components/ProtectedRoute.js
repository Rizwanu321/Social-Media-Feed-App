import React, { useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const hasShownToast = useRef(false);

  useEffect(() => {
    if (!user) {
      if (!hasShownToast.current) {
        toast.warning("Please log in to access this page.");
        hasShownToast.current = true;
      }
      navigate("/login");
    } else {
      hasShownToast.current = false;
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  return children;
};

export default ProtectedRoute;
