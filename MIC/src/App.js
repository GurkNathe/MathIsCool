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

//Used to get pre-login web page html/data
async function getWeb(){

  //checks whether or not a read to the database is necessary
  //only if load isn't in local storage or local storage is empty
  //**MIGHT NEED TO TWEAK THIS SINCE I CAN SEE SOMEONE ABUSING THIS RUNNING UP CHARGES FOR READS TO DATABASE**//
  if(localStorage.getItem("load") === null || localStorage.length === 0){
    localStorage.setItem("load", true)
  } 

  //checks if load variable in local storage is true, meaning database can be pulled
  else if(localStorage.getItem("load") === "true"){
    //getting the 'web' collection from firestore
    const web = await fire.firestore().collection('web').get();

    //checking to make sure it actually got data
    if(web.empty){
      console.log(web);
      return;
    }

    //adding web page html/data to local storage
    web.forEach(doc => {
      localStorage.setItem(Object.keys(doc.data()), JSON.stringify(doc.data()));
    })
    
    //Adding non-compromising information to local storage for using in other components
    localStorage.setItem("username", fire.auth().currentUser.displayName)
    localStorage.setItem("email", fire.auth().currentUser.email)

    //makes it so the database won't be read for web page material again during the session
    localStorage.setItem("load", false)
  }
}

function App() {

  //used to store non-restriced webpage data in local storage on first load
  useEffect(() => {
    getWeb();
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
