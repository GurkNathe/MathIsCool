import React, { useState } from "react";
import { Button, Container, Typography, TextField, Grid } from "@mui/material";
import { Paper, ProfileAvatar } from "../styledComps";

import SignIn from "./SignIn";

import { auth } from "../fire";
import {
	signOut,
	updateProfile,
	updateEmail,
	sendEmailVerification,
	onAuthStateChanged,
} from "@firebase/auth";

export default function ProfilePage() {
	const [changed, setChanged] = useState(false);
	const [userInfo, setUserInfo] = useState({
		username: sessionStorage.getItem("username"),
		email: sessionStorage.getItem("email"),
		school: sessionStorage.getItem("school"),
	});

	// Saves user information to auth database and
	const saveChanges = () => {
		sessionStorage.setItem("username", userInfo.username);
		sessionStorage.setItem("email", userInfo.email);
		sessionStorage.setItem("school", userInfo.school);
		setChanged(false);

		onAuthStateChanged(auth, (user) => {
			if (user) {
				updateProfile(user, {
					displayName: userInfo.username,
				});
				updateEmail(user, userInfo.email);
				// verify email
				if (userInfo.email !== user.email) {
					sendEmailVerification(user).then(() => {
						console.log("Email sent");
					});
				}
			}
		});
	};

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
										id="outlined-basic"
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
										id="outlined-basic"
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
									<TextField
										id="outlined-basic"
										variant="outlined"
										placeholder={userInfo.school}
										value={userInfo.school}
										onChange={(e) => {
											setChanged(true);
											setUserInfo({
												...userInfo,
												school: e.target.value,
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
						<Button
							onClick={() => {
								signOut(auth)
									.then((user) => {
										window.location.reload();
									})
									.catch((error) => {
										console.error(error);
									});
								sessionStorage.removeItem("username");
								sessionStorage.removeItem("email");
								sessionStorage.removeItem("school");
							}}>
							Logout
						</Button>
					</>
				) : null}
			</Paper>
		</Container>
	);
}
