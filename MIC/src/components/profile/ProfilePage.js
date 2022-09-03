import React, { useState } from "react";

import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { auth } from "../fire";
import {
	signOut,
	updateProfile,
	updateEmail,
	sendEmailVerification,
	onAuthStateChanged,
} from "@firebase/auth";

import SignIn from "./SignIn";
import { Paper, ProfileAvatar, Drop, Alerts } from "../styledComps";

export default function ProfilePage() {
	// Tells when a field has been changed
	const [changed, setChanged] = useState(false);

	const [options] = useState(JSON.parse(sessionStorage.getItem("options")));

	// Load user information into state
	const [userInfo, setUserInfo] = useState({
		username: sessionStorage.getItem("username"),
		email: sessionStorage.getItem("email"),
		school:
			sessionStorage.getItem("school") === undefined ||
			sessionStorage.getItem("school") === String(undefined)
				? "Not chosen"
				: sessionStorage.getItem("school"),
	});

	// Alerts for updating/managing profile
	const [alerts, setAlerts] = useState({
		saved: false,
		profile: false,
		email: false,
		verify: false,
		noEmail: false,
		other: false,
		signOut: false,
		sendVerify: false,
	});

	// Saves user information to auth database and
	const saveChanges = () => {
		// Save changes to session storage
		sessionStorage.setItem("username", userInfo.username);
		sessionStorage.setItem("email", userInfo.email);
		sessionStorage.setItem("school", userInfo.school);
		setChanged(false);

		// Updates user information
		onAuthStateChanged(auth, (user) => {
			if (user) {
				updateProfile(user, {
					displayName: userInfo.username,
					photoURL: JSON.stringify({
						...JSON.parse(user.photoURL),
						school: userInfo.school,
					}),
				})
					.then(() => {
						setAlerts((prev) => ({
							...prev,
							saved: true,
							profile: true,
						}));
					})
					.catch(() => {
						setAlerts((prev) => ({
							...prev,
							saved: true,
						}));
					});
				// Update email and send email verification if email changed
				if (userInfo.email !== user.email) {
					updateEmail(user, userInfo.email)
						.then(() => {
							setAlerts((prev) => ({
								...prev,
								saved: true,
								email: true,
							}));
						})
						.catch(() => {
							setAlerts((prev) => ({
								...prev,
								saved: true,
							}));
						});
					sendEmailVerification(user)
						.then(() => {
							setAlerts((prev) => ({
								...prev,
								saved: true,
								verify: true,
							}));
						})
						.catch(() => {
							setAlerts((prev) => ({
								...prev,
								saved: true,
							}));
						});
				} else {
					setAlerts((prev) => ({
						...prev,
						noEmail: true,
					}));
				}
			}
		});
	};

	// Used to cancel changes made to profile information
	const cancel = () => {
		setChanged(false);
		setUserInfo({
			username: sessionStorage.getItem("username"),
			email: sessionStorage.getItem("email"),
			school: sessionStorage.getItem("school"),
		});
	};

	return (
		<Container component="main">
			<Alerts
				open={alerts.saved || alerts.other}
				handleClose={() =>
					setAlerts({
						saved: false,
						profile: false,
						email: false,
						verify: false,
						noEmail: false,
						other: false,
						signOut: false,
						sendVerify: false,
					})
				}
				type={
					alerts.saved
						? alerts.profile
							? alerts.email
								? alerts.verify
									? "success"
									: "error"
								: alerts.noEmail
								? "success"
								: "error"
							: "error"
						: alerts.other
						? alerts.signOut
							? "error"
							: alerts.sendVerify
							? "success"
							: "error"
						: "error"
				}
				message={
					alerts.saved
						? alerts.profile
							? alerts.email
								? alerts.verify
									? alerts.noEmail
										? "Successfully updated profile."
										: "Successfully updated profile. Please confirm your new email."
									: "Failed to send email verification email."
								: alerts.noEmail
								? "Successfully updated profile."
								: "Failed to update email. Please try again."
							: "Failed to update profile. Please try again."
						: alerts.other
						? alerts.sendVerify
							? "An verification email was sent to your email address."
							: alerts.signOut
							? "There was an error upon signing out. Please sign out again."
							: "An unknown error occurred. Please try again."
						: alerts.sendVerify
						? "Failed to send email verification email. Please try again."
						: "An unknown error occurred."
				}
			/>
			<Paper>
				{userInfo.username !== null && userInfo.username !== undefined ? (
					<ProfileAvatar size="100px">
						{userInfo.username
							.match(/(\b\S)?/g)
							.join("")
							.toUpperCase()}
					</ProfileAvatar>
				) : (
					<SignIn />
				)}
				{userInfo.username !== null && userInfo.username !== undefined ? (
					<>
						<div
							style={{
								display: "flex",
								flexDirection: "column",
								width: "30%",
							}}>
							<Grid
								item
								justify="space-between"
								sx={{
									display: "flex",
									justifyContent: "center",
									alignItems: "center",
									marginBottom: "5px",
								}}>
								<Grid item xs={6}>
									<Typography variant="h6">Username:</Typography>
								</Grid>
								<Grid item xs={6}>
									<TextField
										style={{
											width: "15vw",
										}}
										variant="outlined"
										placeholder={userInfo.username}
										value={userInfo.username}
										onChange={(e) => {
											setChanged(true);
											setUserInfo({
												...userInfo,
												username: e.target.value,
											});
										}}
										onKeyPress={(event) => {
											if (event.key === "Enter") {
												saveChanges();
											}
										}}
									/>
								</Grid>
							</Grid>
							<Grid
								item
								justify="space-between"
								sx={{
									display: "flex",
									justifyContent: "center",
									alignItems: "center",
									marginBottom: "5px",
								}}>
								<Grid item xs={6}>
									<Typography variant="h6">Email:</Typography>
								</Grid>
								<Grid item xs={6}>
									<TextField
										style={{
											width: "15vw",
										}}
										variant="outlined"
										placeholder={userInfo.email}
										value={userInfo.email}
										onChange={(e) => {
											setChanged(true);
											setUserInfo({
												...userInfo,
												email: e.target.value,
											});
										}}
										onKeyPress={(event) => {
											if (event.key === "Enter") {
												saveChanges();
											}
										}}
									/>
								</Grid>
							</Grid>
							<Grid
								item
								justify="space-between"
								sx={{
									display: "flex",
									justifyContent: "center",
									alignItems: "center",
								}}>
								<Grid item xs={6}>
									<Typography variant="h6">School: </Typography>
								</Grid>
								<Grid item xs={6}>
									<Drop
										style={{
											display: "flex",
											flexDirection: "row",
											width: "15vw",
										}}
										options={options.school}
										value={userInfo.school}
										onChange={(e) => {
											setChanged(true);
											setUserInfo({
												...userInfo,
												school: e.target.textContent,
											});
										}}
									/>
								</Grid>
							</Grid>
						</div>
						{changed ? (
							<div
								style={{
									display: "flex",
									justifyContent: "center",
									alignItems: "center",
									marginTop: "10px",
								}}>
								<Button
									style={{
										marginRight: "10px",
									}}
									variant="outlined"
									color="primary"
									onClick={saveChanges}>
									Save Changes
								</Button>
								<></>
								<Button variant="outlined" color="error" onClick={cancel}>
									Cancel
								</Button>
							</div>
						) : null}
						<div>
							<Button
								onClick={() => {
									signOut(auth)
										.then(() => {
											sessionStorage.removeItem("username");
											sessionStorage.removeItem("email");
											sessionStorage.removeItem("school");
											window.location.reload();
										})
										.catch(() => {
											setAlerts((prev) => ({
												...prev,
												other: true,
												signOut: true,
											}));
										});
								}}>
								Logout
							</Button>
							{auth.currentUser !== null ? (
								!auth.currentUser.emailVerified ? (
									<Button
										onClick={() => {
											sendEmailVerification(auth.currentUser)
												.then(() => {
													setAlerts((prev) => ({
														...prev,
														other: true,
														sendVerify: true,
													}));
												})
												.catch(() => {
													setAlerts((prev) => ({
														...prev,
														sendVerify: true,
													}));
												});
										}}>
										Resend Email Confirmation
									</Button>
								) : null
							) : null}
						</div>
					</>
				) : null}
			</Paper>
		</Container>
	);
}
