import React, { useEffect, useState } from "react";

import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

import CodeEditor from "@uiw/react-textarea-code-editor";

import { db, auth } from "../fire";
import { doc, getDoc, updateDoc } from "@firebase/firestore";

import { Auto, Alerts, LayerOne, LayerTwo } from "../styledComps";
import getWeb from "../front/getWeb";

export default function ManageHome() {
	// Information of the article selected/created
	const [info, setInfo] = useState({
		key: "",
		article: "",
		priority: Number(),
		title: "",
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

	// Error handling
	const [error, setError] = useState({
		submitted: false,
		success: false,
		error: false,
		get: false,
		delete: false,
		deleteError: false,
		noQuestions: false,
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

	/**
	 * Handles the data filling upon selecting an article
	 *
	 * @param {string} e : ID of the article selected
	 */
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
				updateDoc(page, data)
					.then(() => {
						// Update local information
						sessionStorage.setItem("news", JSON.stringify(data));
						setRecords(data.records);
						if (newArt.clicked) {
							setOptions((prev) => [...prev, article.key]);
							setInfo({
								key: "",
								article: "",
								priority: Number(),
								title: "",
								visible: false,
							});
						}
						setNewArt({
							picked: false,
							clicked: false,
							delete: false,
						});
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

	// Deletes the selected article
	const deleteArticle = () => {
		if (options.includes(info.key)) {
			const page = doc(db, "web", "news");
			getDoc(page)
				.then((doc) => {
					let data = doc.data();
					delete data.records[info.key];
					data.n--;
					data.timestamp = new Date(Date.now());

					updateDoc(page, data)
						.then(() => {
							// Update local information
							sessionStorage.setItem("news", JSON.stringify(data));
							setOptions(Object.keys(data.records));
							setRecords(data.records);
							setInfo({
								key: "",
								article: "",
								priority: Number(),
								title: "",
								visible: false,
							});

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
		<LayerOne>
			<LayerTwo>
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
								noQuestions: false,
							})
						}
						type={error.success || error.delete ? "success" : "error"}
						message={
							error.success
								? "Successfully updated article."
								: error.delete
								? "Successfully deleted article."
								: error.get
								? "There was an error retrieving the article. Please try saving again."
								: error.error
								? "Article failed to upload. Please try again."
								: error.deleteError
								? "Error deleting the article. Please try again."
								: error.noQuestion
								? "There is no article to delete."
								: "An unknown error occurred. Please try again."
						}
					/>
					<h1>Homepage Articles</h1>

					<div
						style={{
							display: "flex",
							alginItems: "center",
							marginBottom: "10px",
						}}>
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
						style={{
							display: "flex",
							alginItems: "center",
							marginBottom: "10px",
						}}>
						<TextField
							value={info.priority}
							onChange={(event) =>
								setInfo((prev) => ({
									...prev,
									priority: event.target.value.replace(/[^\d,]+/g, ""),
								}))
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
									visible: /^\s*(true|1|on)\s*$/i.test(
										event.target.textContent
									),
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
			</LayerTwo>
		</LayerOne>
	);
}
