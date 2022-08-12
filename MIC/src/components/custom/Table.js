import React, { useState, useEffect, useCallback } from "react";

import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import Alert from "@mui/material/Alert";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { DataGrid } from "@mui/x-data-grid";

import { doc, getDoc, updateDoc } from "@firebase/firestore";
import { db } from "../fire";

import { TableTop } from "../styledComps";

//Used for Enter Names table

/**
 * @param  {integer}  teams : number of teams
 * @param  {integer}  individuals : number of individuals
 * @param  {string}   title : competition title
 * @param  {string}   id : competition id
 * @param  {string}   regId : registration id
 * @param  {integer}  page : current page/competition
 * @param  {integer}  registers : total number of competitions registered for that are open
 * @param  {function} changePage : changes the page/competition
 * @param  {integer}  cachedData : cached student information
 * @param  {function} setCachedData : sets the cached student information
 */
export default function Table(props) {
	// Holds the entered data for the current competition
	const [students, setStudents] = useState(
		props.cachedData[props.page] === undefined
			? []
			: props.cachedData[props.page]
	);
	// Used to indicate when everything is properly loaded
	const [loading, setLoading] = useState(true);
	// Used for submission feedback
	const [alert, setAlert] = useState(false);
	// Used for submission feedback
	const [clicked, setClicked] = useState(false);

	// Size limiting for number of teams allowed, and the number of individuals allowed
	if (props.teams > 10) props.teams = 10;
	if (props.individuals > 10) props.individuals = 10;

	// Number of spots to fill in people
	const fills = Array.from(
		{ length: props.teams * 4 + props.individuals + 2 },
		(_, i) => i + 1
	);

	// Array to hold options for what position the person has
	let options = [
		{ value: "Individual", label: "Individual" },
		{ value: "Alternate", label: "Alternate" },
	];

	// Filling in the teams
	for (let i = 1; i <= props.teams; i++) {
		options.push({ value: `Team ${i}`, label: `Team ${i}` });
	}

	// Gets current names
	const getComps = useCallback(async () => {
		const names = await getDoc(doc(db, "competitions", props.id));
		return names;
	}, [props.id]);

	useEffect(() => {
		if (students.length === 0) {
			getComps().then((doc) => {
				if (
					doc.data().registration[props.regId] !== undefined &&
					doc.data().registration[props.regId].names !== undefined
				) {
					sessionStorage.setItem(
						"students",
						JSON.stringify(doc.data().registration[props.regId].names)
					);
				}
				setStudents(doc.data().registration[props.regId].names);
			});
			setLoading(false);
		}
	}, [getComps, students, props.regId]);

	// Adds names to registration
	const submitNames = async (id, regId, students) => {
		const comps = doc(db, "competitions", id);
		const res = await getDoc(comps)
			.then((doc) => {
				updateDoc(comps, {
					...doc.data(),
					registration: {
						...doc.data().registration,
						[regId]: {
							...doc.data().registration[regId],
							names: students,
						},
					},
				});
				return true;
			})
			.catch((error) => {
				console.error(error);
				return false;
			});
		return res;
	};

	// Submits the names + info to the database
	const onSubmit = () => {
		submitNames(props.id, props.regId, students).then((result) => {
			setAlert(result);
			setClicked(true);
		});
	};

	// Creates a new list of students if none have been submitted yet
	if (!loading && students === undefined) {
		setStudents(
			Array(fills.length)
				.fill()
				.map((_, id) => ({
					id: id,
					name: "",
					grade: "",
					level: "",
					pos: "",
				}))
		);
	}

	// Sets the formating for the data grid
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
			field: "name",
			headerName: "Student Name",
			description: "The name of the student.",
			flex: 1,
			editable: true,
		},
		{
			field: "grade",
			headerName: "Student grade",
			description: "The grade the student is currently in.",
			flex: 1,
			editable: true,
			type: "singleSelect",
			valueOptions: JSON.parse(sessionStorage.getItem("options")).grade,
		},
		{
			field: "level",
			headerName: "Student Math Level",
			description: "The math level of the student.",
			flex: 1,
			editable: true,
			type: "singleSelect",
			valueOptions: JSON.parse(sessionStorage.getItem("options")).stlev,
		},
		{
			field: "pos",
			headerName: "Student Position",
			description:
				"The position of the student (e.g., alternate, individual, team 1, etc.).",
			flex: 1,
			editable: true,
			type: "singleSelect",
			valueOptions: options,
		},
	];

	// Updates the data with with the input values
	const getStudent = (field) => {
		let tempArray = students.filter((student) => student.id !== field.id);
		for (let s of students) {
			if (s.id === field.id) {
				setStudents(
					[
						...tempArray,
						{
							...s,
							[field.field]: field.value,
						},
					].sort((a, b) => {
						return a.id - b.id;
					})
				);
				break;
			}
		}
	};

	return (
		<TableTop>
			<Snackbar
				open={clicked}
				autoHideDuration={3000}
				onClose={() => setClicked(false)}
				anchorOrigin={{ vertical: "top", horizontal: "center" }}>
				<Alert
					handleClose={() => setClicked(false)}
					severity={alert ? "success" : "error"}
					variant="filled">
					Names{" "}
					{alert
						? "successfully submitted."
						: "failed to submit, try submitting again or contact the web master for help if submitting doesn't resolve the issue."}
				</Alert>
			</Snackbar>
			{students !== undefined ? (
				<div>
					<Typography style={{ margin: "10px" }}>{props.title}</Typography>
					<DataGrid
						onCellEditCommit={(val) => {
							getStudent(val);
						}}
						hideFooter
						loading={loading}
						autoHeight
						columns={columns}
						rows={students}
					/>
					<Grid container sx={{ paddingTop: "10px" }}>
						<Grid item sm={2}>
							<Button
								fullWidth
								variant="contained"
								style={{ backgroundColor: "#3f51b5" }}
								onClick={onSubmit}>
								Submit
							</Button>
						</Grid>
						<Grid item sm={8} />
						<Grid
							item
							sm={1}
							sx={{ display: "flex", justifyContent: "center" }}>
							<Typography>
								Competition {props.page + 1}/{props.registers}
							</Typography>
						</Grid>
						<Grid item sm={0.5}>
							<IconButton
								disabled={props.page === 0}
								onClick={() => {
									if (props.page > 0) {
										props.changePage(props.page - 1);
										let newCache = props.cachedData;
										newCache[props.page] = students;
										props.setCachedData(newCache);
										setStudents(newCache[props.page - 1]);
									}
								}}>
								<ArrowBackIosNewIcon />
							</IconButton>
						</Grid>
						<Grid item sm={0.5}>
							<IconButton
								disabled={props.page === props.registers - 1}
								onClick={() => {
									if (props.page < props.registers - 1) {
										props.changePage(props.page + 1);
										let newCache = props.cachedData;
										newCache[props.page] = students;
										props.setCachedData(newCache);
										setStudents(newCache[props.page + 1]);
									}
								}}>
								<ArrowForwardIosIcon />
							</IconButton>
						</Grid>
					</Grid>
				</div>
			) : null}
		</TableTop>
	);
}
