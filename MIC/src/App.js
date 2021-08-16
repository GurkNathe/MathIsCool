import React, { useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

//Different components for front-end website
import SignUp from "./components/front/SignUp";
import Competitions from "./components/front/Competitions";
import Home from "./components/front/Home";
import SignIn from "./components/front/SignIn";
import PastTests from "./components/front/PastTests";
import History from "./components/front/History";
import Contacts from "./components/front/Contacts";
import Locations from "./components/front/Locations";
import Rules from "./components/front/Rules";
import Fees from "./components/front/Fees";
import FAQ from "./components/front/FAQ";
import ProfilePage from "./components/front/ProfilePage";
import ForgotPass from "./components/front/ForgotPass";

//Different components for logged-in website
import SideBar from "./components/navigation/SideBar";
import LoginHome from "./components/back/LoginHome";
import TeamRegister from "./components/back/TeamRegister";
import Individual from "./components/back/Individual";
import ProtectedRoute from "./components/navigation/ProtectedRoute";
import Form from "./components/random/Form";
import Masters from "./components/back/Masters";

import fire from "./components/fire";

function App() {

  //used to store non-restriced webpage data on local on first load
  useEffect(() => {
    if(localStorage.getItem("load") === null || localStorage.length === 0){
      localStorage.setItem("load", true)
    }
    if(localStorage.getItem("load") === "true"){
      fire.firestore().collection('web').get()
        .then(querySnapshot => {
          querySnapshot.docs.forEach(doc => {
            localStorage.setItem(Object.keys(doc.data()), JSON.stringify(doc.data()));
          })
        })
        .catch((error) => {
          console.log(error);
        })
      setTimeout(() => {
          console.log("DID")
          let name = fire.auth().currentUser.displayName;
          let email = fire.auth().currentUser.email
          localStorage.setItem("username", name)
          localStorage.setItem("email", email)
        }, 1000)
      localStorage.setItem("load", false)
    }
  }, [])

  

  return (
    <div style={{overflowX:"hidden"}} id="app">
      <Router>
          <SideBar/>
          <Switch>
            <Route path="/" exact component={Home}/>
            <Route path="/about/history" exact component={History}/>
            <Route path="/about/contacts" exact component={Contacts}/>
            <Route path="/about/locations" exact component={Locations}/>
            <Route path="/information/rules" exact component={Rules}/>
            <Route path="/resources/rules" exact component={Rules}/>
            <Route path="/information/fees" exact component={Fees}/>
            <Route path="/information/faq" exact component={FAQ}/>
            <Route path="/information/past-tests" exact component={PastTests}/>
            <Route path="/competitions" exact component={Competitions}/>
            <Route path="/login" exact component={SignIn}/>
            <Route path="/login/signup" exact component={SignUp}/>
            <Route path="/profile" exact component={ProfilePage}/>
            <Route path="/login/forgot-password" exact component={ForgotPass}/>
            <ProtectedRoute path="/home" exact component={LoginHome}/>
            <ProtectedRoute path="/team-register" exact component={TeamRegister}/>
            <ProtectedRoute path="/individual" exact component={Individual}/>
            <ProtectedRoute path="/team-register/confirm/" exact component={Form}/>
            <ProtectedRoute path="/masters-register" exact component={Masters}/>
          </Switch>
      </Router>
    </div>
  );
}

export default App;
