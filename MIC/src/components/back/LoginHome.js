import React, { useContext } from "react";
import { Redirect } from "react-router-dom";

import fire from "../fire";

import Context from "../../context/loginContext";

//this is just a placeholder

function LoginHome() {
  //const {state, actions} = useContext(Context);
  /*if(!state.authorized){
    return <Redirect to="/login" />;
  }*/

  //Don't know if it is safe to store this in local storage
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
