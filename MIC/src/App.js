import React, { useContext } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

//Different components for front-end website
import HeadBar from "./components/front/Navbar";
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
import LoginHome from "./components/back/LoginHome";

//need to make context for authorization of login

function App() {
  return (
    <Router>
        <HeadBar></HeadBar>
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
        </Switch>
        <Switch>
          <Route path="/home" exact component={LoginHome}/>
        </Switch>
    </Router>
  );
}

export default App;
