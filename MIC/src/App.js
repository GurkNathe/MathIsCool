import React, { useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

// Different components for front-end website
import Competitions from "./components/front/Competitions";
import Contacts from "./components/front/Contacts";
import FAQ from "./components/front/FAQ";
import Fees from "./components/front/Fees";
import History from "./components/front/History";
import Home from "./components/front/Home";
import Locations from "./components/front/Locations";
import PastTests from "./components/front/PastTests";
import Rules from "./components/front/Rules";

// Components that handle profile stuff
import ForgotPass from "./components/profile/ForgotPass";
import ProfilePage from "./components/profile/ProfilePage";
import SignIn from "./components/profile/SignIn";
import SignUp from "./components/profile/SignUp";

// Different components for logged-in website
import Names from "./components/back/Names";
import ProtectedRoute from "./components/navigation/ProtectedRoute";
import SideBar from "./components/navigation/SideBar";
import TeamRegister from "./components/back/TeamRegister";
import { NotFound } from "./components/styledComps";
import BadSubmit from "./components/back/BadSubmit";

// Admin/Editor pages
import AddAdmin from "./components/admin/AddAdmin";
import AddInfo from "./components/admin/AddInfo";
import AdminRoute from "./components/navigation/AdminRoute";
import ImportContent from "./components/admin/ImportContent";
import ManageCompetitions from "./components/admin/ManageCompetitions";
import ManageFAQ from "./components/admin/ManageFAQ";
import ManageHome from "./components/admin/ManageHome";
import ManagePastTests from "./components/admin/ManagePastTests";
import ManageSites from "./components/admin/ManageSites";
import MarkMasters from "./components/admin/MarkMasters";
import MastersTeams from "./components/custom/MastersTeams";
import ViewNames from "./components/admin/ViewNames";

// Test page for developers to mess around with
import Test from "./components/admin/Test";

import { doc, getDoc } from "@firebase/firestore";
import { updateProfile } from "@firebase/auth";
import { db, auth } from "./components/fire";

import getOptions from "./components/getOptions";

export default function App() {
	// Used to get basic user information
	const getUser = async () => {
		if (
			!(sessionStorage.getItem("username") || sessionStorage.getItem("email"))
		) {
			// Adding non-compromising information to session storage for using in other components
			const user = await auth.currentUser;
			if (user !== undefined && user !== null) {
				sessionStorage.setItem("username", user.displayName);
				sessionStorage.setItem("email", user.email);
			}

			// Checking if user is a new admin
			if (!Number(sessionStorage.getItem("checked"))) {
				if (user !== null) {
					if (!user.photoURL || !JSON.parse(user.photoURL).admin) {
						const admins = doc(db, "roles", "admin");
						await getDoc(admins).then((doc) => {
							if (doc.data().admins.includes(user.uid)) {
								updateProfile(user, {
									photoURL: JSON.stringify({
										...JSON.parse(user.photoURL),
										admin: user.uid,
									}),
								}).catch((error) => {
									console.error(error);
								});
							}
						});
					}
				}
				sessionStorage.setItem("checked", 1);
			}
		}
	};

	// Used to get non-compromising user information
	useEffect(() => {
		getUser();

		// Loads options if not already loaded
		if (sessionStorage.getItem("options") === null) {
			getOptions();
		}
	}, []);

	return (
		<LocalizationProvider dateAdapter={AdapterDateFns}>
			<div id="app">
				<Router basename="/">
					<SideBar />
					<Switch>
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
							path="/team-register/bad-submit/"
							exact
							component={BadSubmit}
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
							path="/admin/manage-comps/view-names"
							exact
							component={ViewNames}
						/>
						<AdminRoute
							path="/admin/manage-home"
							exact
							component={ManageHome}
						/>
						<AdminRoute path="/admin/manage-faq" exact component={ManageFAQ} />
						<AdminRoute
							path="/admin/manage-pasttests"
							exact
							component={ManagePastTests}
						/>
						<AdminRoute
							path="/admin/manage-sites"
							exact
							component={ManageSites}
						/>
						<AdminRoute path="/admin/add-info" exact component={AddInfo} />
						<AdminRoute path="/admin/test" exact component={Test} />
						<Route component={NotFound} />
					</Switch>
				</Router>
			</div>
		</LocalizationProvider>
	);
}
