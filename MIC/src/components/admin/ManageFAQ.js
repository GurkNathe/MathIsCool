import React, { useEffect, useState } from "react";

import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-markup";
import "prismjs/themes/prism.css";

import { db, auth } from "../fire";
import { doc, getDoc, updateDoc } from "@firebase/firestore";

import { Auto, Alerts } from "../styledComps";
import getWeb from "../front/getWeb";

export default function ManageFAQ() {
	// Information of the question selected/created
	const [info, setInfo] = useState({
		key: Number(),
		question: "",
		answer: "",
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

	// Error handling
	const [error, setError] = useState({
		submitted: false,
		success: false,
		error: false,
		get: false,
		delete: false,
		deleteError: false,
		noQuestion: false,
	});

	// Text displayed by the help icon.
	const helpText =
		// eslint-disable-next-line no-multi-str
		"Keys that are multiples of 100 are considered sections. Example: 500 is a \
        section, and 520 is a Q&A in the section. You can add Q&As to a section \
        before you create the section.";

	// Gets the question data for the page
	useEffect(() => {
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
			setInfo({
				key: Number(records[e].key),
				question: records[e].question === null ? "" : records[e].question,
				answer: records[e].answer === null ? "" : records[e].answer,
				visible:
					records[e].visible === null ? "false" : records[e].visible.toString(),
			});
			setNewArt((prev) => ({
				...prev,
				picked: true,
			}));
		} else {
			setInfo({
				key: Number(),
				question: "",
				answer: "",
				visible: "false",
			});
			setNewArt((prev) => ({
				...prev,
				picked: false,
			}));
		}
	};

	// Saves the selected or created question
	const saveQuestion = async () => {
		const page = doc(db, "web", "faq");
		await getDoc(page)
			.then((doc) => {
				let data = doc.data();
				let question = {
					...info,
					answer: Number(info.key) % 100 === 0 ? null : info.answer,
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

				// Updating database
				updateDoc(page, data)
					.then(() => {
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

						// Adding information to submitter's session information
						sessionStorage.setItem("faq", JSON.stringify(data));
						setError((prev) => ({
							...prev,
							submitted: true,
							success: true,
						}));
					})
					.catch(() => {
						setError((prev) => ({
							...prev,
							submitted: true,
							error: true,
						}));
					});
			})
			.catch(() => {
				setError((prev) => ({
					...prev,
					submitted: true,
					get: true,
				}));
			});
	};

	// Deletes the selected question
	const deleteQuestion = async () => {
		if (options.includes(String(info.key))) {
			const page = doc(db, "web", "faq");
			await getDoc(page)
				.then((doc) => {
					let data = doc.data();

					// Deleting the record from the database data
					delete data.records[info.key];

					// Decreasing number of records in database
					data.n--;
					data.timestamp = new Date(Date.now());

					// Updating database
					updateDoc(page, data)
						.then(() => {
							// Deleting the record from local data
							delete records[info.key];

							// Deleting the option from local options
							let tempOps = options;
							for (let i = 0; i < tempOps.length; i++) {
								if (tempOps[i] === String(info.key)) {
									tempOps.splice(i, 1);
									break;
								}
							}

							// Updating records and options on local side
							setRecords(records);
							setOptions(tempOps);

							// Updating session information
							sessionStorage.setItem("faq", JSON.stringify(data));

							setError((prev) => ({
								...prev,
								submitted: true,
								delete: true,
							}));
						})
						.catch(() => {
							setError((prev) => ({
								...prev,
								submitted: true,
								deleteError: true,
							}));
						});
				})
				.catch(() => {
					setError((prev) => ({
						...prev,
						submitted: true,
						get: true,
					}));
				});
		} else {
			setError((prev) => ({
				...prev,
				submitted: true,
				noQuestion: true,
			}));
		}
	};

	return (
		<div style={{ margin: "10px" }}>
			<Alerts
				open={error.submitted || error.delete}
				handleClose={() =>
					setError({
						submitted: false,
						success: false,
						error: false,
						get: false,
						delete: false,
						deleteError: false,
						noQuestion: false,
					})
				}
				type={error.success || error.delete ? "success" : "error"}
				message={
					error.success
						? "Successfully updated question."
						: error.delete
						? "Successfully deleted question."
						: error.get
						? "There was an error retrieving the question. Please try saving again."
						: error.error
						? "Page failed to upload successfully. Please try again."
						: error.deleteError
						? "Error deleting the question. Please try again."
						: error.noQuestion
						? "The question is already deleted."
						: "An unknown error occurred. Please try again."
				}
			/>
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
				<Tooltip title={helpText}>
					<HelpOutlineIcon
						sx={{
							marginLeft: "10px",
							color: "black",
							width: "25px",
							height: "25px",
							alignSelf: "center",
						}}
					/>
				</Tooltip>
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
			<Editor
				value={info.question}
				tabSize={4}
				placeholder="No question selected."
				onValueChange={(info) => {
					setInfo((prev) => ({
						...prev,
						question: info,
					}));
				}}
				highlight={(info) => highlight(info, languages.markup)}
				padding={10}
				style={{
					fontFamily: '"Fira code", "Fira Mono", monospace',
					fontSize: 12,
					backgroundColor: "#f5f5f5",
					minHeight: "100px",
					border: "1px solid black",
					borderRadius: "5px",
					marginBottom: "10px",
				}}
			/>

			<Typography>Answer</Typography>
			<Editor
				value={info.answer}
				tabSize={4}
				placeholder="No question selected."
				onValueChange={(info) => {
					setInfo((prev) => ({
						...prev,
						answer: info,
					}));
				}}
				disabled={info.key % 100 === 0}
				highlight={(info) => highlight(info, languages.markup)}
				padding={10}
				style={{
					fontFamily: '"Fira code", "Fira Mono", monospace',
					fontSize: 12,
					backgroundColor: "#f5f5f5",
					minHeight: "100px",
					border: "1px solid black",
					borderRadius: "5px",
					marginBottom: "10px",
				}}
			/>
		</div>
	);
}
