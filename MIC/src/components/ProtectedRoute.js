import React from "react";
import { Route, Redirect } from "react-router-dom";
import fire from "./fire";

function PrivateRoute(props) {

  return(
    // { (fire.auth().currentUser.emailVerified) ?
    //   <Route 
    //     component={props.component}
    //     exact
    //     path={props.path}
    //   /> :
    //   <Redirect to="/login"/>
    // }
    <div/>
  );
}

export default PrivateRoute;