import React from "react";
import { Navigate } from "react-router-dom";

function PrivateRoute({ children }) {
  const isLoggedIn = !!localStorage.getItem("token"); // Check login state
  return isLoggedIn ? children : <Navigate to="/" />;
}

export default PrivateRoute;
