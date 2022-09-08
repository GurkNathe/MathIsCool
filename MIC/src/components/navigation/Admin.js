import React, { useState } from "react";

import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import ClickAwayListener from "@mui/material/ClickAwayListener";

import { Header, LinkButton, Summary, All } from "../styledComps";

export default function Admin(props) {
	// Indicates whether the accordion was opened
	const [open, setOpen] = useState(false);

	// Indicates whether user clicked away from the accordion
	const [away, setAway] = useState(true);

	// Handles changing open/closed state of accordion component
	const handleChange = () => (_, isOpen) => {
		setOpen(isOpen);
		setAway(true);
	};

	// Url + Title for page editing buttons
	const tabs = [
		[
			{ to: "/admin/import-content", text: "Manage HTML Pages" },
			{ to: "/admin/manage-home", text: "Manage Homepage" },
			{ to: "/admin/manage-faq", text: "Manage FAQ" },
			{ to: "/admin/manage-comps", text: "Manage Competitions" },
			{ to: "/admin/manage-pasttests", text: "Manage Past Tests" },
			{ to: "/admin/manage-sites", text: "Manage Sites" },
			{ to: "/admin/add-info", text: "Add Info" },
			{ to: "/admin/other", text: "Others" },
		],
	];

	return (
		<All>
			<Header>Admin</Header>
			<LinkButton
				sx={{ display: "flex", alignItems: "center", flexDirection: "column" }}
				to="/admin/add-admin"
				onClick={props.onClick}
				text="Add Admin"
			/>
			<LinkButton
				sx={{ display: "flex", alignItems: "center", flexDirection: "column" }}
				to="/admin/mark-masters"
				onClick={props.onClick}
				text="Mark Masters"
			/>
			<ClickAwayListener onClickAway={() => setAway(false)}>
				<Accordion expanded={open && away} onChange={handleChange()}>
					<Summary>Page Editing</Summary>
					<AccordionDetails>
						<div>
							{tabs[0].map((data, index) => {
								return (
									<LinkButton
										key={index}
										to={data.to}
										onClick={props.onClick}
										text={data.text}
									/>
								);
							})}
						</div>
					</AccordionDetails>
				</Accordion>
			</ClickAwayListener>
		</All>
	);
}
