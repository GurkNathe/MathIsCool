import React, { useState, useEffect } from "react";
import { Button, Grid, TextField } from "@mui/material";
import { DatePicker } from "@mui/lab";
import { BasicPage, Auto, color } from "../styledComps";
import DataTable from "../custom/DataTable";
import options from "../back/options.json";

import { doc, getDoc, getDocs, collection } from "@firebase/firestore";
import { db } from "../fire";

//Not functional, just testing things right now

// Location, level, date, status, map URL, Directors notes, view schools, names, emails

export default function ManageCompetitions() {
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
			editable: true,
		},
		{
			field: "notes",
			headerName: `Director's  Notes`,
			description: `Director's  Notes`,
			flex: 1,
			editable: true,
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

	//gets every compeition currently available
	const getComps = async () => {
		try {
			//getting all competitions
			const comps = await getDocs(collection(db, "competitions"));

			//creating an Array version of the competions
			var competitions = [];
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
		id:
			rowState.comp !== null && rowState.comp !== undefined
				? rowState.comp.length + 1
				: 1,
		site: null,
		level: null,
		date: null,
		status: null,
		mapurl: null,
		notes: null,
		schools: null,
		names: null,
		emails: null,
		error: false,
	});

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

	// adds competition to the table
	const onAdd = () => {
		if (
			newComp.site !== null &&
			newComp.level !== null &&
			newComp.date !== null &&
			newComp.status !== null
		) {
			setRow((prevState) => ({
				...prevState,
				comp: [...prevState.comp, newComp],
			}));
			setComp({
				id: newComp.id + 1,
				site: null,
				level: null,
				date: null,
				status: null,
				mapurl: null,
				notes: null,
				schools: null,
				names: null,
				emails: null,
				error: false,
			});
		} else {
			setComp({ ...newComp, error: true });
		}
	};

	// adds new competition to the database
	const onSubmit = () => {
		console.log(newComp);
	};

	return (
		<BasicPage>
			{!rowState.loading
				? Object.values(rowState.comp).map((data, index) => {
						if (data.id !== newComp.id) {
							rows.push(data);
						}
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
				<div style={{ display: "flex" }}>
					<Auto
						options={options.locations}
						text="Competition Location"
						onChange={(event, newValue) => {
							if (newValue !== null) {
								setComp({ ...newComp, site: newValue.value });
							}
						}}
						width={300}
						value={newComp.site}
						error={newComp.site === null && newComp.error}
					/>
					<Auto
						options={options.level}
						text="Competition Level"
						onChange={(event, newValue) => {
							if (newValue !== null) {
								setComp({ ...newComp, level: newValue.label });
							}
						}}
						width={300}
						value={newComp.level}
						error={newComp.level === null && newComp.error}
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
							/>
						)}
					/>
					<Auto
						options={registrationStates}
						text="Registration Status"
						onChange={(event, newValue) => {
							if (newValue !== null) {
								setComp({ ...newComp, status: newValue });
							}
						}}
						width={300}
						value={newComp.status}
						error={newComp.status === null && newComp.error}
					/>
				</div>
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
