import React, { useState } from "react";
import { TextField, Grid, Typography, Container } from "@mui/material";
import { Form, Paper, Submit } from "../styledComps";
import { db } from "../fire";
import { doc, getDoc, updateDoc } from "@firebase/firestore";

//Adds new admin to firestore
async function addAdmin(uid) {
	const docRef = doc(db, "roles", "admin");
	const admin = await getDoc(docRef).then((doc) => {
		var uids = doc.data().admins;
		if (!uids.includes(uid)) {
			updateDoc(docRef, {
				admins: [...uids, uid],
			});
		}
	});

	return admin;
}

export default function AddAdmin() {
	const [uid, setUid] = useState("");
	const [error, setError] = useState(false);

	const onSubmit = () => {
		var actual = true;
		if (uid === "" || uid === null || uid === undefined) {
			setError(true);
			actual = false;
		}

		if (actual) {
			addAdmin(uid);
		}
	};

	//gets current input uid
	const onEmail = (event) => {
		setUid(event.target.value);
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
							error={error}
							variant="outlined"
							margin="normal"
							required
							fullWidth
							label="UID"
							helperText={error ? "Please enter a valid uid." : null}
							autoFocus
							onChange={onEmail}
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
