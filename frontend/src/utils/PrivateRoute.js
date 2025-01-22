import React from "react";
import AuthAlert from "../components/AuthAlert/AuthAlert";

function PrivateRoute({ children }) {
  const isLoggedIn = !!localStorage.getItem("token"); // Check login state
  return isLoggedIn ? children : <AuthAlert/>;
}

export default PrivateRoute;
