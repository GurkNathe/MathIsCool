import React, { useEffect, useState } from "react";
import { Button, TextField, Typography } from "@mui/material";
import { db, auth } from "../fire";
import { doc, getDoc, updateDoc } from "@firebase/firestore";
import { Auto } from "../styledComps";
import getWeb from "../front/getWeb";

import CodeEditor from "@uiw/react-textarea-code-editor";

export default function ManageFAQ() {
	// Information of the question selected/created
	const [info, setInfo] = useState({
		key: Number(),
		question: "",
		answer: "",
		timestamp: "",
		user: undefined,
		visible: "false",
	});

	// Used to store the data for all questions
	const [records, setRecords] = useState([]);

	// Used to store the keys of the questions that can be selected
	const [options, setOptions] = useState([]);

	// Used to tell what options for modifying questions have been selected
	const [newArt, setNewArt] = useState({
		picked: false,
		clicked: false,
		delete: false,
	});

	useEffect(() => {
		// Gets the question data for the page
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

	// Handles the data filling upon selecting a question
	const selectArticle = (e) => {
		if (e) {
			setInfo((prev) => ({
				...prev,
				key: Number(records[e].key),
				question: records[e].question,
				answer: records[e].answer,
				visible:
					records[e].visible === null ? "false" : records[e].visible.toString(),
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
				visible: "false",
			}));
			setNewArt((prev) => ({
				...prev,
				picked: false,
			}));
		}
	};

	// Saves the selected or created question
	const saveQuestion = () => {
		const page = doc(db, "web", "faq");
		getDoc(page)
			.then((doc) => {
				let data = doc.data();
				let question = {
					...info,
					timestamp: new Date(Date.now()),
					user: auth.currentUser.uid,
					key: Number(info.key),
					visible: /^\s*(true|1|on)\s*$/i.test(info.visible),
				};
				if (newArt.clicked) {
					// If a new question is being added
					data.n++;
					data.timestamp = new Date(Date.now());
					data.records[question.key] = question;
				} else if (newArt.picked) {
					// If an old question is being updated
					data.records[question.key] = question;
					data.timestamp = new Date(Date.now());
				}
				// Inserting the option if it isn't already there
				let tempOps = options;
				if (!tempOps.includes(info.key.toString())) {
					tempOps.push(info.key.toString());
				}
				tempOps.sort();
				// Updating/adding question to local records
				records[info.key] = question;

				// Updating local information
				setOptions(tempOps);
				setRecords(records);

				// Adding information to session information
				sessionStorage.setItem("faq", JSON.stringify(data));

				// Updating database
				updateDoc(page, data);
			})
			.catch((error) => console.error(error));
	};

	const deleteQuestion = () => {
		const page = doc(db, "web", "faq");
		getDoc(page)
			.then((doc) => {
				let data = doc.data();

				// Deleting the record from the database data
				delete data.records[info.key];

				// Deleting the record from local data
				delete records[info.key];

				// Deleting the option from local options
				for (let i = 0; i < options.length; i++) {
					if (options[i] == info.key) {
						options.splice(i, 1);
						break;
					}
				}
				// Decreasing number of records in database
				data.n--;
				data.timestamp = new Date(Date.now());

				// Updating records and options on local side
				setRecords(records);
				setOptions(options);

				// Updating session information
				sessionStorage.setItem("faq", JSON.stringify(data));

				// Updating database
				updateDoc(page, data);
			})
			.catch((error) => console.error(error));
	};

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
							onClick={saveQuestion}
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
							onClick={deleteQuestion}
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

			<div
				style={{ display: "flex", alginItems: "center", marginBottom: "10px" }}>
				{newArt.clicked ? (
					<TextField
						value={info.key}
						onChange={(event) =>
							setInfo((prev) => ({ ...prev, key: event.target.value }))
						}
						helperText={`This will overwrite any question with the key ${
							info.key === "" ? 0 : info.key
						}.`}
						label="Key"
						variant="outlined"
						style={{ marginRight: "10px" }}
					/>
				) : null}
				<Auto
					options={["false", "true"]}
					onChange={(event) => {
						setInfo((prev) => ({
							...prev,
							visible: event.target.textContent,
						}));
					}}
					width={120}
					text="Visibility"
					value={info.visible}
				/>
			</div>

			<Typography>Question</Typography>
			<CodeEditor
				value={info.question}
				language="html"
				placeholder="No question selected."
				onChange={(event) =>
					setInfo((prev) => ({
						...prev,
						question: event.target.value,
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

			<Typography>Answer</Typography>
			<CodeEditor
				value={info.answer}
				language="html"
				placeholder="No page selected."
				onChange={(event) =>
					setInfo((prev) => ({
						...prev,
						answer: event.target.value,
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
