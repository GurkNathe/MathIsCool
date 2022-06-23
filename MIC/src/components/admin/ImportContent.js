import React, { useState } from "react";
import Button from "@mui/material/Button";
import { db } from "../fire";
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs/components/prism-core";

import "prismjs/components/prism-clike";
import "prismjs/components/prism-markup";
import "prismjs/themes/prism.css";

import { doc, getDoc, updateDoc } from "@firebase/firestore";
import { Auto } from "../styledComps";
import getWeb from "../front/getWeb";

export default function ImportContent() {
	const [info, setInfo] = useState("");
	const [webName, setWebName] = useState("");

	// Options for what pages can be manipulated
	const pageOptions = ["History", "Contacts", "Rules", "Fees"];

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
			getDoc(page)
				.then((doc) => {
					updateDoc(page, {
						timestamp: new Date(Date.now()),
						value: info,
					});
				})
				.catch((error) => console.error(error));
		}
	};

	return (
		<div style={{ margin: "10px" }}>
			<h1>Import Page Content</h1>

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
