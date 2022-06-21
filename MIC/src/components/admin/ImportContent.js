import React, { useState } from "react";
import Button from "@mui/material/Button";
import { db } from "../fire";
import { doc, getDoc, updateDoc, setDoc } from "@firebase/firestore";
import { Auto } from "../styledComps";
import getWeb from "../front/getWeb";

import CodeEditor from "@uiw/react-textarea-code-editor";

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
				console.log(response);
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

			<CodeEditor
				value={info}
				language="html"
				placeholder="No page selected."
				onChange={(event) => setInfo(event.target.value)}
				padding={15}
				style={{
					minHeight: "100px",
					fontSize: 12,
					backgroundColor: "#f5f5f5",
					fontFamily:
						"ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace",
					border: "1px solid black",
					borderRadius: "5px",
				}}
			/>
		</div>
	);
}
