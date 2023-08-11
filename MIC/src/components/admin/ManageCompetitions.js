import React, { useState, useEffect, useCallback } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

import { DataGrid } from "@mui/x-data-grid";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import { Drop, Alerts, LayerOne, LayerTwo } from "../styledComps";

import {
	getDocs,
	collection,
	doc,
	addDoc,
	deleteDoc,
	updateDoc,
} from "@firebase/firestore";
import { db, auth } from "../fire";

import getOptions from "../getOptions";

export default function ManageCompetitions() {
	const history = useHistory();

	// columns for the table
	const columns = [
		{
			field: "id",
			headerName: "ID",
			description: "ID",
			flex: 1,
			hide: true,
			editable: false,
		},
		{
			field: "site",
			headerName: "Location",
			description: "Location",
			flex: 1,
			editable: false,
		},
		{
			field: "grade",
			headerName: "Level",
			description: "Grade Level",
			flex: 1,
			editable: false,
		},
		{
			field: "compDate",
			headerName: "Date",
			description: "Competition date.",
			flex: 1,
			editable: false,
			type: "date",
		},
		{
			field: "status",
			headerName: "Status",
			description: "Status",
			flex: 1,
			editable: false,
		},
		{
			field: "note",
			headerName: `Director's  Notes`,
			description: `Director's  Notes`,
			flex: 1,
			editable: false,
		},
	];

	// Options for selection
	const [options, setOptions] = useState(
		JSON.parse(sessionStorage.getItem("options"))
	);

	/**
	 * Formats competitions for the table
	 *
	 * @param {array} comps : list of competitions found
	 * @returns {array} : formatted version of the competitions for the page
	 */
	const formatComps = useCallback(
		(comps) => {
			if (comps !== undefined && comps !== null) {
				comps.forEach((comp, index) => {
					comp.site = comp.site.replace(/\w\S*/g, (w) =>
						w.replace(/^\w/, (c) => c.toUpperCase())
					);
					let grades = [];
					for (const item in options.level) {
						for (const char in comp.grade.substr(1)) {
							if (options.level[item].value === comp.grade.substr(1)[char]) {
								grades.push(options.level[item].label);
								break;
							}
						}
					}
					let grade =
						grades.length > 2 ? grades.join(", ") : grades.join(" and ");
					grade =
						grades.length > 2
							? grade.substring(0, grade.lastIndexOf(", ")) +
							  ", and " +
							  grade.substring(grade.lastIndexOf(", ") + 2, grade.length)
							: grade;

					comp.id = index;
					comp.level = grade;
					comp.date = new Date(comp.compDate);
					comp.mapurl = comp.mapURL;
				});
				return comps;
			} else {
				return [];
			}
		},
		[options.level]
	);

	/**
	 * Gets the competition ids (non-numeric)
	 *
	 * @param {array} comps : list of competitions found
	 * @returns {array} : all competition IDs
	 */
	const getCompIds = (comps) => {
		let tempIds = [];
		comps.forEach((doc) => {
			tempIds.push(doc.compId);
		});
		
		return tempIds;
	};

	// current copmetitions
	const [rowState, setRow] = useState({
		comp: [],
		loading: true,
	});

	// Selected competition info
	const [rowInfo, setRowInfo] = useState({
		comps: [],
		pairs: [],
		row: [],
		comp: "",
	});

	// data from user input
	const [newComp, setComp] = useState({
		compDate: "",
		contact: "",
		email: "",
		grade: "",
		level: "",
		mapurl: "",
		maxTeams: "",
		regDate: "",
		registration: {},
		schTeams: "",
		schedule: "",
		site: "",
		status: "",
		timestamp: "",
		user: "",
		year: "",
		note: "",
	});

	// Used to tell what options for modifying articles have been selected
	const [newArt, setNewArt] = useState({
		picked: false,
		clicked: false,
		delete: false,
	});

	// Error handling
	const [errors, setErrors] = useState({
		compDate: false,
		contact: false,
		email: false,
		grade: false,
		level: false,
		maxTeams: false,
		regDate: false,
		schTeams: false,
		schedule: false,
		site: false,
		status: false,
		year: false,
		// Checks if a submission was made
		submitted: false,
		// Checks for complete form
		notFull: false,
		// Checks if a competition to delete was not selected
		deleteError: false,
		// Used for passing information to be used in alerts
		extraInfo: "",
		// Issue with adding/updating competition in database
		upload: false,
		// If delete was initiated
		delete: false,
		// Successful deletion
		deleteSucc: false,
		// Failure to delete
		deleteErr: false,
	});

	//gets every compeition currently available
	const getComps = async () => {
		try {
			//getting all competitions
			const comps = await getDocs(collection(db, "competitions"));

			//creating an Array version of the competions
			let competitions = [];
			comps.forEach((doc) => {
				competitions.push({
					...doc.data(),
					compId: doc.id,
				});
			});

			//prevents the need for multiple reads in one session
			sessionStorage.setItem("mastersComps", JSON.stringify(competitions));

			return competitions;
		} catch (error) {
			return error;
		}
	};

	//gets the competitions to mark
	useEffect(() => {
		if (options === null) {
			getOptions(setOptions);
		}

		if (Array.isArray(rowState.comp) && rowState.comp.length === 0) {
			getComps()
				.then((result) => {
					let formedComps = formatComps(result)
					setRow((prev) => ({
						...prev,
						comp: formedComps,
						loading: false,
					}));
					setComp((prev) => ({
						...prev,
						id: result.length,
					}));

					let comps = getCompIds(result);
					let pairs = comps.map(id => {
						let comp = selectComp(id, formedComps);
						return {
							id: id,
							key: `${comp.site}-${comp.grade}`
						}
					})

					let newComps = pairs.map(pair => {
						return pair.key;
					})

					sessionStorage.setItem("pairs", JSON.stringify(pairs));

					setRowInfo((prev) => ({
						...prev,
						comps: newComps,
						pairs: pairs,
					}));
				})
				.catch((error) => console.error(error));
		} else if (rowState.loading) {
			setRow((prev) => ({
				...prev,
				loading: false,
			}));
		}
	}, [rowState.comp, rowState.loading, formatComps, options]);

	/**
	 * Used to select the selected competition by its competition ID
	 *
	 * @param {string} id : The ID of the competition selected
	 * @param {array} comps : list of competitions found
	 * @returns {object} : row state of the table with the competition selected
	 */
	const selectComp = (id, comps) => {
		let temp = null;
		Object.values(comps).forEach((comp) => {
			if (comp.compId === id) {
				temp = comp;
			}
		});

		// If the mapurl is undefined, define it
		if (temp && !temp.mapurl) {
			temp.mapurl = "";
		}
		return { ...temp, id: 0 };
	};

	/**
	 * Gets the competition ID based on its key in the rowInfo.pairs 
	 * @param {string} key : key for the ID of the competition
	 * @returns {string} : competition ID of selected competition
	 */
	const getID = (key) => {
		for(let pair of rowInfo.pairs) {
			if (pair.key === key) {
				return pair.id;
			}
		}
		return "";
	}

	/**
	 * Used when selecting a competition to edit/delete
	 *
	 * @param {string} comp : ID of the competition selected
	 */
	const onSelect = (comp) => {
		if (comp) {
			let id = getID(comp);
			const newComp = selectComp(id, rowState.comp);
			setRowInfo((prev) => ({
				...prev,
				row: [{ ...newComp, grade: newComp.grade.substr(1) }],
				comp: comp,
			}));
			setComp((prev) => ({
				...prev,
				...newComp,
				compDate: new Date(newComp.compDate),
				regDate: new Date(newComp.regDate),
			}));
			setNewArt((prev) => ({
				...prev,
				picked: true,
			}));

			// Set errors accordingly
			let tempErrors = errors;
			Object.keys(tempErrors).forEach((val) => (tempErrors[val] = true));
			tempErrors.submitted = false;
			tempErrors.notFull = false;
			tempErrors.extraInfo = false;
			tempErrors.upload = false;
			tempErrors.delete = false;
			tempErrors.deleteSucc = false;
			tempErrors.deleteErr = false;
			tempErrors.deleteError = false;
			setErrors(tempErrors);
		}
	};

	// Used to clear the input fields when needed
	const onClear = () => {
		setComp({
			compDate: null,
			contact: "",
			email: "",
			grade: "",
			level: "",
			mapurl: "",
			maxTeams: "",
			regDate: null,
			registration: {},
			schTeams: "",
			schedule: "",
			site: "",
			status: "",
			timestamp: "",
			user: "",
			year: "",
			note: "",
		});
		setRowInfo((prev) => ({
			...prev,
			row: [],
			comp: "",
		}));
		setNewArt({
			clicked: false,
			deleted: false,
			picked: false,
		});
	};

	// Clears all error values
	const clearErrors = () => {
		// Set all errors to false
		let tempErrors = errors;
		Object.keys(tempErrors).forEach((val) => (tempErrors[val] = false));
		setErrors(tempErrors);
	};

	// Adds/modifies a competition to/in the database
	const onSubmit = async () => {
		// If no errors submit
		if (
			Object.keys(errors)
				.filter(
					(key) =>
						key !== "submitted" &&
						key !== "notFull" &&
						key !== "deleteError" &&
						key !== "extraInfo" &&
						key !== "upload" &&
						key !== "deleteSucc" &&
						key !== "deleteErr" &&
						key !== "delete"
				)
				.map((key) => errors[key])
				.every((value) => value)
		) {
			// Creating payload
			let comp = {
				compDate: newComp.compDate.toLocaleString("en-US").split(",")[0],
				contact: newComp.contact,
				email: newComp.email,
				grade: newComp.grade,
				maxTeams: Number(newComp.maxTeams),
				regDate: newComp.regDate.toLocaleString("en-US").split(",")[0],
				registration: {},
				schTeams: Number(newComp.schTeams),
				schedule: newComp.schedule,
				site: newComp.site,
				status: newComp.status,
				year: newComp.year,
				mapurl: newComp.mapurl === undefined ? "" : newComp.mapurl,
				timestamp: new Date(Date.now()),
				user: auth.currentUser.uid,
				note: newComp.note,
			};

			// Adding new competition to database
			if (!newComp.compId) {
				// Getting the competition reference
				const page = collection(db, "competitions");

				// Adding new competition to database
				await addDoc(page, comp)
					.then((val) => {
						// Feedback for new competition
						setErrors((prev) => ({
							...prev,
							extraInfo:
								"Competition added with ID: " + val.id + " in the database.",
							submitted: true,
						}));

						// Updating/adding question to local records
						setRowInfo((prev) => ({
							...prev,
							comps: [...prev.comps, val.id],
						}));

						// Add competition id to object
						comp.compId = val.id;

						// Adding competition information to list
						let newComps = [...rowState.comp, comp];

						// Adding information to session information
						sessionStorage.setItem("mastersComps", JSON.stringify(newComps));
						setRow((prev) => ({
							...prev,
							comp: newComps,
						}));
					})
					.catch(() => {
						setErrors((prev) => ({
							...prev,
							upload: true,
							submitted: true,
						}));
					});
				// Updating competition
			} else {
				// Getting competition
				const upComp = doc(db, "competitions", newComp.compId);
				await updateDoc(upComp, comp)
					.then(() => {
						setErrors((prev) => ({
							...prev,
							extraInfo: `Updated competition with name: ${newComp.site}-${newComp.grade}.`,
							submitted: true,
						}));

						// Add competition id to object
						comp.compId = newComp.compId;

						// Adding competition information to list
						let newComps = rowState.comp;

						newComps.forEach((_, index) => {
							if (newComps[index].compId === comp.compId) {
								newComps[index] = comp;
							}
						});

						// Adding information to session information
						sessionStorage.setItem("mastersComps", JSON.stringify(newComps));
						setRow((prev) => ({
							...prev,
							comp: newComps,
						}));
					})
					.catch(() => {
						setErrors((prev) => ({
							...prev,
							upload: true,
							submitted: true,
						}));
					});
			}
		} else {
			setErrors((prev) => ({
				...prev,
				notFull: true,
				submitted: true,
			}));
		}
	};

	// Deletes the selected competions from the database
	const onDelete = async () => {
		if (newComp.compId) {
			await deleteDoc(doc(db, "competitions", newComp.compId))
				.then(() => {
					// Removing competition information to list
					let newComps = rowState.comp;

					newComps.filter((comp) => {
						return comp.compId === newComp.compId ? false : true;
					});

					setRow(newComps);
					sessionStorage.setItem("mastersComps", JSON.stringify(newComps));
					setErrors((prev) => ({
						...prev,
						delete: true,
						deleteSucc: true,
					}));
					onClear();
				})
				.catch(() => {
					setErrors((prev) => ({
						...prev,
						delete: true,
						deleteErr: true,
					}));
				});
		} else {
			setErrors((prev) => ({
				...prev,
				delete: true,
				deleteError: true,
			}));
		}
	};

	/**
	 * Gets the alert message
	 *
	 * @param {object} errors : object containing all the error checks
	 * @returns {string} : alert message associated with the error checks set
	 */
	const getMessage = (errors) => {
		if (errors.submitted) {
			if (errors.notFull) {
				return "Please fill out all required fields to successfully submit a competition.";
			} else if (errors.upload) {
				return "There was an issue uploading the competition to the database.";
			} else if (errors.extraInfo.length !== 0) {
				return errors.extraInfo;
			} else {
				return "Submitted successfully.";
			}
		} else if (errors.delete) {
			if (errors.deleteSucc) {
				return "Successfully deleted competition.";
			} else if (errors.deleteErr) {
				return "There was an error trying to delete the selected competition.";
			} else if (errors.deleteError) {
				return "Please select a competition to delete.";
			} else {
				return "Unknown behavior error.";
			}
		} else {
			return "Unkown behavior error.";
		}
	};

	const viewNames = () => {
		history.push({
			pathname: "/admin/manage-comps/view-names",
			state: { reg: newComp.registration, name: rowInfo.comp }
		})
	}

	return (
		<LayerOne>
			<LayerTwo>
				<div style={{ margin: "10px" }}>
					<h1>Manage Competitions</h1>
					<Alerts
						open={errors.submitted || errors.delete}
						handleClose={() => {
							clearErrors();
							onClear();
						}}
						type={
							errors.submitted
								? errors.notFull
									? "error"
									: errors.upload
									? "error"
									: "success"
								: errors.deleteError || errors.deleteErr
								? "error"
								: "success"
						}
						message={getMessage(errors)}
					/>
					<div style={{ display: "flex", marginBottom: "10px" }}>
						<Drop
							options={rowInfo.comps}
							onChange={(e) => {
								onSelect(e.target.textContent);
								if (e.target.textContent === "") {
									onClear();
									clearErrors();
								}
							}}
							text="Select Competition"
							value={rowInfo.comp}
							style={{ width: "223px" }}
							disabled={newArt.clicked}
							helperText="Please click on an option."
						/>
						{!newArt.picked && !newArt.clicked && !newArt.delete ? (
							<>
								<Button
									variant="outlined"
									color="primary"
									size="medium"
									onClick={() => {
										setNewArt((prev) => ({ ...prev, clicked: true }));
										// onClear();
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
									onClick={onSubmit}
									style={{ marginLeft: "10px" }}>
									Save Article
								</Button>
								<Button
									variant="outlined"
									color="primary"
									size="medium"
									onClick={() => {
										viewNames()
									}}
									style={{ marginLeft: "10px" }}>
									View Names
								</Button>
								{!newArt.picked ? (
									<Button
										variant="outlined"
										color="primary"
										size="medium"
										onClick={() => onClear()}
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
									onClick={() => onDelete()}
									style={{ marginLeft: "10px" }}>
									Delete Article
								</Button>
								<Button
									variant="outlined"
									color="primary"
									size="medium"
									onClick={() => onClear()}
									style={{ marginLeft: "10px" }}>
									Undo Option
								</Button>
							</>
						)}
					</div>

					<DataGrid
						autoHeight
						hideFooter
						columns={columns}
						rows={rowInfo.row}
					/>

					<div style={{ display: "flex", flexDirection: "column", marginTop: "10px" }}>
						<Grid container>
							<Grid item sm={2}>
								<TextField
									sx={{ marginBottom: "10px" }}
									label="Contact"
									value={newComp.contact}
									onChange={(e) => {
										setComp({ ...newComp, contact: e.target.value });
										setErrors((prev) => ({
											...prev,
											contact: !!e.target.value,
											submitted: false,
										}));
									}}
									error={errors.submitted ? !errors.contact : false}
								/>
								<TextField
									sx={{ marginBottom: "10px" }}
									label="Contact Email"
									value={newComp.email}
									onChange={(e) => {
										setComp({ ...newComp, email: e.target.value });
										setErrors((prev) => ({
											...prev,
											email: !!e.target.value,
											submitted: false,
										}));
									}}
									error={errors.submitted ? !errors.email : false}
								/>
								<DatePicker
									label="Competition Date"
									views={["month","day","year"]}
									value={new Date(newComp.compDate)}
									onChange={(newValue) => {
										if (newValue !== null) {
											setComp({ ...newComp, compDate: newValue });
											setErrors((prev) => ({
												...prev,
												compDate: true,
												submitted: false,
											}));
										} else {
											setErrors((prev) => ({
												...prev,
												compDate: false,
												submitted: false,
											}));
										}
									}}
									error={errors.submitted ? !errors.compDate : false}
									slotProps={{
										textField: {
											helperText: errors.compDate ? "Please fill out to continue." : null,
											error: errors.submitted ? !errors.compDate : false
										}
									}}
								/>
							</Grid>
							<Grid item sm={2}>
								<TextField
									sx={{ marginBottom: "10px" }}
									label="Max Teams per School"
									value={newComp.schTeams}
									onChange={(e) => {
										setComp({
											...newComp,
											schTeams: e.target.value.replace(/[^\d,]+/g, ""),
										});
										setErrors((prev) => ({
											...prev,
											schTeams: !!e.target.value,
											submitted: false,
										}));
									}}
									error={errors.submitted ? !errors.schTeams : false}
								/>
								<TextField
									sx={{ marginBottom: "10px" }}
									label="Max Teams"
									value={newComp.maxTeams}
									onChange={(e) => {
										setComp({
											...newComp,
											maxTeams: e.target.value.replace(/[^\d,]+/g, ""),
										});
										setErrors((prev) => ({
											...prev,
											maxTeams: !!e.target.value,
											submitted: false,
										}));
									}}
									error={errors.submitted ? !errors.maxTeams : false}
								/>
								<DatePicker
									label="Registration Deadline"
									views={["month","day","year"]}
									value={new Date(newComp.regDate)}
									onChange={(newValue) => {
										if (newValue !== null) {
											setComp({ ...newComp, regDate: newValue });
											setErrors((prev) => ({
												...prev,
												regDate: true,
												submitted: false,
											}));
										} else {
											setErrors((prev) => ({
												...prev,
												regDate: false,
												submitted: false,
											}));
										}
									}}
									error={errors.submitted ? !errors.compDate : false}
									slotProps={{
										textField: {
											helperText: errors.regDate ? "Please fill out to continue." : null,
											error: errors.submitted ? !errors.regDate : false
										}
									}}
								/>
							</Grid>
							<Grid item sm={2}>
								<TextField
									label="Year"
									value={newComp.year}
									onChange={(e) => {
										setComp({ ...newComp, year: e.target.value });
										setErrors((prev) => ({
											...prev,
											year: !!e.target.value,
											submitted: false,
										}));
									}}
									error={errors.submitted ? !errors.year : false}
								/>
								<Autocomplete
									options={[
										"reg",
										"pre",
										"names",
										"closed",
										"masters",
										"archive",
									]}
									onChange={(_, newValue) => {
										setComp({ ...newComp, status: newValue });
										setErrors((prev) => ({
											...prev,
											status: !!newValue,
											submitted: false,
										}));
									}}
									value={newComp.status}
									freeSolo
									sx={{
										width: "210px",
										marginBottom: "10px",
									}}
									renderInput={(params) => (
										<TextField
											{...params}
											error={errors.submitted ? !errors.status : false}
											label="Registration Status"
											variant="outlined"
											required
										/>
									)}
								/>
								<Autocomplete
									options={options ? options.level ? options.level : [] : []}
									onChange={(_, newValue) => {
										if (newValue !== null) {
											setComp({
												...newComp,
												level: newValue,
												grade: `G${newValue.value}`,
											});
											setErrors((prev) => ({
												...prev,
												level: true,
												grade: true,
												submitted: false,
											}));
										} else {
											setComp({
												...newComp,
												level: "",
												grade: "",
											});
											setErrors((prev) => ({
												...prev,
												level: false,
												grade: false,
												submitted: false,
											}));
										}
									}}
									value={
										// typeof newComp.level === "string" ? "" : newComp.level.label
										newComp.level
									}
									freeSolo
									sx={{
										width: "210px",
										marginBottom: "10px",
									}}
									renderInput={(params) => (
										<TextField
											{...params}
											error={errors.submitted ? !errors.level : false}
											label="Grade"
											variant="outlined"
											required
										/>
									)}
								/>
								<Autocomplete
									options={options ? options.locations ? options.locations : [] : []}
									onChange={(_, newValue) => {
										if (newValue !== null) {
											setComp({ ...newComp, site: newValue.value });
											setErrors((prev) => ({
												...prev,
												site: true,
												submitted: false,
											}));
										} else {
											setErrors((prev) => ({
												...prev,
												site: false,
												submitted: false,
											}));
										}
									}}
									value={newComp.site}
									freeSolo
									sx={{
										width: "210px",
									}}
									renderInput={(params) => (
										<TextField
											{...params}
											error={errors.submitted ? !errors.site : false}
											label="Competition Location"
											variant="outlined"
											required
										/>
									)}
								/>
							</Grid>
							
							{/* <Grid item sm={3}>
								<TextField
									sx={{ marginBottom: "10px" }}
									label="Map URL"
									value={newComp.mapurl}
									onChange={(e) =>
										setComp({ ...newComp, mapurl: e.target.value })
									}
								/>
							</Grid> */}
						</Grid>
						<div style={{
								display: "flex",
								flexDirection: "column"
							}}>
								<textarea
									style={{ 
										marginTop: "10px",
										minHeight: "45px",
										width: "250px",
										minWidth: "250px",
										maxWidth: "100%",
										outline: errors.submitted && !errors.schedule ? "none !important" : null,
										border: errors.submitted && !errors.schedule ? "1px solid red"  : null,
										boxshadow: errors.submitted && !errors.schedule ? "0 0 10px #719ECE" : null
									}}
									placeholder="Schedule"
									value={newComp.schedule}
									onChange={(e) => {
										setComp({ ...newComp, schedule: e.target.value });
										setErrors((prev) => ({
											...prev,
											schedule: !!e.target.value,
											submitted: false,
										}));
									}}
								/>
								<textarea
									style={{
										marginTop: "10px",
										minHeight: "45px",
										width: "250px",
										minWidth: "250px",
										maxWidth: "100%",
									}}
									placeholder="Add a note"
									onChange={(e) => {
										setComp({ ...newComp, note: e.target.value });
									}}
									value={newComp.note}
								/>
							</div>
					</div>
				</div>
			</LayerTwo>
		</LayerOne>
	);
}
