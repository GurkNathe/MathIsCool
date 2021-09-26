import React, { useEffect, useState } from "react";
import { Route, Redirect } from "react-router-dom";
import ReactLoading from "react-loading";
import fire from "../fire";

export default function PrivateRoute(props) {
  const [user, setUser] = useState(1);
  const [loading, setLoading] = useState(true);

  if(user === 1){
    fire.auth().onAuthStateChanged((use) => {
      setUser(use);
    })
  }
  
  useEffect(() => {
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
            <Route component={props.component} exact path={props.path}/> :
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
