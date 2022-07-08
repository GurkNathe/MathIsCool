import React, { useEffect, useState } from "react";
import { Button, TextField } from "@mui/material";
import { db, auth } from "../fire";
import { doc, getDoc, updateDoc } from "@firebase/firestore";
import { Drop } from "../styledComps";
import getWeb from "../front/getWeb";

export default function ManageSites() {
	// Information of the question selected/created
	const [info, setInfo] = useState({
		city: "",
		key: "",
		mapUrl: "",
		name: "",
		phone: "",
		region: "",
		show: "",
		street: "",
		timestamp: "",
		user: undefined,
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
		if (sessionStorage.getItem("sites")) {
			let homeRecs = JSON.parse(sessionStorage.getItem("sites")).records;
			setRecords(homeRecs);
			let titles = [];
			for (const record in homeRecs) {
				titles.push(record);
			}
			setOptions(titles);
		} else {
			getWeb("sites").then((response) => {
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
			const selectedLoc = records[e];
			setInfo((prev) => ({
				...prev,
				city: selectedLoc.city,
				key: selectedLoc.key,
				mapUrl: selectedLoc.mapUrl,
				name: selectedLoc.name,
				phone: selectedLoc.phone,
				region: selectedLoc.region,
				show: selectedLoc.show === null ? "false" : selectedLoc.show.toString(),
				street: selectedLoc.street,
			}));
			setNewArt((prev) => ({
				...prev,
				picked: true,
			}));
		} else {
			setInfo((prev) => ({
				...prev,
				city: "",
				key: "",
				mapUrl: "",
				name: "",
				phone: "",
				region: "",
				show: "",
				street: "",
				timestamp: "",
				user: undefined,
			}));
			setNewArt((prev) => ({
				...prev,
				picked: false,
			}));
		}
	};

	// Saves the selected or created question
	const saveQuestion = () => {
		const page = doc(db, "web", "sites");
		getDoc(page)
			.then((doc) => {
				let data = doc.data();
				console.log(data);
			})
			.catch((error) => console.error(error));
	};

	const deleteQuestion = () => {
		const page = doc(db, "web", "sites");
		getDoc(page)
			.then((doc) => {
				let data = doc.data();
				console.log(data);
			})
			.catch((error) => console.error(error));
	};

	return (
		<div style={{ margin: "10px" }}>
			<h1>Site Location Information</h1>

			<div
				style={{ display: "flex", alginItems: "center", marginBottom: "10px" }}>
				<Drop
					options={options}
					onChange={(event) => selectArticle(event.target.textContent)}
					text="Select Location to Edit"
					disabled={newArt.clicked}
					style={{ width: 200 }}
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
							Create New Location
						</Button>
						<Button
							variant="outlined"
							color="primary"
							size="medium"
							onClick={() => {
								setNewArt((prev) => ({ ...prev, delete: true }));
							}}
							style={{ marginLeft: "10px" }}>
							Delete Location
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
							Save Location
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
							Delete Location
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
						helperText={`This will overwrite any question with the key "${
							info.key === "" ? 0 : info.key
						}".`}
						label="Key"
						variant="outlined"
						style={{ marginRight: "10px" }}
					/>
				) : null}
				<TextField
					value={info.city}
					onChange={(event) =>
						setInfo((prev) => ({ ...prev, city: event.target.value }))
					}
					label="City"
					variant="outlined"
					style={{ marginRight: "10px" }}
				/>
				<TextField
					value={info.mapUrl}
					onChange={(event) =>
						setInfo((prev) => ({ ...prev, mapUrl: event.target.value }))
					}
					label="Map URL"
					variant="outlined"
					style={{ marginRight: "10px" }}
				/>
				<TextField
					value={info.name}
					onChange={(event) =>
						setInfo((prev) => ({ ...prev, name: event.target.value }))
					}
					label="Name"
					variant="outlined"
					style={{ marginRight: "10px" }}
				/>
				<TextField
					value={info.phone}
					onChange={(event) =>
						setInfo((prev) => ({ ...prev, phone: event.target.value }))
					}
					label="Phone"
					variant="outlined"
					style={{ marginRight: "10px" }}
				/>
				<TextField
					value={info.street}
					onChange={(event) =>
						setInfo((prev) => ({ ...prev, street: event.target.value }))
					}
					label="Street"
					variant="outlined"
					style={{ marginRight: "10px" }}
				/>
				<Drop
					options={["false", "true"]}
					onChange={(event) => {
						setInfo((prev) => ({
							...prev,
							show: event.target.textContent,
						}));
					}}
					text="Visibility"
					value={info.show}
					style={{ marginRight: "10px", width: 120 }}
				/>
				<Drop
					options={["west", "east", "central", "masters"]}
					onChange={(event) => {
						setInfo((prev) => ({
							...prev,
							region: event.target.textContent,
						}));
					}}
					width={120}
					text="Region"
					value={info.region}
					style={{ width: 120 }}
				/>
			</div>
		</div>
	);
}
