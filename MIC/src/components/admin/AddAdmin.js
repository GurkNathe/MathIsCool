import React, { useState } from "react";

import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { db } from "../fire";
import { doc, getDoc, updateDoc } from "@firebase/firestore";

import { Form, Paper, Submit, Alerts } from "../styledComps";

export default function AddAdmin() {
	// Input UID
	const [uid, setUid] = useState("");

	// Error handling
	const [error, setError] = useState({
		uid: false,
		submitted: false,
		get: false,
		success: false,
		error: false,
		already: false,
	});

	/**
	 * Adds new admin to firestore
	 * @param {string} uid : UID for the person being added as an admin
	 */
	const addAdmin = async (uid) => {
		const docRef = doc(db, "roles", "admin");
		await getDoc(docRef)
			.then((doc) => {
				const uids = doc.data().admins;
				if (!uids.includes(uid)) {
					updateDoc(docRef, {
						admins: [...uids, uid],
					})
						.then(() => {
							setError((prev) => ({
								...prev,
								success: true,
								submitted: true,
							}));
						})
						.catch(() => {
							setError((prev) => ({
								...prev,
								error: true,
								submitted: true,
							}));
						});
				} else {
					setError((prev) => ({
						...prev,
						already: true,
						submitted: true,
					}));
				}
			})
			.catch(() => {
				setError((prev) => ({
					...prev,
					get: true,
					submitted: true,
				}));
			});
	};

	// Submission function that checks for a valid string
	const onSubmit = () => {
		if (uid !== "" && uid !== null && uid !== undefined) {
			addAdmin(uid);
		} else {
			setError((prev) => ({
				...prev,
				uid: true,
			}));
		}
	};

	/**
	 * Updates current input uid
	 *
	 * @param {string} uid : UID for the person being added as an admin
	 */
	const onChange = (uid) => {
		setUid(uid);
		setError((prev) => ({
			...prev,
			uid: false,
		}));
	};

	return (
		<Container component="main" maxWidth="xs">
			<Alerts
				open={error.submitted}
				handleClose={() =>
					setError({
						uid: false,
						submitted: false,
						get: false,
						success: false,
						error: false,
						already: false,
					})
				}
				type={error.success ? "success" : "error"}
				message={
					error.success
						? "Successfully updated page."
						: error.get
						? "There was an error retrieving admin information."
						: error.error
						? "There was an error updating the admin information."
						: error.already
						? `User with UID: ${uid} is already an administrator.`
						: null
				}
			/>
			<Paper>
				<Typography component="h1" variant="h5">
					Enter UID of User
				</Typography>
				<Form id="user" noValidate>
					<Grid item xs={12}>
						<TextField
							error={error.uid}
							variant="outlined"
							margin="normal"
							required
							fullWidth
							label="UID"
							helperText={error.uid ? "Please enter a valid uid." : null}
							autoFocus
							onChange={(event) => onChange(event.target.value)}
						/>
					</Grid>
					<Submit fullWidth variant="contained" onClick={onSubmit}>
						Add Admin
					</Submit>
				</Form>
			</Paper>
		</Container>
	);
}
