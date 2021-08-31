import React, { useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

//Different components for front-end website
import Competitions from "./components/front/Competitions";
import Home from "./components/front/Home";
// import PastTests from "./components/front/PastTests";
import History from "./components/front/History";
import Contacts from "./components/front/Contacts";
import Locations from "./components/front/Locations";
import Rules from "./components/front/Rules";
import Fees from "./components/front/Fees";
import FAQ from "./components/front/FAQ";

//Components that handle profile stuff
import ProfilePage from "./components/profile/ProfilePage";
import ForgotPass from "./components/profile/ForgotPass";
import SignUp from "./components/profile/SignUp";
import SignIn from "./components/profile/SignIn";

//Different components for logged-in website
import SideBar from "./components/navigation/SideBar";
import TeamRegister from "./components/back/TeamRegister";
import ProtectedRoute from "./components/navigation/ProtectedRoute";
import Form from "./components/custom/Form";
import Names from "./components/back/Names";

//Admin/Editor pages
import ImportContent from "./components/front/PastTests";

import fire from "./components/fire";

//Used to get pre-login web page html/data
async function getUser(){
  if(!(localStorage.getItem("username") || localStorage.getItem("email"))){
    //Adding non-compromising information to local storage for using in other components
    const user = await fire.auth().currentUser;
    if(user !== undefined && user !== null){
      localStorage.setItem("username", user.displayName)
      localStorage.setItem("email", user.email)
    }
  }
}

function App() {

  //used to get non-compromising user information
  useEffect(() => {
    getUser();
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
            <Route path="/information/past-tests" exact component={ImportContent}/>
            <Route path="/competitions" exact component={Competitions}/>
            <Route path="/login" exact component={SignIn}/>
            <Route path="/login/signup" exact component={SignUp}/>
            <Route path="/profile" exact component={ProfilePage}/>
            <Route path="/login/forgot-password" exact component={ForgotPass}/>
            <ProtectedRoute path="/team-register" exact component={TeamRegister}/>
            <ProtectedRoute path="/team-register/confirm/" exact component={Form}/>
            <ProtectedRoute path="/enter-names" exact component={Names}/>
          </Switch>
      </Router>
    </div>
  );
}

export default App;
