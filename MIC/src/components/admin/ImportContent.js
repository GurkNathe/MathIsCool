import React, { useState } from "react";

import Button from "@mui/material/Button";

import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-markup";
import "prismjs/themes/prism.css";

import { db } from "../fire";
import { doc, updateDoc } from "@firebase/firestore";

import { Auto, Alerts } from "../styledComps";
import getWeb from "../front/getWeb";

export default function ImportContent() {
	// HTML content
	const [info, setInfo] = useState("");

	// Name of page
	const [webName, setWebName] = useState("");

	// Error handling
	const [error, setError] = useState({
		submitted: false,
		success: false,
		error: false,
		noSelect: false,
	});

	// Options for what pages can be manipulated
	const pageOptions = ["History", "Contacts", "Rules", "Fees"];

	// Names of pages
	const baseConv = ["history", "whotocall", "rules", "fees"];

	// Gets the HTML for selected page
	const getPageContent = (name) => {
		if (name === "") {
			setInfo("");
			return;
		}

		// Get index of choice
		let webName = "";
		for (let i = 0; i < pageOptions.length; i++) {
			if (pageOptions[i] === name) {
				webName = baseConv[i];
				setWebName(webName);
				break;
			}
		}

		// Gets the HTML data for the page
		if (sessionStorage.getItem(webName))
			setInfo(JSON.parse(sessionStorage.getItem(webName))["value"]);
		else
			getWeb(webName).then((response) => {
				setInfo(response.value);
			});
	};

	// Saves the new HTML to the database
	const savePage = () => {
		if (webName !== "" && info !== "") {
			const page = doc(db, "web", webName);
			updateDoc(page, {
				timestamp: new Date(Date.now()),
				value: info,
			})
				.then(() => {
					setError({
						submitted: true,
						success: true,
						error: false,
					});
				})
				.catch(() => {
					setError({
						submitted: true,
						success: false,
						error: true,
					});
				});
		} else {
			setError({
				submitted: true,
				success: false,
				error: true,
				noSelect: true,
			});
		}
	};

	return (
		<div style={{ margin: "10px" }}>
			<Alerts
				open={error.submitted}
				handleClose={() =>
					setError({
						submitted: false,
						success: false,
						error: false,
						noSelect: false,
					})
				}
				type={error.success ? "success" : "error"}
				message={
					error.success
						? "Successfully updated page."
						: error.noSelect
						? "Please select a page to update."
						: error.error
						? "Page failed to upload successfully. Please try again."
						: null
				}
			/>
			<h1>Import Page Content</h1>
			<p style={{ color: "grey" }}>
				The content of the available pages is written in HTML.
			</p>
			<div
				style={{ display: "flex", alginItems: "center", marginBottom: "10px" }}>
				<Auto
					options={pageOptions}
					onChange={(event) => getPageContent(event.target.textContent)}
					width={200}
					text="Select Page"
				/>
				<Button
					variant="outlined"
					color="primary"
					size="medium"
					onClick={savePage}
					style={{ marginLeft: "10px" }}>
					Save Page
				</Button>
			</div>
			<Editor
				value={info}
				tabSize={4}
				placeholder="No page selected."
				onValueChange={(info) => setInfo(info)}
				highlight={(info) => highlight(info, languages.markup)}
				padding={10}
				style={{
					fontFamily: '"Fira code", "Fira Mono", monospace',
					fontSize: 12,
					minHeight: "100px",
					border: "1px solid black",
					borderRadius: "5px",
				}}
			/>
		</div>
	);
}
