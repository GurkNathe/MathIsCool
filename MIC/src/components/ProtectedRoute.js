import React, { Component } from "react";
import { Route, Redirect } from "react-router-dom";

function PrivateRoute({ component: Component, ...rest }) {
  return(
    <Route 
      {...rest} 
      render={(props) => {
        return(localStorage.getItem("id") ? (<Component {...props} />) : (<Redirect to={{pathname: "/login"}}/>));
      }}
    />
  );
}

export default PrivateRoute;