import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

// React-Bootstrap Components
import "bootstrap/dist/css/bootstrap.min.css";

//Different components for front-end website
import HeadBar from "./Components/Navbar";
import SignUp from "./Components/SignUp";
import Competitions from "./Components/Competitions";
import Home from "./Components/Home";
import Login from "./Components/Login";
import PastTests from "./Components/PastTests";
import History from "./Components/History";
import Contacts from "./Components/Contacts";
import Locations from "./Components/Locations";
import Rules from "./Components/Rules";
import Fees from "./Components/Fees";
import FAQ from "./Components/FAQ";


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
