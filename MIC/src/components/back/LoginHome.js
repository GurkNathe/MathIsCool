import React from "react";
import { Redirect } from "react-router-dom";
import { Button } from "@material-ui/core"

import fire from "../fire";

// import Context from "../../context/loginContext";

//this is just a testing page

function LoginHome() {

  //Don't know if it is safe to store this in local storage
  //Can be accessed by anyone with console commands, maybe other ways
  //need a more secure login method.
  if(!localStorage.getItem("authorized")){
    return <Redirect to="/login" />;
  }

  const onClick = () => {
    //gets collection from database
    // const users = fire.firestore().collection('users');
    // users.onSnapshot((snapshot) => {
    //   const data = snapshot.docs.map((doc) => ({
    //     id: doc.id,
    //     ...doc.data(),
    //   }));
    //   console.log("This is data", data);
    // })

    //adds a document to the database
    // users.add({
    //   auth:false,
    //   email:"testy@test.com",
    //   password:"123456",
    //   admin:false
    // }).then((ref) => {
    //   console.log("This is ref", ref);
    // })

    // fire.firestore().collection('pages').doc('web').set(require("../../random/mathiscoolweb-web-export.json")).then((ref) => {
    //   console.log("This is ref", ref);
    // }).catch((e) => {
    //   console.log("Error: ", e);
    // })
    fire.firestore().collection('pages').onSnapshot((snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log("This is the data", data[0].history.past);
    })
  }

  return (
    <div>
      <Button onClick={onClick}>Press Me</Button>
    </div>
  );
}

export default LoginHome;
