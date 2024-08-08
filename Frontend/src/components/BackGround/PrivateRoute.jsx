import React from "react";
import { Route, Navigate } from "react-router-dom";
import Cookies from "js-cookie";

const PrivateRoute = ({ element: Element, ...rest }) => {
  const accessToken = Cookies.get("access-token");
  return (
    <Route
      {...rest}
      element={accessToken ? <Element /> : <Navigate to="/" />}
    />
  );
};

export default PrivateRoute;
