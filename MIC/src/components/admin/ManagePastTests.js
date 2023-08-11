import React, { useEffect, useState } from "react";

import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import Add from "@mui/icons-material/Add";
import DownloadDoneIcon from "@mui/icons-material/DownloadDone";

import { db, auth, storage } from "../fire";
import { doc, updateDoc } from "@firebase/firestore";
import { ref, uploadBytesResumable } from "@firebase/storage";

import { Alerts, Drop, LayerOne, LayerTwo } from "../styledComps";
import getWeb from "../front/getWeb";

export default function ManagePastTests() {
	// Information of the test
	const [info, setInfo] = useState({
		description: "",
		url: "",
		gLevel: "",
		bYear: "",
		eYear: "",
		fileInfo: null,
		user: undefined,
		timestamp: "",
	});

	// Used to store the data for each article
	const [samples, setSamples] = useState(null);

	// Error handling
	const [errors, setErrors] = useState({
		file: false,
		level: false,
		description: false,
		bYear: false,
		eYear: false,
		saved: false,
		storage: false,
		firestore: false,
		success: 0,
	});

	// Storage upload progress
	const [upProg, setUpProg] = useState(0);

	const grades = ["4th", "5th", "6th", "7th", "8th", "9-10th", "11-12th"];

	useEffect(() => {
		// Gets the article data for the page
		if (!samples) {
			if (sessionStorage.getItem("samples")) {
				let homeRecs = JSON.parse(sessionStorage.getItem("samples"));
				setSamples(homeRecs);
				let titles = [];
				for (const record in homeRecs) {
					titles.push(record);
				}
			} else {
				getWeb("samples").then((response) => {
					setSamples(response);
					let titles = [];
					for (const record in response.records) {
						titles.push(record);
					}
				});
			}
		}
	}, [samples]);

	/**
	 * Allows file upload
	 *
	 * @param {File} file : PDF file for uploading
	 */
	const uploadFile = (file) => {
		if (file) {
			setInfo((prev) => ({
				...prev,
				url: file.name,
				fileInfo: file,
			}));
			setErrors((prev) => ({
				...prev,
				file: true,
			}));
		} else {
			setInfo((prev) => ({
				...prev,
				url: "",
				fileInfo: null,
			}));
			setErrors((prev) => ({
				...prev,
				file: false,
			}));
		}
	};

	// Saves the selected test to the database
	const saveTest = () => {
		if (
			errors.file &&
			errors.description &&
			errors.level &&
			errors.bYear &&
			errors.eYear
		) {
			// For user feedback
			let good = 1;

			// Uploads file to Firebase Storage
			const storeRef = ref(storage, `Past Tests/${info.url}`);
			const uploadTask = uploadBytesResumable(storeRef, info.fileInfo);

			// Monitor upload progress for feedback
			uploadTask.on(
				"state_changed",
				(snapshot) => {
					setUpProg((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
					switch (snapshot.state) {
						case "running":
							setUpProg(
								(snapshot.bytesTransferred / snapshot.totalBytes) * 100
							);
							break;
						default:
							break;
					}
				},
				(error) => {
					console.error(error);
					setErrors((prev) => ({
						...prev,
						storage: true,
					}));
				},
				() => {
					setTimeout(() => setUpProg(0), 1000);
					good += 1;
				}
			);

			console.log(samples);
			// Uploads information to Firestore to update website
			const samps = {
				n: samples.n + 1,
				records: {
					...samples.records,
					[new Date().getTime()]: {
						description: info.description,
						url: info.url,
						year: `${info.bYear}-${info.eYear.substr(2)}`,
						level: info.gLevel,
						timestamp: new Date(Date.now()),
						user: auth.currentUser.uid,
					},
				},
				timestamp: new Date(Date.now()),
			};

			const dbSamples = doc(db, "web", "samples");
			updateDoc(dbSamples, samps)
				.then(() => {
					good += 1;
					setErrors((prev) => ({
						...prev,
						success: good,
					}));
					sessionStorage.setItem("samples", JSON.stringify(samps));
				})
				.catch((error) => {
					console.error(error);
					setErrors((prev) => ({
						...prev,
						firestore: true,
					}));
				});
		} else {
			setErrors((prev) => ({
				...prev,
				saved: true,
			}));
		}
	};

	return (
		<LayerOne>
			<LayerTwo>
				<div style={{ margin: "20px" }}>
					<h1>Add Past Tests</h1>
					<Alerts
						open={
							errors.saved ||
							errors.storage ||
							errors.firestore ||
							errors.success === 3
						}
						handleClose={() =>
							setErrors((prev) => ({
								...prev,
								saved: false,
								storage: false,
								firestore: false,
								success: 0,
							}))
						}
						type={errors.success === 3 ? "success" : "error"}
						message={
							errors.success === 3
								? "File uploaded to storage and database successfully."
								: errors.saved
								? "Please make sure every field is properly filled in."
								: errors.storage
								? "There was an issue uploading file to Firebase Storage."
								: errors.firestore
								? "There was an issue uploading to Firebase Firestore."
								: "An unkown error occured."
						}
					/>
					<p style={{ color: "grey" }}>
						Click the "Clear File" button before adding a new file. If you
						don't, it will overwrite the previous submission, even if you select
						another file to upload.
					</p>
					<div
						style={{
							display: "flex",
							alginItems: "center",
							marginBottom: "10px",
						}}>
						<Button
							color={
								errors.saved ? (!errors.file ? "error" : "primary") : "primary"
							}
							variant="outlined"
							component="label"
							sx={{ marginRight: "10px", textTransform: "none" }}>
							{info.url ? (
								<>
									<DownloadDoneIcon sx={{ marginRight: "10px" }} />
									{info.url}
								</>
							) : (
								<>
									<Add sx={{ marginRight: "10px" }} /> Upload a File
								</>
							)}
							<input
								id="file-input"
								type="file"
								accept=".pdf"
								onChange={(event) => uploadFile(event.target.files[0])}
								hidden
							/>
						</Button>

						<Button
							variant="outlined"
							color="primary"
							size="medium"
							sx={{ marginRight: "10px", textTransform: "none" }}
							onClick={saveTest}>
							{upProg > 0 ? (
								<Box sx={{ position: "relative", display: "inline-flex" }}>
									<CircularProgress variant="determinate" />
									<Box
										sx={{
											top: 0,
											left: 0,
											bottom: 0,
											right: 0,
											position: "absolute",
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
										}}>
										<Typography
											variant="caption"
											component="div"
											color="text.secondary">{`${Math.round(
											upProg
										)}%`}</Typography>
									</Box>
								</Box>
							) : (
								"Save Article"
							)}
						</Button>
						<Button
							variant="outlined"
							component="label"
							sx={{ textTransform: "none" }}
							onClick={() => {
								uploadFile(undefined);
								document.getElementById("file-input").value = "";
								setInfo({
									description: "",
									url: "",
									gLevel: "",
									bYear: "",
									eYear: "",
									fileInfo: null,
									user: undefined,
									timestamp: "",
								});
							}}>
							Clear File
						</Button>
					</div>
					<Grid container>
						<Drop
							error={errors.saved ? !errors.level : false}
							options={grades}
							onChange={(event) => {
								setInfo((prev) => ({
									...prev,
									gLevel: event.target.textContent,
								}));
								event.target.textContent.length > 0
									? setErrors((prev) => ({
											...prev,
											level: true,
									  }))
									: setErrors((prev) => ({
											...prev,
											level: false,
									  }));
							}}
							style={{ width: 200 }}
							text="Grade Level"
							value={info.gLevel}
						/>
						<TextField
							error={errors.saved ? !errors.description : false}
							value={info.description}
							onChange={(event) => {
								setInfo((prev) => ({
									...prev,
									description: event.target.value,
								}));
								event.target.value.length > 0
									? setErrors((prev) => ({
											...prev,
											description: true,
									  }))
									: setErrors((prev) => ({
											...prev,
											description: false,
									  }));
							}}
							label="Description"
							variant="outlined"
							style={{ marginLeft: "10px" }}
							helperText="E.g., Champs"
						/>
						<TextField
							error={errors.saved ? !errors.bYear : false}
							value={info.bYear}
							onChange={(event) => {
								setInfo((prev) => ({
									...prev,
									bYear: event.target.value
										.replace(/[^\d,]+/g, "")
										.substring(0, 4),
								}));
								event.target.value.length === 4
									? setErrors((prev) => ({
											...prev,
											bYear: true,
									  }))
									: setErrors((prev) => ({
											...prev,
											bYear: false,
									  }));
							}}
							label="Beginning Year"
							variant="outlined"
							style={{ marginLeft: "10px", marginRight: "10px" }}
							helperText="E.g.: If school year was 2021-2022, then 2021."
						/>
						<TextField
							error={errors.saved ? !errors.eYear : false}
							value={info.eYear}
							onChange={(event) => {
								setInfo((prev) => ({
									...prev,
									eYear: event.target.value
										.replace(/[^\d,]+/g, "")
										.substring(0, 4),
								}));
								event.target.value.length === 4
									? setErrors((prev) => ({
											...prev,
											eYear: true,
									  }))
									: setErrors((prev) => ({
											...prev,
											eYear: false,
									  }));
							}}
							label="Ending Year"
							variant="outlined"
							style={{ marginRight: "10px" }}
							helperText="E.g.: If school year was 2021-2022, then 2022."
						/>
					</Grid>
				</div>
			</LayerTwo>
		</LayerOne>
	);
}
