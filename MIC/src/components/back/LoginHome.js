import React, { useContext } from "react";
import { Redirect } from "react-router-dom";
import { Button } from "@material-ui/core"

import fire from "../fire";
import firebase from "firebase/firebase"

import Context from "../../context/loginContext";

//this is just a testing page

function LoginHome() {
 
  //Don't know if it is safe to store this in local storage
  //Can be accessed by anyone with console commands, maybe other ways
  //need a more secure login method.
  if(false){
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
    // var data = Object.entries(require("../../random/mathiscoolweb-web-export.json")).map((e) => ( { [e[0]]: e[1] } ));
    // data.forEach((doc) => {
    //   fire.firestore().collection('web').doc(Object.keys(doc)[0]).set(doc).then((ref) => {
    //     console.log("This is ref", ref);
    //   }).catch((e) => {
    //     console.log("Error: ", e);
    //   })
    //   //console.log(Object.keys(doc)[0])
    // })
    
    // fire.firestore().collection('web').onSnapshot((snapshot) => {
    //   const data = snapshot.docs.map((doc) => ({
    //     ...doc.data(),
    //   }));
    //   console.log(data[3].history.value);
    // })
    
    // fire.firestore().collection('users').onSnapshot((snapshot) => {
    //   const data = snapshot.docs.map((doc) => ({
    //     ...doc.data(),
    //   }));
    //   console.log("This is the data", data);
    // })
    console.log( fire.auth().currentUser )
    //fire.auth().signOut();
    console.log( fire.auth().currentUser )

  }
  
  return (
    <div>
      <Button onClick={onClick}>Press Me</Button>
    </div>
  );
}

export default LoginHome;
