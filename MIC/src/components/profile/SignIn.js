import React, { useState, useRef } from "react";
import { useHistory, Link } from "react-router-dom";

import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

import {
	setPersistence,
	signInWithEmailAndPassword,
	browserSessionPersistence,
} from "@firebase/auth";
import { auth } from "../fire";

import { Paper, LockAvatar, Form, Submit } from "../styledComps";

export default function SignIn() {
	const history = useHistory();

	// Source: https://stackoverflow.com/questions/28889826/how-to-set-focus-on-an-input-field-after-rendering
	// Hook for changing the focus of different input fields
	const useFocus = () => {
		const htmlElRef = useRef(null);
		const setFocus = () => {
			htmlElRef.current && htmlElRef.current.focus();
		};

		return [htmlElRef, setFocus];
	};

	// Email field information
	const [email, setEmail] = useState(" ");
	const [emailRef, setEmailRef] = useFocus();

	// Password field information
	const [password, setPassword] = useState(" ");
	const [passwordRef, setPasswordRef] = useFocus();

	// Error state
	const [error, setError] = useState(null);

	/**
	 * Gets current input email
	 *
	 * @param {object} event : The on change event object from changing the email field
	 */
	const onEmail = (event) => {
		setEmail(event.target.value);
		setError(null);
	};

	/**
	 * Gets current input password
	 *
	 * @param {object} event : The on change event object from changing the password field
	 */
	const onPass = (event) => {
		setPassword(event.target.value);
		setError(null);
	};

	// Sets login persistence to the current session, and logs user in if valid login info
	const onSubmit = () => {
		setPersistence(auth, browserSessionPersistence)
			.then(() => {
				return signInWithEmailAndPassword(auth, email, password)
					.then((userCredential) => {
						// Store user information in session storage
						sessionStorage.setItem("email", email);
						sessionStorage.setItem("username", userCredential.user.displayName);
						sessionStorage.setItem(
							"school",
							JSON.parse(userCredential.user.photoURL).school
						);

						// Navigate to home page
						history.push({
							pathname: "/",
							state: {
								alert: false,
								severity: null,
								message: null,
							},
						});

						// Reload to load in user information
						window.location.reload();
					})
					.catch((error) => {
						setError(error);
					});
			})
			.catch((error) => {
				setError(error);
			});
	};

	return (
		<Container component="main" maxWidth="xs">
			<Paper>
				<LockAvatar>
					<LockOutlinedIcon />
				</LockAvatar>
				<Typography component="h1" variant="h5">
					Sign in
				</Typography>
				<Form id="user" noValidate>
					<Grid item xs={12}>
						<TextField
							inputRef={emailRef}
							error={!!error}
							variant="outlined"
							margin="normal"
							required
							fullWidth
							label="Email Address"
							name="email"
							autoComplete="email"
							autoFocus
							onChange={(event) => onEmail(event)}
							onKeyDown={(e) => {
								// Got to password text field
								if (e.key === "ArrowDown") {
									setPasswordRef();
								}
							}}
						/>
					</Grid>
					<Grid item xs={12}>
						<TextField
							inputRef={passwordRef}
							error={!!error}
							variant="outlined"
							margin="normal"
							required
							fullWidth
							label="Password"
							type="password"
							autoComplete="current-password"
							helperText={
								error ? "Inncorrect email address or password." : null
							}
							onChange={(event) => onPass(event)}
							onKeyPress={(e) => {
								if (e.key === "Enter") onSubmit();
							}}
							onKeyDown={(e) => {
								// Go up to email text field
								if (e.key === "ArrowUp") {
									setEmailRef();
								}
							}}
						/>
					</Grid>
					<Submit fullWidth variant="contained" onClick={onSubmit}>
						Sign In
					</Submit>
					<Grid container>
						<Grid item xs={5}>
							<Link to="/login/forgot-password">Forgot password?</Link>
						</Grid>
						<Grid item xs={7}>
							<Link to="/login/signup">Don't have an account? Sign Up</Link>
						</Grid>
					</Grid>
				</Form>
			</Paper>
		</Container>
	);
}
