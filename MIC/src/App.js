import React, { useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

//Different components for front-end website
import Competitions from "./components/front/Competitions";
import Home from "./components/front/Home";
import PastTests from "./components/front/PastTests";
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
import ImportContent from "./components/admin/ImportContent";
import AdminRoute from "./components/navigation/AdminRoute";
import AddAdmin from "./components/admin/AddAdmin";
import MarkMasters from "./components/admin/MarkMasters";
import MastersTeams from "./components/custom/MastersTeams";
import ManageCompetitions from "./components/admin/ManageCompetitions";

import Test from "./components/admin/Test";

import fire from "./components/fire";

//Used to get pre-login web page html/data
async function getUser(){
  if(!(sessionStorage.getItem("username") || sessionStorage.getItem("email"))){
    //Adding non-compromising information to local storage for using in other components
    const user = await fire.auth().currentUser;
    if(user !== undefined && user !== null){
      sessionStorage.setItem("username", user.displayName)
      sessionStorage.setItem("email", user.email)
    }
  }

  if(!Number(sessionStorage.getItem("checked"))){
    if(fire.auth().currentUser !== null){
      const user = fire.auth().currentUser;
      if(!user.photoURL){
        const admins = fire.firestore().collection("roles").doc("admin");
        const admin = admins.get().then((doc) => {
          if(doc.data().admins.includes(user.uid)){
            fire.auth().onAuthStateChanged((user) => {
              if(user){
                user.updateProfile({
                  photoURL: user.uid
                }).then(() => {
                }).catch((error) => {
                  console.log(error)
                });
              }
            });
          }
        })
        return admin;
      }
      sessionStorage.setItem("checked", 1);
    }
  }
}

function App() {

  //used to get non-compromising user information
  useEffect(() => {
    getUser();
  }, [])

  return (
    <div id="app">
      <Router basename="/">
          <SideBar/>
          <Switch>
            <Route path="/test" exact component={Test}/>
            <Route path="/" exact render={(props) => <Home {...props}/>}/>
            <Route path="/about/history" component={History}/>
            <Route path="/about/contacts" component={Contacts}/>
            <Route path="/about/locations" component={Locations}/>
            <Route path="/information/rules" component={Rules}/>
            <Route path="/information/fees" component={Fees}/>
            <Route path="/information/faq" component={FAQ}/>
            <Route path="/information/past-tests" component={PastTests}/>
            <Route path="/competitions" component={Competitions}/>
            <Route path="/login" exact component={SignIn}/>
            <Route path="/login/signup" component={SignUp}/>
            <Route path="/profile" component={ProfilePage}/>
            <Route path="/login/forgot-password" component={ForgotPass}/>
          </Switch>
          <Switch>
            <ProtectedRoute path="/team-register" exact component={TeamRegister}/>
            <ProtectedRoute path="/team-register/confirm/" component={Form}/>
            <ProtectedRoute path="/enter-names" component={Names}/>
          </Switch>
          <Switch>
            <AdminRoute path="/admin/import-content" component={ImportContent}/>
            <AdminRoute path="/admin/add-admin" component={AddAdmin}/>
            <AdminRoute path="/admin/mark-masters" exact component={MarkMasters}/>
            <AdminRoute path="/admin/mark-masters/teams" component={MastersTeams}/>
            <AdminRoute path="/admin/manage-comps" component={ManageCompetitions}/>
          </Switch>
      </Router>
    </div>
  );
}

export default App;
