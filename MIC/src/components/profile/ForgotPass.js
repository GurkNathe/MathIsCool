import React, { useState } from "react";
import { useHistory } from "react-router-dom";

import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";

import { sendPasswordResetEmail } from "@firebase/auth";
import { auth } from "../fire";

import { Paper, Submit } from "../styledComps";

export default function ForgotPass() {
	const history = useHistory();
	const [email, setEmail] = useState(" ");
	const [error, setError] = useState(false);

	/**
	 * Gets current input email
	 *
	 * @param {string} emailAddress : input string of the email field
	 */
	const onEmail = (emailAddress) => {
		setEmail(emailAddress);
		setError(false);
	};

	// Sends an email to the user to reset their password
	const onSubmit = async () => {
		await sendPasswordResetEmail(auth, email)
			.then(() => {
				history.push({
					pathname: "/",
					state: {
						alert: true,
						severity: "info",
						message:
							"A password reset email was sent to your email. Please click on the link and reset your password.",
					},
				});
			})
			.catch((error) => {
				setError(error);
			});
	};

	return (
		<Container component="main" maxWidth="xs">
			<Paper>
				<Typography component="h1" variant="h5">
					Enter Email Address
				</Typography>
				<TextField
					error={!!error}
					variant="outlined"
					margin="normal"
					required
					fullWidth
					label="Email Address"
					name="email"
					autoComplete="email"
					helperText={error ? "Please enter a valid email address." : null}
					autoFocus
					onKeyDown={(event) => {
						if (event.key === "Enter") {
							onSubmit();
						}
					}}
					onChange={(event) => onEmail(event.target.value)}
				/>
				<Submit fullWidth variant="contained" onClick={onSubmit}>
					Reset
				</Submit>
			</Paper>
		</Container>
	);
}
