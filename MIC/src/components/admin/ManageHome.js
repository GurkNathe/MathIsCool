import React, { useEffect, useState } from "react";
import { Button, TextField } from "@mui/material";
import { db, auth } from "../fire";
import { doc, getDoc, updateDoc } from "@firebase/firestore";
import { Auto } from "../styledComps";
import getWeb from "../front/getWeb";

import CodeEditor from "@uiw/react-textarea-code-editor";

//TODO: Unselect option when Undo Option for Delete Article is clicked

export default function ManageHome() {
	// Information of the article selected/created
	const [info, setInfo] = useState({
		key: "",
		article: "",
		priority: Number(),
		timestamp: "",
		title: "",
		user: undefined,
		visible: false,
	});
	// Used to store the data for each article
	const [records, setRecords] = useState([]);

	// Used to store the names of the aricles that can be selected
	const [options, setOptions] = useState([]);

	// Used to tell what options for modifying articles have been selected
	const [newArt, setNewArt] = useState({
		picked: false,
		clicked: false,
		delete: false,
	});

	useEffect(() => {
		// Gets the article data for the page
		if (sessionStorage.getItem("news")) {
			let homeRecs = JSON.parse(sessionStorage.getItem("news"))["records"];
			setRecords(homeRecs);
			let titles = [];
			for (const record in homeRecs) {
				titles.push(record);
			}
			setOptions(titles);
		} else {
			getWeb("news").then((response) => {
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
				key: records[e].key,
				article: records[e].article,
				priority: Number(records[e].priority),
				title: records[e].title,
				visible: records[e].visible,
			}));
			setNewArt((prev) => ({
				...prev,
				picked: true,
			}));
		} else {
			setInfo((prev) => ({
				...prev,
				key: "",
				article: "",
				priority: Number(),
				title: "",
				visible: false,
			}));
			setNewArt((prev) => ({
				...prev,
				picked: false,
			}));
		}
	};

	// Saves the selected or created article
	const saveArticle = () => {
		const page = doc(db, "web", "news");
		getDoc(page)
			.then((doc) => {
				let data = doc.data();
				let article = {
					...info,
					priority: Number(info.priority),
					timestamp: new Date(Date.now()),
					user: auth.currentUser.uid,
				};
				if (newArt.clicked) {
					// If a new article is being added
					data.n++;
					article.key = "news" + data.n.toString().padStart(3, "0");
					data.timestamp = new Date(Date.now());
					data.records[article.key] = article;
				} else if (newArt.picked) {
					// If an old article is being updated
					data.records[article.key] = article;
					data.timestamp = new Date(Date.now());
				}
				updateDoc(page, data);
			})
			.catch((error) => console.error(error));
	};

	// Deletes the selected article
	const deleteArticle = () => {
		const page = doc(db, "web", "news");
		getDoc(page)
			.then((doc) => {
				let data = doc.data();
				delete data.records[info.key];
				data.n--;
				data.timestamp = new Date(Date.now());
				updateDoc(page, data);
			})
			.catch((error) => console.error(error));
	};

	return (
		<div style={{ margin: "10px" }}>
			<h1>Homepage Articles</h1>

			<div
				style={{ display: "flex", alginItems: "center", marginBottom: "10px" }}>
				<Auto
					options={options}
					onChange={(event) => selectArticle(event.target.textContent)}
					width={200}
					text="Select Article to Edit"
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
							Create New Article
						</Button>
						<Button
							variant="outlined"
							color="primary"
							size="medium"
							onClick={() => {
								setNewArt((prev) => ({ ...prev, delete: true }));
							}}
							style={{ marginLeft: "10px" }}>
							Delete Article
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
							Save Article
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
							Delete Article
						</Button>
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
					</>
				)}
			</div>

			<div
				style={{ display: "flex", alginItems: "center", marginBottom: "10px" }}>
				<TextField
					value={info.priority}
					onChange={(event) =>
						setInfo((prev) => ({ ...prev, priority: event.target.value }))
					}
					label="Priority"
					variant="outlined"
					style={{ marginRight: "10px" }}
				/>
				<TextField
					value={info.title}
					onChange={(event) =>
						setInfo((prev) => ({ ...prev, title: event.target.value }))
					}
					label="Title"
					variant="outlined"
					style={{ marginRight: "10px" }}
				/>
				<Auto
					options={["false", "true"]}
					onChange={(event) => {
						setInfo((prev) => ({
							...prev,
							visible: /^\s*(true|1|on)\s*$/i.test(event.target.textContent),
						}));
					}}
					width={120}
					text="Visibility"
					value={info.visible.toString()}
				/>
			</div>

			<CodeEditor
				value={info.article}
				language="html"
				placeholder="No article selected."
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