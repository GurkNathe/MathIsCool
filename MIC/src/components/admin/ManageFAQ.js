import React, { useEffect, useState } from "react";
import { Button, TextField } from "@mui/material";
import { db, auth } from "../fire";
import { doc, getDoc, updateDoc } from "@firebase/firestore";
import { Auto } from "../styledComps";
import getWeb from "../front/getWeb";

import CodeEditor from "@uiw/react-textarea-code-editor";

export default function ManageFAQ() {
	const [info, setInfo] = useState({
		key: Number(),
		question: "",
		answer: "",
		timestamp: "",
		user: undefined,
		visible: false,
	});
	const [records, setRecords] = useState([]);
	const [options, setOptions] = useState([]);
	const [newArt, setNewArt] = useState({
		picked: false,
		clicked: false,
		delete: false,
	});

	useEffect(() => {
		// Gets the HTML data for the page
		if (sessionStorage.getItem("faq")) {
			let homeRecs = JSON.parse(sessionStorage.getItem("faq")).records;
			setRecords(homeRecs);
			let titles = [];
			for (const record in homeRecs) {
				titles.push(record);
			}
			setOptions(titles);
		} else {
			getWeb("faq").then((response) => {
				setRecords(response.records);
				let titles = [];
				for (const record in response.records) {
					titles.push(record);
				}
				setOptions(titles);
			});
		}
	}, []);

	// Handles the data filling upon selecting an article
	const selectArticle = (e) => {
		if (e) {
			setInfo((prev) => ({
				...prev,
				key: Number(records[e].key),
				question: records[e].question,
				answer: records[e].answer,
				visible: records[e].visible,
			}));
			setNewArt((prev) => ({
				...prev,
				picked: true,
			}));
		} else {
			setInfo((prev) => ({
				...prev,
				key: Number(),
				question: "",
				answer: "",
				timestamp: "",
				user: undefined,
				visible: false,
			}));
			setNewArt((prev) => ({
				...prev,
				picked: false,
			}));
		}
	};

	const saveArticle = () => {
		const page = doc(db, "web", "faq");
		getDoc(page)
			.then((doc) => {
				let data = doc.data();

				console.log(data);
				// updateDoc(page, data);
			})
			.catch((error) => console.error(error));
	};

	const deleteArticle = () => {
		const page = doc(db, "web", "faq");
		getDoc(page)
			.then((doc) => {
				let data = doc.data();

				console.log(data);
				// updateDoc(page, data);
			})
			.catch((error) => console.error(error));
	};

	console.log(info);
	return (
		<div style={{ margin: "10px" }}>
			<h1>FAQ Questions</h1>

			<div
				style={{ display: "flex", alginItems: "center", marginBottom: "10px" }}>
				<Auto
					options={options}
					onChange={(event) => selectArticle(event.target.textContent)}
					width={200}
					text="Select Question to Edit"
					disabled={newArt.clicked}
				/>
				{!newArt.picked && !newArt.clicked && !newArt.delete ? (
					<>
						<Button
							variant="outlined"
							color="primary"
							size="medium"
							onClick={() => {
								setNewArt((prev) => ({ ...prev, clicked: true }));
							}}
							style={{ marginLeft: "10px" }}>
							Create New Question
						</Button>
						<Button
							variant="outlined"
							color="primary"
							size="medium"
							onClick={() => {
								setNewArt((prev) => ({ ...prev, delete: true }));
							}}
							style={{ marginLeft: "10px" }}>
							Delete Question
						</Button>
					</>
				) : !newArt.delete ? (
					<>
						<Button
							variant="outlined"
							color="primary"
							size="medium"
							onClick={saveArticle}
							style={{ marginLeft: "10px" }}>
							Save Question
						</Button>
						{!newArt.picked ? (
							<Button
								variant="outlined"
								color="primary"
								size="medium"
								onClick={() =>
									setNewArt((prev) => ({
										...prev,
										clicked: false,
										delete: false,
									}))
								}
								style={{ marginLeft: "10px" }}>
								Undo Option
							</Button>
						) : null}
					</>
				) : (
					<>
						<Button
							variant="outlined"
							color="primary"
							size="medium"
							onClick={deleteArticle}
							style={{ marginLeft: "10px" }}>
							Delete Question
						</Button>
						<Button
							variant="outlined"
							color="primary"
							size="medium"
							onClick={() => {
								setNewArt((prev) => ({
									...prev,
									clicked: false,
									delete: false,
								}));
							}}
							style={{ marginLeft: "10px" }}>
							Undo Option
						</Button>
					</>
				)}
			</div>

			<CodeEditor
				value={info.question}
				language="html"
				placeholder="No question selected."
				onChange={(event) =>
					setInfo((prev) => ({
						...prev,
						article: event.target.value,
					}))
				}
				padding={15}
				style={{
					minHeight: "100px",
					fontSize: 12,
					backgroundColor: "#f5f5f5",
					fontFamily:
						"ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace",
					border: "1px solid black",
					borderRadius: "5px",
					marginBottom: "10px",
				}}
			/>
			<CodeEditor
				value={info.answer}
				language="html"
				placeholder="No page selected."
				onChange={(event) =>
					setInfo((prev) => ({
						...prev,
						article: event.target.value,
					}))
				}
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
