import React, { useContext } from "react";
import { Redirect } from "react-router-dom";

import Context from "../../context/loginContext";

//this is just a placeholder

function LoginHome() {
  const {state, actions} = useContext(Context);

  if(!state.authorized){
    return <Redirect to="/login" />;
  }

  return (
    <div className="LoginHome">
      <h1>LoginHome</h1>
    </div>
  );
}

export default LoginHome;
