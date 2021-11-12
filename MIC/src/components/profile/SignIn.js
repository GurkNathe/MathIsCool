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
import { Paper, LockAvatar, Form, Submit } from "../styledComps";

import {
	setPersistence,
	signInWithEmailAndPassword,
	browserSessionPersistence,
} from "@firebase/auth";
import { auth } from "../fire";

//TODO: links to other pages won't lay flat under submit button
export default function SignIn() {
	const history = useHistory();
	const [email, setEmail] = useState(" ");
	const [password, setPassword] = useState(" ");
	const [error, setError] = useState(null);

	//gets current input email
	const onEmail = (event) => {
		setEmail(event.target.value);
		setError(null);
	};

	//gets current input password
	const onPass = (event) => {
		setPassword(event.target.value);
		setError(null);
	};

	//will handle sending info to firebase and changing to loggedin page
	const onSubmit = () => {
		setPersistence(auth, browserSessionPersistence)
			.then(() => {
				return signInWithEmailAndPassword(auth, email, password)
					.then((userCredential) => {
						sessionStorage.setItem("email", email);
						sessionStorage.setItem("username", userCredential.user.displayName);
						history.push({
							pathname: "/",
							state: {
								alert: false,
								severity: null,
								message: null,
								duration: null,
							},
						});
						window.location.reload();
					})
					.catch((error) => {
						setError(error);
					});
			})
			.catch((error) => {
				console.error(error);
			});
	};

	return (
		<Container component="main" maxWidth="xs">
			<CssBaseline />
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
							error={error}
							variant="outlined"
							margin="normal"
							required
							fullWidth
							id="email"
							label="Email Address"
							name="email"
							autoComplete="email"
							autoFocus
							onChange={onEmail}
						/>
					</Grid>
					<Grid item xs={12}>
						<TextField
							error={error}
							variant="outlined"
							margin="normal"
							required
							fullWidth
							name="password"
							label="Password"
							type="password"
							id="password"
							autoComplete="current-password"
							helperText={
								error ? "Inncorrect email address or password." : null
							}
							onChange={onPass}
							onKeyPress={(e) => {
								if (e.key === "Enter") onSubmit();
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
