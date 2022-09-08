import React, { useState, useEffect } from "react";

import { read, utils, writeFileXLSX } from "xlsx";

import Button from "@mui/material/Button";
import Add from "@mui/icons-material/Add";
import DownloadDoneIcon from "@mui/icons-material/DownloadDone";
import DownloadIcon from "@mui/icons-material/Download";

import { db } from "../fire";
import { doc, getDoc, updateDoc } from "@firebase/firestore";

import { Alerts, BasicPage } from "../styledComps";

export default function AddInfo() {
	// Uploaded file
	const [file, setFile] = useState({
		data: undefined,
		name: "",
	});

	// School information to download
	const [download, setDownload] = useState(undefined);

	// Error handling
	const [errors, setErrors] = useState({
		file: false,
		options: false,
		saved: false,
		noData: false,
		upload: false,
	});

	// Loads the options object if not already loaded
	const getOptions = async () => {
		try {
			const options = doc(db, "web", "options");
			const opsDoc = await getDoc(options);
			sessionStorage.setItem("options", JSON.stringify(opsDoc.data()));
			return opsDoc.data();
		} catch (error) {
			setErrors((prev) => ({
				...prev,
				options: true,
			}));
			return undefined;
		}
	};

	useEffect(() => {
		// Gets download data
		const options = sessionStorage.getItem("options");
		if (!options) {
			getOptions().then((result) => {
				setDownload(result.school);
			});
		} else {
			setDownload(JSON.parse(options));
		}
	}, []);

	// Convert Excell data to JSON object
	const convertToJSON = (input) => {
		input.target.files[0]
			.arrayBuffer()
			.then((buffer) => {
				const file = read(buffer);
				let data = utils.sheet_to_json(file.Sheets[file.SheetNames[0]]);

				// Formatting data for proper use
				for (const school in data) {
					const current = data[school];
					const propertyNames = Object.getOwnPropertyNames(current);

					const value = propertyNames.find((propertyName) =>
						propertyName.toLowerCase().includes("id")
					);
					const label = propertyNames.find((propertyName) =>
						propertyName.toLowerCase().includes("name")
					);
					const div = propertyNames.find((propertyName) =>
						propertyName.toLowerCase().includes("division")
					);

					data[school] = {
						label: data[school][label],
						value: data[school][value],
						div: data[school][div],
					};
				}

				setFile({
					data: data,
					name: input.target.files[0].name,
				});
			})
			.catch(() => {
				setErrors((prev) => ({
					...prev,
					file: true,
				}));
			});
	};

	// Get JSON data and export as Excell file
	const downloadFile = (file) => {
		const sheet = utils.json_to_sheet(file);
		const book = utils.book_new();
		utils.book_append_sheet(book, sheet, "Data");
		writeFileXLSX(book, `schools${new Date().getTime()}.xlsx`);
	};

	// Saves the uploaded school data to the database
	const saveSchools = () => {
		if (file.data) {
			let options = download;
			options.school = file.data;

			const dbOptions = doc(db, "web", "options");
			updateDoc(dbOptions, options)
				.then(() => {
					sessionStorage.setItem("options", JSON.stringify(options));
					setErrors((prev) => ({
						...prev,
						saved: true,
					}));
				})
				.catch(() => {
					setErrors((prev) => ({
						...prev,
						saved: true,
						upload: true,
					}));
				});
		} else {
			setErrors((prev) => ({
				...prev,
				saved: true,
				noData: true,
			}));
		}
	};

	return (
		<BasicPage>
			<div style={{ marginTop: "10px" }}>
				<h1>Add/Download School Info</h1>
				<p style={{ color: "grey" }}>
					For the uploaded file, make sure the excell file has the column
					headings that contain "id", "name", and "division". Example: "School
					ID", "School Name", "2021-22 Assigned Division". If this formatting
					isn't kept, it will cause the website to malfunction.
				</p>
				<Alerts
					open={errors.saved || errors.options || errors.file}
					handleClose={() =>
						setErrors({
							file: false,
							options: false,
							saved: false,
							noData: false,
							upload: false,
						})
					}
					type={
						errors.file || errors.options || errors.noData || errors.upload
							? "error"
							: "success"
					}
					message={
						errors.saved
							? errors.noData
								? "No data was uploaded."
								: errors.upload
								? "There was an issue uploading your file, please try again."
								: "Successfully uploaded file to the database."
							: errors.file
							? "There was an error converting your file, please clear the file and reupload it to try again."
							: errors.options
							? "There was an error downloading database information, please refresh to try again."
							: "An unknown error occured."
					}
				/>
				<Button
					color={errors.file || errors.noData ? "error" : "primary"}
					variant="outlined"
					component="label"
					sx={{ marginRight: "10px", textTransform: "none" }}>
					{file.name ? (
						<>
							<DownloadDoneIcon sx={{ marginRight: "10px" }} />
							{file.name}
						</>
					) : (
						<>
							<Add sx={{ marginRight: "10px" }} /> Upload a File
						</>
					)}
					<input
						onChange={(input) => {
							convertToJSON(input);
						}}
						type="file"
						id="input"
						accept=".xls,.xlsx"
						hidden
					/>
				</Button>
				<Button
					variant="outlined"
					sx={{ marginRight: "10px", textTransform: "none" }}
					onClick={() => saveSchools()}>
					Submit
				</Button>
				<Button
					variant="outlined"
					component="label"
					sx={{ textTransform: "none" }}
					onClick={() => {
						setFile({
							data: undefined,
							name: "",
						});
						document.getElementById("input").value = "";
					}}>
					Clear File
				</Button>
			</div>
			<div style={{ marginTop: "10px" }}>
				<Button
					color={errors.options ? "error" : "primary"}
					variant="outlined"
					sx={{ marginRight: "10px", textTransform: "none" }}
					onClick={() => downloadFile(download.school)}>
					<DownloadIcon sx={{ marginRight: "10px" }} />
					Download Schools
				</Button>
			</div>
		</BasicPage>
	);
}
