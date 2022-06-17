import React, { useState, useEffect } from "react";
import { Button, Grid, TextField, Autocomplete } from "@mui/material";
import { DatePicker } from "@mui/lab";
import { BasicPage, color } from "../styledComps";
import DataTable from "../custom/DataTable";
import options from "../back/options.json";

import { doc, getDoc, getDocs, collection } from "@firebase/firestore";
import { db } from "../fire";

//Not functional, just testing things right now

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

	// data from user input
	const [newComp, setComp] = useState({
		compDate: "",
		contact: "",
		email: "",
		grade: "",
		id:
			rowState.comp !== null && rowState.comp !== undefined
				? rowState.comp.length + 1
				: 1,
		level: "",
		mapURL: "",
		maxTeams: "",
		regDate: "",
		regstration: {},
		schTeams: "",
		schedule: "",
		site: "",
		status: "",
		timestamp: "",
		user: "",
		year: "",
		error: false,
	});

	//gets every compeition currently available
	const getComps = async () => {
		try {
			//getting all competitions
			const comps = await getDocs(collection(db, "competitions"));

			//creating an Array version of the competions
			let competitions = [];
			comps.forEach((doc) => {
				competitions.push(doc.data());
			});

			//prevents the need for multiple reads in one session
			sessionStorage.setItem("mastersComps", JSON.stringify(competitions));

			return competitions;
		} catch (error) {
			return error;
		}
	};

	// options for competition status
	const registrationStates = [
		"reg",
		"pre",
		"names",
		"closed",
		"masters",
		"archive",
	];

	// rows for rendering
	let rows = [];

	//gets the competitions to mark
	useEffect(() => {
		if (rowState.comp === null || rowState.comp === undefined) {
			getComps().then((result) => {
				setRow((prev) => ({
					...prev,
					comp: formatComps(result),
					loading: false,
				}));
				setComp((prev) => ({
					...prev,
					id: result.length + 1,
				}));
			});
		} else if (rowState.loading) {
			setRow((prev) => ({
				...prev,
				loading: false,
			}));
		}
	}, [rowState.comp, rowState.loading]);

	// adds competition to the table
	const onAdd = () => {
		if (
			!Object.values(newComp).includes(null) ||
			!Object.values(newComp).includes("") ||
			!Object.values(newComp).includes(" ")
		) {
			// TODO: remove error field
			setRow((prevState) => ({
				...prevState,
				comp: [...prevState.comp, newComp],
			}));
			setComp({
				compDate: "",
				contact: "",
				email: "",
				grade: "",
				id: newComp.id + 1,
				level: "",
				mapURL: "",
				maxTeams: "",
				regDate: "",
				regstration: {},
				schTeams: "",
				schedule: "",
				site: "",
				status: "",
				timestamp: "",
				user: "",
				year: "",
				error: false,
			});
		} else {
			setComp({ ...newComp, error: true });
		}
	};

	// adds new competition to the database
	const onSubmit = () => {
		console.log(rowState);
	};

	return (
		<BasicPage>
			{!rowState.loading
				? Object.values(rowState.comp).map((data, index) => {
						if (data.id !== newComp.id) {
							rows.push(data);
						}
						return null;
				  })
				: null}
			<DataTable pagination columns={columns} rows={rows} />
			<br />
			<Grid container style={{ paddingTop: 5, paddingBottom: 5 }}>
				<Grid item sm={3} width="100px">
					<Button
						fullWidth
						variant="contained"
						onClick={onSubmit}
						style={{ backgroundColor: color, textTransform: "capitalize" }}>
						Submit Competitions
					</Button>
				</Grid>
			</Grid>
			<hr />
			<div style={{ paddingTop: "1px" }}>
				<Grid container>
					<Grid item sm={3}>
						<TextField
							label="Contact"
							value={newComp.contact}
							onChange={(e) => setComp({ ...newComp, contact: e.target.value })}
						/>
						<TextField
							label="Email"
							value={newComp.email}
							onChange={(e) => setComp({ ...newComp, email: e.target.value })}
						/>
						<DatePicker
							views={["day"]}
							label="Competition Date"
							value={newComp.date}
							onChange={(newValue) => {
								if (newValue !== null) {
									setComp({ ...newComp, date: newValue });
								}
							}}
							renderInput={(params) => (
								<TextField
									{...params}
									error={newComp.date === null && newComp.error}
									required
									helperText={
										newComp.date === null && newComp.error
											? "Please fill out to continue."
											: null
									}
									sx={{
										width: "210px",
										alignSelf: "center",
									}}
								/>
							)}
						/>
					</Grid>
					<Grid item sm={3}>
						<TextField
							label="Map URL"
							value={newComp.mapurl}
							onChange={(e) => setComp({ ...newComp, mapurl: e.target.value })}
						/>
						<TextField
							label="Max Teams"
							value={newComp.maxTeams}
							onChange={(e) =>
								setComp({ ...newComp, maxTeams: e.target.value })
							}
						/>
						<TextField
							label="Registration Date"
							value={newComp.regDate}
							onChange={(e) => setComp({ ...newComp, regDate: e.target.value })}
						/>
					</Grid>
					<Grid item sm={3}>
						<TextField
							label="School Teams"
							value={newComp.schTeams}
							onChange={(e) =>
								setComp({ ...newComp, schTeams: e.target.value })
							}
						/>
						<TextField
							label="Schedule"
							value={newComp.schedule}
							onChange={(e) =>
								setComp({ ...newComp, schedule: e.target.value })
							}
						/>
						<TextField
							label="Year"
							value={newComp.year}
							onChange={(e) => setComp({ ...newComp, year: e.target.value })}
						/>
					</Grid>
					<Grid item sm={3}>
						<Autocomplete
							options={registrationStates}
							onChange={(event, newValue) => {
								setComp({ ...newComp, status: newValue });
							}}
							value={newComp.status}
							freeSolo
							sx={{
								width: "210px",
							}}
							renderInput={(params) => (
								<TextField
									{...params}
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
									setComp({ ...newComp, level: newValue.label });
								}
							}}
							value={newComp.level}
							freeSolo
							sx={{
								width: "210px",
							}}
							renderInput={(params) => (
								<TextField
									{...params}
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
									label="Competition Location"
									variant="outlined"
									required
								/>
							)}
						/>
					</Grid>
				</Grid>
				<Grid container style={{ paddingTop: 5, paddingBottom: 5 }}>
					<Grid item sm={3} width="100px">
						<Button
							fullWidth
							variant="contained"
							onClick={onAdd}
							style={{ backgroundColor: color, textTransform: "capitalize" }}>
							Add Competition
						</Button>
					</Grid>
				</Grid>
			</div>
		</BasicPage>
	);
}
