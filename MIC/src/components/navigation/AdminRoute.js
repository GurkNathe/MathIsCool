import React, { useEffect, useState } from "react";
import { Route, Redirect } from "react-router-dom";
import ReactLoading from "react-loading";
import fire from "../fire";

export default function AdminRoute(props) {
  const [user, setUser] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {setUser(fire.auth().currentUser);}, 2000)
    if(user !== 1)
      setLoading(false);
  }, [user]);

  return(
    <>
      { loading ?
        <div style={{position:"fixed", top:"45%", left:"45%"}}>
          <ReactLoading type="spinningBubbles" color="#000" style={{width:"50px", height:"50px"}}/>
        </div> :
        user != null ?
          user.emailVerified ? 
            user.photoURL ? 
              <Route component={props.component} exact path={props.path}/>:
              <Redirect to={{
                pathname: '/',
                state: {
                  alert: true,
                  severity: "error",
                  message: "You are not an admin.",
                  duration: 3000
                }
              }}/>:
              <Redirect to={{
                pathname: '/',
                state: {
                  alert: true,
                  severity: "error",
                  message: "Please verify your email address.",
                  duration: 3000
                }
              }}/>:
              <Redirect to={{
                pathname: '/',
                state: {
                  alert: true,
                  severity: "error",
                  message: "Please sign in.",
                  duration: 3000
                }
              }}/>
      }
    </>
  );
}
