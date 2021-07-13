import React, { useContext } from "react";
import { Redirect } from "react-router-dom";

import fire from "../fire";

import Context from "../../context/loginContext";

//this is just a placeholder

function LoginHome() {

  //Don't know if it is safe to store this in local storage
  //Can be accessed by anyone with console commands, maybe other ways
  //need a more secure login method.
  if(!localStorage.getItem("authorized")){
    return <Redirect to="/login" />;
  }

  return (
    <div>
      <h1>LoginHome</h1>
    </div>
  );
}

export default LoginHome;
