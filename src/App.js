import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

// React-Bootstrap Components
import "bootstrap/dist/css/bootstrap.min.css";

import HeadBar from "./Components/Navbar";
import About from "./Pages/About";
import Competitions from "./Pages/Competitions";
import Home from "./Pages/Home";
import Information from "./Pages/Information";
import Login from "./Pages/Login";
import Resources from "./Pages/Resources";

function App() {
  return (
    <Router>
        <HeadBar></HeadBar>
        <Switch>
          <Route path="/about" exact component={About}/>
          <Route path="/competitions" exact component={Competitions}/>
          <Route path="/" exact component={Home}/>
          <Route path="/information" exact component={Information}/>
          <Route path="/login" exact component={Login}/>
          <Route path="/resources" exact component={Resources}/>
        </Switch>
    </Router>
  );
}

export default App;
