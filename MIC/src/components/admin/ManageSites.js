import React, { useEffect, useState } from "react";

import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

import { db, auth } from "../fire";
import { doc, getDoc, updateDoc } from "@firebase/firestore";

import { Drop, Alerts } from "../styledComps";
import getWeb from "../front/getWeb";

export default function ManageSites() {
	// Information of the site selected/created
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

	// Error handling
	const [errors, setErrors] = useState({
		key: false,
		city: false,
		mapUrl: false,
		name: false,
		region: false,
		show: false,
		street: false,
		failed: false,
		submitted: false,
		error: false,
		success: false,
		delete: false,
		get: false,
	});

	// Used to store the data for all sites
	const [records, setRecords] = useState([]);

	// Used to store the keys of the sites that can be selected
	const [options, setOptions] = useState([]);

	// Used to tell what options for modifying sites have been selected
	const [newArt, setNewArt] = useState({
		picked: false,
		clicked: false,
		delete: false,
	});

	// Selected location
	const [selected, setSelected] = useState("");

	useEffect(() => {
		// Gets the site data for the page
		if (sessionStorage.getItem("sites")) {
			let homeRecs = JSON.parse(sessionStorage.getItem("sites")).records;
			setRecords(homeRecs);
			let titles = [];
			for (const record in homeRecs) {
				titles.push(record);
			}
			titles.sort();
			setOptions(titles);
		} else {
			getWeb("sites").then((response) => {
				setRecords(response.records);
				let titles = [];
				for (const record in response.records) {
					titles.push(record);
				}
				titles.sort();
				setOptions(titles);
			});
		}
	}, []);

	/**
	 * Object comparison function
	 * From: https://stackoverflow.com/a/5859028
	 *
	 * @param {object} obj1 : object to compare
	 * @param {object} obj2 : object to compare
	 * @returns {boolean} : whether the objects are equal
	 */
	const compare = (obj1, obj2) => {
		for (let prop in obj1) {
			if (obj1.hasOwnProperty(prop)) {
				if (obj1[prop] !== obj2[prop]) {
					return false;
				}
			}
		}
		for (let prop in obj2) {
			if (obj2.hasOwnProperty(prop)) {
				if (obj1[prop] !== obj2[prop]) {
					return false;
				}
			}
		}
		return true;
	};

	/**
	 * Handles the data filling upon selecting a site
	 *
	 * @param {string} e : ID of the site selected
	 */
	const selectSite = (e) => {
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
			setErrors((prev) => ({
				...prev,
				key: true,
				city: true,
				mapUrl: true,
				name: true,
				region: true,
				show: true,
				street: true,
			}));
			setSelected(e);
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
			setErrors((prev) => ({
				...prev,
				key: false,
				city: false,
				mapUrl: false,
				name: false,
				region: false,
				show: false,
				street: false,
			}));
			setNewArt((prev) => ({
				...prev,
				picked: false,
			}));
			setSelected("");
		}
	};

	// Saves the selected or created site to the database
	const saveSite = () => {
		if (
			errors.key &&
			errors.city &&
			errors.mapUrl &&
			errors.name &&
			errors.region &&
			errors.show &&
			errors.street
		) {
			const page = doc(db, "web", "sites");
			const ops = doc(db, "web", "options");
			getDoc(page)
				.then((doc) => {
					let data = doc.data();

					let site = {
						...info,
						timestamp: new Date(Date.now()),
						user: auth.currentUser.uid,
					};

					if (newArt.clicked) {
						// If a new site is being added
						if (!compare(data.records, records)) {
							data.n++;
						}
						data.timestamp = new Date(Date.now());
						data.records[site.key] = site;
					} else if (newArt.picked) {
						// If an old site is being updated
						data.records[site.key] = site;
						data.timestamp = new Date(Date.now());
					}

					// Getting options to update options
					let optionsSites = JSON.parse(sessionStorage.getItem("options"));

					// Checking if the submitted site is already an option
					let included = false;
					for (const option of optionsSites.locations) {
						if (option.value === site.name) {
							included = true;
						}
					}

					// If it is a new location, add it
					if (!included && /^(true|1)$/i.test(site.show)) {
						optionsSites.locations = [
							...optionsSites.locations,
							{ label: site.name, value: site.name },
						];

						// Sort alphabetically by name
						optionsSites.locations.sort((a, b) => {
							const aVal = a.value.toLowerCase(),
								bVal = b.value.toLowerCase();
							if (aVal < bVal) {
								return -1;
							}
							if (aVal > bVal) {
								return 1;
							}
							return 0;
						});

						updateDoc(ops, optionsSites)
							.then(() => {
								sessionStorage.setItem("options", JSON.stringify(optionsSites));
							})
							.catch((err) => console.log(err));
					} else if (!/^(true|1)$/i.test(site.show)) {
						// Removing option, if the site was set to invisible
						optionsSites.locations = optionsSites.locations.filter((value) => {
							return value.value !== site.name;
						});

						updateDoc(ops, optionsSites)
							.then(() => {
								sessionStorage.setItem("options", JSON.stringify(optionsSites));
							})
							.catch((err) => console.log(err));
					}

					updateDoc(page, data)
						.then(() => {
							sessionStorage.setItem("sites", JSON.stringify(data));
							setErrors((prev) => ({
								...prev,
								submitted: true,
								success: true,
							}));

							if (!options.includes(info.key)) {
								let tempOps = options;
								tempOps.push(info.key);
								tempOps.sort();
								setOptions(tempOps);
							}

							setRecords((prev) => ({
								...prev,
								[info.key]: info,
							}));

							setInfo({
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

							setSelected("");
						})
						.catch(() => {
							setErrors((prev) => ({
								...prev,
								submitted: true,
								error: true,
							}));
						});
				})
				.catch(() => {
					setErrors((prev) => ({
						...prev,
						submitted: true,
						get: true,
					}));
				});
		} else {
			setErrors((prev) => ({
				...prev,
				failed: true,
			}));
		}
	};

	// Deletes the selected site from the database
	const deleteSite = () => {
		if (
			errors.key &&
			errors.city &&
			errors.mapUrl &&
			errors.name &&
			errors.region &&
			errors.show &&
			errors.street
		) {
			const page = doc(db, "web", "sites");
			const ops = doc(db, "web", "options");
			getDoc(page)
				.then((doc) => {
					let data = doc.data();
					delete data.records[info.key];
					data.n--;
					data.timestamp = new Date(Date.now());

					// Getting options to update options
					let optionsSites = JSON.parse(sessionStorage.getItem("options"));

					// Removing option
					optionsSites.locations = optionsSites.locations.filter((value) => {
						return value.value !== info.name;
					});

					updateDoc(ops, optionsSites)
						.then(() => {
							sessionStorage.setItem("options", JSON.stringify(optionsSites));
						})
						.catch((err) => console.log(err));

					updateDoc(page, data).then(() => {
						sessionStorage.setItem("sites", JSON.stringify(data));
						setErrors((prev) => ({
							...prev,
							submitted: true,
							delete: true,
						}));

						delete records[info.key];

						const newOps = options.filter((value) => {
							return value !== info.key;
						});

						setOptions(newOps);

						setInfo({
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

						setSelected("");
					});
				})
				.catch(() =>
					setErrors((prev) => ({
						...prev,
						submitted: true,
						get: true,
					}))
				);
		} else {
			setErrors((prev) => ({
				...prev,
				failed: true,
			}));
		}
	};

	return (
		<div style={{ margin: "10px" }}>
			<h1>Site Location Information</h1>
			<Alerts
				open={errors.failed || errors.submitted}
				handleClose={() =>
					setErrors((prev) => ({
						...prev,
						submitted: false,
						get: false,
						error: false,
						failed: false,
						success: false,
						delete: false,
					}))
				}
				type={errors.success || errors.delete ? "success" : "error"}
				message={
					errors.submitted
						? errors.get
							? "Failed to retrieve site information. Please try again."
							: errors.error
							? "Failed to update the database. Please try again."
							: errors.success
							? "Successfully added site to the database."
							: errors.delete
							? "Successfully deleted the site from the database."
							: "test"
						: errors.failed
						? "Fields aren't appropriately filled out."
						: "Unknown error occurred. Please try again."
				}
			/>
			<div
				style={{ display: "flex", alginItems: "center", marginBottom: "10px" }}>
				<Drop
					options={options}
					onChange={(event) => selectSite(event.target.textContent)}
					text="Select Location to Edit"
					disabled={newArt.clicked}
					style={{ width: 200 }}
					value={selected}
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
							onClick={saveSite}
							style={{ marginLeft: "10px" }}>
							Save Location
						</Button>
						{!newArt.picked ? (
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
						) : null}
					</>
				) : (
					<>
						<Button
							variant="outlined"
							color="primary"
							size="medium"
							onClick={deleteSite}
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
									picked: false,
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
			<p style={{ color: "grey" }}>
				The site name will be added to the list if it is a new location and is
				visible, and will be removed if it is set to invisible/deleted.
			</p>
			<div
				style={{ display: "flex", alginItems: "center", marginBottom: "10px" }}>
				{newArt.clicked ? (
					<TextField
						value={info.key}
						onChange={(event) => {
							setInfo((prev) => ({ ...prev, key: event.target.value }));
							event.target.value.length > 0
								? setErrors((prev) => ({ ...prev, key: true }))
								: setErrors((prev) => ({ ...prev, key: false }));
						}}
						helperText={`This will overwrite any site with the key "${
							info.key === "" ? 0 : info.key
						}". Key example: auburn.`}
						label="Key"
						variant="outlined"
						style={{ marginRight: "10px" }}
						error={errors.failed && !errors.key}
					/>
				) : null}
				<TextField
					value={info.city}
					onChange={(event) => {
						setInfo((prev) => ({ ...prev, city: event.target.value }));
						event.target.value.length > 0
							? setErrors((prev) => ({ ...prev, city: true }))
							: setErrors((prev) => ({ ...prev, city: false }));
					}}
					label="City"
					variant="outlined"
					style={{ marginRight: "10px" }}
					error={errors.failed && !errors.city}
				/>
				<TextField
					value={info.mapUrl}
					onChange={(event) => {
						setInfo((prev) => ({ ...prev, mapUrl: event.target.value }));
						event.target.value.length > 0
							? setErrors((prev) => ({ ...prev, mapUrl: true }))
							: setErrors((prev) => ({ ...prev, mapUrl: false }));
					}}
					label="Map URL"
					variant="outlined"
					style={{ marginRight: "10px" }}
					error={errors.failed && !errors.mapUrl}
				/>
				<TextField
					value={info.name}
					onChange={(event) => {
						setInfo((prev) => ({ ...prev, name: event.target.value }));
						event.target.value.length > 0
							? setErrors((prev) => ({ ...prev, name: true }))
							: setErrors((prev) => ({ ...prev, name: false }));
					}}
					label="Name"
					variant="outlined"
					style={{ marginRight: "10px" }}
					error={errors.failed && !errors.name}
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
					onChange={(event) => {
						setInfo((prev) => ({ ...prev, street: event.target.value }));
						event.target.value.length > 0
							? setErrors((prev) => ({ ...prev, street: true }))
							: setErrors((prev) => ({ ...prev, street: false }));
					}}
					label="Street"
					variant="outlined"
					style={{ marginRight: "10px" }}
					error={errors.failed && !errors.street}
				/>
				<Drop
					options={["false", "true"]}
					onChange={(event) => {
						setInfo((prev) => ({
							...prev,
							show: event.target.textContent,
						}));
						event.target.textContent.length > 0
							? setErrors((prev) => ({ ...prev, show: true }))
							: setErrors((prev) => ({ ...prev, show: false }));
					}}
					text="Visibility"
					value={info.show}
					style={{ marginRight: "10px", width: 120 }}
					error={errors.failed && !errors.show}
				/>
				<Drop
					options={["west", "east", "central", "masters"]}
					onChange={(event) => {
						setInfo((prev) => ({
							...prev,
							region: event.target.textContent,
						}));
						event.target.textContent.length > 0
							? setErrors((prev) => ({ ...prev, region: true }))
							: setErrors((prev) => ({ ...prev, region: false }));
					}}
					text="Region"
					value={info.region}
					style={{ width: 120 }}
					error={errors.failed && !errors.region}
				/>
			</div>
		</div>
	);
}
