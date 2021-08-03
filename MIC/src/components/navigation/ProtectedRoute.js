import React, { useEffect, useState } from "react";
import { Route, Redirect } from "react-router-dom";
import ReactLoading from "react-loading";
import fire from "../fire";

function PrivateRoute(props) {
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
          <Route component={props.component} exact path={props.path}/> :
          <Redirect to="/login"/>
      }
    </>
  );
}

export default PrivateRoute;