import React, { useState } from "react";

import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { db } from "../fire";
import { doc, getDoc, updateDoc } from "@firebase/firestore";

import { Form, Paper, Submit } from "../styledComps";

export default function AddAdmin() {
	const [uid, setUid] = useState("");
	const [error, setError] = useState(false);

	// Adds new admin to firestore
	const addAdmin = async (uid) => {
		const docRef = doc(db, "roles", "admin");
		const admin = await getDoc(docRef).then((doc) => {
			const uids = doc.data().admins;
			if (!uids.includes(uid)) {
				updateDoc(docRef, {
					admins: [...uids, uid],
				});
			}
		});

		return admin;
	};

	// Submission function that checks for a valid string
	const onSubmit = () => {
		if (uid !== "" && uid !== null && uid !== undefined) {
			addAdmin(uid);
		} else {
			setError(true);
		}
	};

	// Gets current input uid
	const onChange = (uid) => {
		setUid(uid);
		setError(false);
	};

	return (
		<Container component="main" maxWidth="xs">
			<Paper>
				<Typography component="h1" variant="h5">
					Enter UID of User
				</Typography>
				<Form id="user" noValidate>
					<Grid item xs={12}>
						<TextField
							error={!!error}
							variant="outlined"
							margin="normal"
							required
							fullWidth
							label="UID"
							helperText={error ? "Please enter a valid uid." : null}
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
