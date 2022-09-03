import React, { useState, useEffect } from "react";

import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Grid from "@mui/material/Grid";
import Menu from "@mui/icons-material/Menu";

import { onAuthStateChanged } from "@firebase/auth";
import { auth } from "../fire";

import { ClosedNav, FullNav, Title, NavOptions, Profile } from "../styledComps";
import FrontBack from "./FrontBack";
import CoachTools from "./CoachTools";
import Admin from "./Admin";

export default function SideBar() {
	// Controls the open/closed state of the drop down menu
	const [open, setOpen] = useState(false);

	// User information
	const [user, setUser] = useState(null);

	// Used for username display on profile button
	let username = sessionStorage.getItem("username");

	// Gets and sets user information
	useEffect(() => {
		onAuthStateChanged(auth, (use) => {
			setUser(use);
		});
	}, []);

	return (
		<FullNav>
			<Drawer open={open} anchor="top">
				<ClickAwayListener onClickAway={() => setOpen(false)}>
					<NavOptions>
						<Grid container>
							<Grid item>
								<FrontBack onClick={() => setOpen(false)} />
							</Grid>
							<Grid item>
								{user ? <CoachTools onClick={() => setOpen(false)} /> : null}
							</Grid>
							<Grid item>
								{user ? (
									user.photoURL ? (
										JSON.parse(user.photoURL).admin === user.uid ? (
											<Admin onClick={() => setOpen(false)} />
										) : null
									) : null
								) : null}
							</Grid>
							<Profile username={username} setOpen={setOpen} />
						</Grid>
					</NavOptions>
				</ClickAwayListener>
			</Drawer>
			<ClosedNav>
				<Button onClick={() => setOpen(true)}>
					<Menu style={{ color: "white" }} />
				</Button>
				<Title>Math Is Cool</Title>
				<Profile username={username} setOpen={setOpen} />
			</ClosedNav>
		</FullNav>
	);
}
