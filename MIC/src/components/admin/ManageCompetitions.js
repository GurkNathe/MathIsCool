import React, { useState, useEffect } from "react";
import { Button, Grid, TextField, Autocomplete } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { DatePicker } from "@mui/lab";
import { Drop, Alerts } from "../styledComps";
import options from "../back/options.json";

import {
	getDocs,
	collection,
	doc,
	addDoc,
	deleteDoc,
} from "@firebase/firestore";
import { db, auth } from "../fire";

// TODO: Get submission and deletion finished and debugged.
// TODO: Configure alerts for feedback.
// TODO: mapurl issues.

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
		field: "level",
		headerName: "Level",
		description: "Grade Level",
		flex: 1,
		editable: false,
	},
	{
		field: "date",
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
		field: "mapurl",
		headerName: "Map URL",
		description: "Map URL",
		flex: 1,
		editable: false,
	},
	{
		field: "notes",
		headerName: `Director's  Notes`,
		description: `Director's  Notes`,
		flex: 1,
		editable: false,
	},
	{
		field: "schools",
		headerName: `View Schools`,
		description: `View Schools`,
		flex: 1,
		editable: false,
	},
	{
		field: "names",
		headerName: `View Names`,
		description: `View Names`,
		flex: 1,
		editable: false,
	},
	{
		field: "emails",
		headerName: `View Email List`,
		description: `View Email List`,
		flex: 1,
		editable: false,
	},
];

// Location, level, date, status, map URL, Directors notes, view schools, names, emails

export default function ManageCompetitions() {
	// formats competitions for the table
	const formatComps = (comps) => {
		if (comps !== undefined && comps !== null) {
			comps.forEach((comp, index) => {
				comp.site = comp.site.replace(/\w\S*/g, (w) =>
					w.replace(/^\w/, (c) => c.toUpperCase())
				);
				var grades = [];
				for (const item in options.level) {
					for (const char in comp.grade.substr(1)) {
						if (options.level[item].value === comp.grade.substr(1)[char]) {
							grades.push(options.level[item].label);
							break;
						}
					}
				}
				var grade =
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
		}
		return comps;
	};

	// current copmetitions
	const [rowState, setRow] = useState({
		comp: formatComps(JSON.parse(sessionStorage.getItem("mastersComps"))),
		loading: true,
	});

	// Selected competition info
	const [rowInfo, setRowInfo] = useState({
		comps: JSON.parse(sessionStorage.getItem("mastersComps"))
			? JSON.parse(sessionStorage.getItem("mastersComps"))
					.map((val) => String(val.id - 1))
					.sort()
			: [],
		row: [],
		comp: "",
	});

	// data from user input
	const [newComp, setComp] = useState({
		compDate: "",
		contact: "",
		email: "",
		grade: "",
		id:
			rowState.comp !== null && rowState.comp !== undefined
				? rowState.comp.length
				: 1,
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
		submitted: false,
		success: false,
		notFull: false,
		getError: false,
		deleteError: false,
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
		if (rowState.comp === null || rowState.comp === undefined) {
			getComps()
				.then((result) => {
					setRow((prev) => ({
						...prev,
						comp: formatComps(result),
						loading: false,
					}));
					setComp((prev) => ({
						...prev,
						id: result.length,
					}));
					setRowInfo((prev) => ({
						...prev,
						comps: Array.from(Array(result.length), (d, i) => String(i)),
					}));
				})
				.catch((error) => console.error(error));
		} else if (rowState.loading) {
			setRow((prev) => ({
				...prev,
				loading: false,
			}));
		}
	}, [rowState.comp, rowState.loading]);

	// Used when selecting a competition to edit/delete
	const onSelect = (comp) => {
		if (comp) {
			setRowInfo((prev) => ({
				...prev,
				row: [rowState.comp[comp]],
				comp: comp,
			}));
			setComp((prev) => ({
				...prev,
				...rowState.comp[comp],
			}));
			setNewArt((prev) => ({
				...prev,
				picked: true,
			}));

			// Set all errors to true
			let tempErrors = errors;
			Object.keys(tempErrors).forEach((val) => (tempErrors[val] = true));
			tempErrors.submitted = false;
			tempErrors.deleteError = false;
			setErrors(tempErrors);
		}
	};

	// Used to clear the input fields when needed
	const onClear = (event) => {
		if (!event || !event.target.value) {
			setComp({
				compDate: null,
				contact: "",
				email: "",
				grade: "",
				id:
					rowState.comp !== null && rowState.comp !== undefined
						? rowState.comp.length
						: 1,
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
			});
			setRowInfo((prev) => ({
				...prev,
				row: [],
				comp: "",
			}));
			setNewArt((prev) => ({
				...prev,
				picked: false,
			}));

			// Set all errors to false
			let tempErrors = errors;
			Object.keys(tempErrors).forEach((val) => (tempErrors[val] = false));
			setErrors(tempErrors);
		}
	};

	// Adds/modifies a competition to/in the database
	const onSubmit = () => {
		// If no errors submit
		if (
			Object.keys(errors)
				.filter(
					(key) =>
						key !== "submitted" &&
						key !== "notFull" &&
						key !== "getError" &&
						key !== "success" &&
						key !== "deleteError"
				)
				.map((key) => errors[key])
				.every((value) => value)
		) {
			// Getting the competition reference
			const page = collection(db, "competitions");

			// Creating payload
			let comp = {
				...newComp,
				mapurl: newComp.mapurl === undefined ? "" : newComp.mapurl,
				id: newComp.id + 1,
				timestamp: new Date(Date.now()),
				user: auth.currentUser.uid,
			};

			// Adding new/modified competition to database
			addDoc(page, comp)
				.then((val) => {
					console.log(val);

					// Inserting the option if it isn't already there
					let tempComps = rowInfo.comps;
					if (!tempComps.includes(comp.id.toString())) {
						tempComps.push(comp.id.toString());
					}
					tempComps.sort();

					// Updating/adding question to local records
					setRowInfo((prev) => ({
						...prev,
						comps: tempComps,
					}));

					// Adding competition information to list
					let newComps = [...rowState.comp, comp];

					// Adding information to session information
					sessionStorage.setItem("mastersComps", JSON.stringify(newComps));
				})
				.catch((error) => {
					console.error(error);
				});
		} else {
			console.log("fail");
			setErrors((prev) => ({
				...prev,
				notFull: true,
			}));
		}
		setErrors((prev) => ({
			...prev,
			submitted: true,
		}));
	};

	// Deletes the selected competions from the database
	const onDelete = async () => {
		if (newComp.compId !== undefined) {
			await deleteDoc(doc(db, "competitions", newComp.compId)).then(() => {
				console.log("yes");
			});
		} else {
			setErrors((prev) => ({
				...prev,
				deleteError: true,
			}));
		}
	};

	return (
		<div style={{ margin: "10px" }}>
			<h1>Manage Competitions</h1>
			<Alerts
				open={errors.submitted || errors.deleteError}
				handleClose={() =>
					setErrors((prev) => ({
						...prev,
						submitted: false,
						notFull: false,
						getError: false,
						deleteError: false,
						success: false,
					}))
				}
				type={
					errors.submitted
						? errors.notFull
							? "error"
							: "success"
						: errors.deleteError
						? "error"
						: "success"
				}
				message={
					errors.submitted
						? errors.notFull
							? "Please fill out all required fields to successfully submit a competition."
							: "testing"
						: errors.deleteError
						? "Please select a competition to delete."
						: "Unknown error."
				}
			/>
			<div style={{ display: "flex", marginBottom: "10px" }}>
				<Drop
					options={rowInfo.comps}
					onChange={(e) => {
						onSelect(e.target.textContent);
						setErrors((prev) => ({
							...prev,
							submitted: false,
							notFull: false,
							getError: false,
						}));
					}}
					onInputChange={(event) => onClear(event)}
					text="Select Competition"
					value={rowInfo.comp}
					style={{ width: "223px" }}
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
								onClear(null);
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
							onClick={() => onDelete()}
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
			<DataGrid autoHeight hideFooter columns={columns} rows={rowInfo.row} />
			<div style={{ marginTop: "10px" }}>
				<Grid container>
					<Grid item sm={3}>
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
							views={["day"]}
							label="Competition Date"
							value={newComp.compDate}
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
							renderInput={(params) => (
								<TextField
									{...params}
									error={errors.submitted ? !errors.compDate : false}
									helperText={
										errors.compDate ? "Please fill out to continue." : null
									}
									sx={{
										width: "223px",
										alignSelf: "center",
									}}
								/>
							)}
						/>
					</Grid>
					<Grid item sm={3}>
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
							views={["day"]}
							label="Registration Deadline"
							value={newComp.regDate}
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
							renderInput={(params) => (
								<TextField
									{...params}
									error={errors.submitted ? !errors.regDate : false}
									required
									helperText={
										errors.regDate ? "Please fill out to continue." : null
									}
									sx={{
										width: "223px",
										alignSelf: "center",
									}}
								/>
							)}
						/>
					</Grid>
					<Grid item sm={3}>
						<TextField
							sx={{ marginBottom: "10px" }}
							label="Map URL"
							value={newComp.mapurl}
							onChange={(e) => setComp({ ...newComp, mapurl: e.target.value })}
						/>
						<TextField
							sx={{ marginBottom: "10px" }}
							label="Schedule"
							value={newComp.schedule}
							onChange={(e) => {
								setComp({ ...newComp, schedule: e.target.value });
								setErrors((prev) => ({
									...prev,
									schedule: !!e.target.value,
									submitted: false,
								}));
							}}
							error={errors.submitted ? !errors.schedule : false}
						/>
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
					</Grid>
					<Grid item sm={3}>
						<Autocomplete
							options={["reg", "pre", "names", "closed", "masters", "archive"]}
							onChange={(event, newValue) => {
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
							options={options.level}
							onChange={(event, newValue) => {
								if (newValue !== null) {
									setComp({
										...newComp,
										level: newValue.label,
										grade: `G${newValue.label}`,
									});
									setErrors((prev) => ({
										...prev,
										level: true,
										grade: true,
										submitted: false,
									}));
								} else {
									setErrors((prev) => ({
										...prev,
										level: false,
										grade: false,
										submitted: false,
									}));
								}
							}}
							value={newComp.level}
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
							options={options.locations}
							onChange={(event, newValue) => {
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
				</Grid>
			</div>
		</div>
	);
}
