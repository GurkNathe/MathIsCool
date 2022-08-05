import React, { useState } from "react";
import {
	CssBaseline,
	TextField,
	Grid,
	Typography,
	Container,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useHistory, Link } from "react-router-dom";
import { Form, LockAvatar, Paper, Submit } from "../styledComps";
import {
	createUserWithEmailAndPassword,
	sendEmailVerification,
	onAuthStateChanged,
	updateProfile,
} from "@firebase/auth";
import { auth } from "../fire";

export default function SignUp() {
	const history = useHistory();
	// Holds the current state of the user sign up
	const [up, setUp] = useState({
		email: " ",
		username: " ",
		password: " ",
		confirm: " ",
		error: null,
	});

	/**
	 * Handles the value inputs for the page
	 * @param {object} event - The event that triggered the execution of the function
	 * @param {string} type  - What field to update
	 */
	const onChange = (event, type) => {
		switch (type) {
			case "email":
				setUp((prevState) => ({
					...prevState,
					email: event.target.value,
					error: null,
				}));
				break;
			case "password":
				setUp((prevState) => ({
					...prevState,
					password: event.target.value,
					error: null,
				}));
				break;
			case "confirm":
				setUp((prevState) => ({
					...prevState,
					confirm: event.target.value,
					error: null,
				}));
				break;
			case "username":
				setUp((prevState) => ({
					...prevState,
					username: event.target.value,
					error: null,
				}));
				break;
			default:
				console.log(up);
		}
	};

	const setError = (error) => {
		setUp((prevState) => ({
			...prevState,
			error: error,
		}));
	};

	// Will handle sending info to firebase and changing to logged in page
	const onSubmit = () => {
		// Checks if password and confirmation password are the same.
		if (up.password !== up.confirm) {
			setError(null);
			setError("NoMatch");
			return;
			// If a non-valid username was provided
		} else if (up.username.replace(/[^0-9a-z]/gi, "").length === 0) {
			setError(null);
			setError("NoUser");
			return;
		} else {
			//Sign's a person up using an email and password, and send email confirmation.
			createUserWithEmailAndPassword(auth, up.email, up.password)
				.then(() => {
					// Sends email verification
					sendEmailVerification(auth.currentUser);

					// Sets session variables for user information
					sessionStorage.setItem("email", up.email);
					sessionStorage.setItem("username", up.username);

					//Adds person's username
					onAuthStateChanged(auth, (user) => {
						if (user) {
							updateProfile(user, {
								displayName: up.username,
							})
								.then(() => {})
								.catch((error) => {
									setError(error.code);
								});
						}
					});

					// Email confirmation message
					let message =
						// eslint-disable-next-line no-multi-str
						"An email was sent to your email address. Please \
                        navigate to it and click the verification link. If \
                        you don't see an email, it could take up to a few \
                        minutes to be recieved. If the problem persists, \
                        there is a resend confirmation button in the profile \
                        page. If the problem continues, please contact an \
                        administrator for help.";

					// Routes to home page after a successful submission
					history.push({
						pathname: "/",
						state: {
							alert: true,
							severity: "info",
							message: message,
							duration: 20000,
						},
					});
				})
				.catch((error) => {
					if (up.error === null) setError(error.code);
				});
		}
	};

	return (
		<Container component="main" maxWidth="xs" style={{ marginBottom: "40px" }}>
			<CssBaseline />
			<Paper>
				<LockAvatar>
					<LockOutlinedIcon />
				</LockAvatar>
				<Typography component="h1" variant="h5">
					Sign up
				</Typography>
				<Form noValidate>
					<Grid container spacing={2}>
						<Grid item xs={12}>
							<TextField
								error={up.error === "NoUser"}
								variant="outlined"
								required
								fullWidth
								id="username"
								label="Username"
								name="username"
								helperText={
									up.error === "NoUser"
										? "Please enter a valid username."
										: null
								}
								autoFocus
								onChange={(event) => onChange(event, "username")}
							/>
						</Grid>

						<Grid item xs={12}>
							<TextField
								error={
									up.error === "auth/invalid-email" ||
									up.error === "auth/email-already-in-use"
								}
								variant="outlined"
								required
								fullWidth
								id="email"
								label="Email Address"
								name="email"
								autoComplete="email"
								helperText={
									up.error === "auth/invalid-email"
										? "Please enter a valid email address."
										: up.error === "auth/email-already-in-use"
										? "Email already taken."
										: null
								}
								onChange={(event) => onChange(event, "email")}
							/>
						</Grid>

						<Grid item xs={12}>
							<TextField
								error={
									up.error === "NoMatch" || up.error === "auth/weak-password"
								}
								variant="outlined"
								required
								fullWidth
								name="password"
								label="Password"
								type="password"
								id="password"
								autoComplete="current-password"
								onChange={(event) => onChange(event, "password")}
							/>
						</Grid>

						<Grid item xs={12}>
							<TextField
								error={
									up.error === "NoMatch" || up.error === "auth/weak-password"
								}
								variant="outlined"
								required
								fullWidth
								name="confirm-pass"
								label="Confirm Password"
								type="password"
								id="confirm-pass"
								helperText={
									up.error === "NoMatch"
										? "Passwords did not match."
										: up.error === "auth/weak-password"
										? "Password should be at least 6 characters."
										: null
								}
								onChange={(event) => onChange(event, "confirm")}
							/>
						</Grid>
					</Grid>
					<Submit fullWidth variant="contained" onClick={onSubmit}>
						Sign Up
					</Submit>
					<Grid container justifyContent="flex-end">
						<Grid item>
							<Link to="/login">Already have an account? Sign in</Link>
						</Grid>
					</Grid>
				</Form>
			</Paper>
		</Container>
	);
}
