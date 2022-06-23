import React, { useState } from "react";
import { Header, LinkButton, Summary, All } from "../styledComps";
import { Accordion, AccordionDetails, ClickAwayListener } from "@mui/material";

export default function Admin(props) {
	const [open, setOpen] = useState(false);
	const [away, setAway] = useState({ p1: true, p2: true });

	const handleChange = (panel) => (event, isOpen) => {
		setOpen(isOpen ? panel : false);
		setAway({ p1: true, p2: true });
	};

	const tabs = [
		[
			{ to: "/admin/import-content", text: "Import Pages" },
			{ to: "/admin/manage-comps", text: "Manage Competitions" },
			{ to: "/admin/manage-home", text: "Manage Homepage" },
			{ to: "/admin/other", text: "Others" },
		],
	];

	return (
		<All>
			<Header>Admin</Header>

			<LinkButton
				to="/admin/add-admin"
				onClick={props.onClick}
				text="Add Admin"
			/>
			<LinkButton
				to="/admin/mark-masters"
				onClick={props.onClick}
				text="Mark Masters"
			/>
			<ClickAwayListener onClickAway={() => setAway({ ...away, p1: false })}>
				<Accordion
					expanded={open === "panel1" && away.p1}
					onChange={handleChange("panel1")}>
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
