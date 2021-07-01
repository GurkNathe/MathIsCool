import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

//Different components for front-end website
import HeadBar from "./components/Navbar";
import SignUp from "./components/SignUp";
import Competitions from "./components/Competitions";
import Home from "./components/Home";
import Login from "./components/Login";
import PastTests from "./components/PastTests";
import History from "./components/History";
import Contacts from "./components/Contacts";
import Locations from "./components/Locations";
import Rules from "./components/Rules";
import Fees from "./components/Fees";
import FAQ from "./components/FAQ";


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
    </Router>
  );
}

export default App;
