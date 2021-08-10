import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

//Different components for front-end website
import SignUp from "./components/front/SignUp";
import Competitions from "./components/front/Competitions";
import Home from "./components/front/Home";
import Login from "./components/front/Login";
import PastTests from "./components/front/PastTests";
import History from "./components/front/History";
import Contacts from "./components/front/Contacts";
import Locations from "./components/front/Locations";
import Rules from "./components/front/Rules";
import Fees from "./components/front/Fees";
import FAQ from "./components/front/FAQ";

//Different components for logged-in website
import SideBar from "./components/navigation/SideBar";
import LoginHome from "./components/back/LoginHome";
import TeamRegister from "./components/back/TeamRegister";
import Individual from "./components/back/Individual";
import ProtectedRoute from "./components/navigation/ProtectedRoute";
import Form from "./components/random/Form";

function App() {
  return (
    <div style={{overflowX:"hidden"}}>
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
            <Route path="/resources/past-tests" exact component={PastTests}/>
            <Route path="/competitions" exact component={Competitions}/>
            <Route path="/login" exact component={Login}/>
            <Route path="/login/signup" exact component={SignUp}/>
            <ProtectedRoute path="/home" exact component={LoginHome}/>
            <ProtectedRoute path="/team-register" exact component={TeamRegister}/>
            <ProtectedRoute path="/individual" exact component={Individual}/>
            <ProtectedRoute path="/team-register/confirm/" exact component={Form} />
          </Switch>
      </Router>
    </div>
  );
}

export default App;
