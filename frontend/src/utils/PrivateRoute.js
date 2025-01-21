import React from "react";
import { Navigate } from "react-router-dom";
import AuthAlert from "../components/AuthAlert/AuthAlert";

function PrivateRoute({ children }) {
  const isLoggedIn = !!localStorage.getItem("token"); // Check login state
  return isLoggedIn ? children : <AuthAlert/>;
}

export default PrivateRoute;
