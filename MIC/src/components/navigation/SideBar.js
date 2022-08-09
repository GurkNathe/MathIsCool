import React, { useState } from "react";
import { Drawer, Button, ClickAwayListener, Grid } from "@mui/material";
import { Menu } from "@mui/icons-material";
import { onAuthStateChanged } from "@firebase/auth";
import { auth } from "../fire";

import { ClosedNav, FullNav, Title, NavOptions, Profile } from "../styledComps";
import FrontBack from "./FrontBack";
import CoachTools from "./CoachTools";
import Admin from "./Admin";

//NOTE: Mobile rendering of the pushed profile button is still pushed after switching pages

export default function SideBar() {
	const [open, setOpen] = useState(false);
	const [name, setName] = useState(1);
	const [xsVal, setXs] = useState(window.innerWidth > 540 ? null : 3);
	const [width, setWidth] = useState(window.innerWidth);

	let username = sessionStorage.getItem("username");

	if (name === 1) {
		onAuthStateChanged(auth, (use) => {
			setName(use);
		});
	}

	const onClick = () => {
		setOpen(false);
	};

	return (
		<FullNav>
			{width !== window.innerWidth ? setWidth(window.innerWidth) : null}
			{xsVal !== (window.innerWidth > 540 ? null : 3)
				? setXs(window.innerWidth > 540 ? null : 3)
				: null}
			<Drawer open={open} anchor="top">
				<ClickAwayListener onClickAway={() => setOpen(false)}>
					<NavOptions>
						<Grid container>
							<Grid item xs={xsVal}>
								<FrontBack onClick={onClick} />
							</Grid>
							<Grid item xs={xsVal}>
								{auth.currentUser ? <CoachTools onClick={onClick} /> : null}
							</Grid>
							<Grid item xs={xsVal}>
								{auth.currentUser ? (
									auth.currentUser.photoURL ? (
										<Admin onClick={onClick} />
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
