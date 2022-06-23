import React, { useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { LocalizationProvider } from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";

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
import { GoogleForm, NotFound } from "./components/styledComps";
import Names from "./components/back/Names";

//Admin/Editor pages
import ImportContent from "./components/admin/ImportContent";
import AdminRoute from "./components/navigation/AdminRoute";
import AddAdmin from "./components/admin/AddAdmin";
import MarkMasters from "./components/admin/MarkMasters";
import MastersTeams from "./components/custom/MastersTeams";
import ManageCompetitions from "./components/admin/ManageCompetitions";
import ManageHome from "./components/admin/ManageHome";

import Test from "./components/admin/Test";

//Firebase stuff
import { doc, getDoc } from "@firebase/firestore";
import { onAuthStateChanged } from "@firebase/auth";
import { db, auth } from "./components/fire";

// Used to get pre-login web page html/data
async function getUser() {
	if (
		!(sessionStorage.getItem("username") || sessionStorage.getItem("email"))
	) {
		//Adding non-compromising information to local storage for using in other components
		const user = await auth.currentUser;
		if (user !== undefined && user !== null) {
			sessionStorage.setItem("username", user.displayName);
			sessionStorage.setItem("email", user.email);
		}
	}

	if (!Number(sessionStorage.getItem("checked"))) {
		if (auth.currentUser !== null) {
			const user = auth.currentUser;
			if (!user.photoURL) {
				const admins = doc(db, "roles", "admin");
				const admin = await getDoc(admins).then((doc) => {
					if (doc.data().admins.includes(user.uid)) {
						onAuthStateChanged((user) => {
							if (user) {
								user
									.updateProfile({
										photoURL: user.uid,
									})
									.then(() => {})
									.catch((error) => {
										console.log(error);
									});
							}
						});
					}
				});
				return admin;
			}
			sessionStorage.setItem("checked", 1);
		}
	}
}

export default function App() {
	//used to get non-compromising user information
	useEffect(() => {
		getUser();
	}, []);

	return (
		<LocalizationProvider dateAdapter={AdapterDateFns}>
			<div id="app">
				<Router basename="/">
					<SideBar />
					<Switch>
						<Route path="/test" exact component={Test} />
						<Route path="/" exact render={(props) => <Home {...props} />} />
						<Route path="/about/history" exact component={History} />
						<Route path="/about/contacts" exact component={Contacts} />
						<Route path="/about/locations" exact component={Locations} />
						<Route path="/information/rules" exact component={Rules} />
						<Route path="/information/fees" exact component={Fees} />
						<Route path="/information/faq" exact component={FAQ} />
						<Route path="/information/past-tests" exact component={PastTests} />
						<Route path="/competitions" exact component={Competitions} />
						<Route path="/login" exact component={SignIn} />
						<Route path="/login/signup" exact component={SignUp} />
						<Route path="/profile" exact component={ProfilePage} />
						<Route path="/login/forgot-password" exact component={ForgotPass} />
						<ProtectedRoute
							path="/team-register"
							exact
							component={TeamRegister}
						/>
						<ProtectedRoute
							path="/team-register/confirm/"
							exact
							component={GoogleForm}
						/>
						<ProtectedRoute path="/enter-names" exact component={Names} />
						<AdminRoute
							path="/admin/import-content"
							exact
							component={ImportContent}
						/>
						<AdminRoute path="/admin/add-admin" exact component={AddAdmin} />
						<AdminRoute
							path="/admin/mark-masters"
							exact
							component={MarkMasters}
						/>
						<AdminRoute
							path="/admin/mark-masters/teams"
							exact
							component={MastersTeams}
						/>
						<AdminRoute
							path="/admin/manage-comps"
							exact
							component={ManageCompetitions}
						/>
						<AdminRoute
							path="/admin/manage-home"
							exact
							component={ManageHome}
						/>
						<Route component={NotFound} />
					</Switch>
				</Router>
			</div>
		</LocalizationProvider>
	);
}
