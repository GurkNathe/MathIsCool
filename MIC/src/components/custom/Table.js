import React, { useState, useEffect, useCallback } from "react";

import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";

import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { DataGrid } from "@mui/x-data-grid";

import { doc, getDoc, updateDoc } from "@firebase/firestore";
import { db } from "../fire";

import { TableTop, Alerts } from "../styledComps";

// Used for Enter Names table

/**
 * @param  {integer}  teams : number of teams
 * @param  {integer}  individuals : number of individuals
 * @param  {string}   title : competition title
 * @param  {string}   compId : competition id
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
		props.cachedData.comps !== undefined
			? props.cachedData.comps[props.page] === undefined
				? []
				: props.cachedData.comps[props.page]
			: []
	);
	// Used to indicate when everything is properly loaded
	const [loading, setLoading] = useState(true);
	// Used for submission feedback
	const [alert, setAlert] = useState(false);
	// Used for submission feedback
	const [clicked, setClicked] = useState(false);
	// Holds the student team options
	const [options, setOptions] = useState(
		props.cachedData.ops
			? props.cachedData.ops[props.page] === undefined
				? []
				: props.cachedData.ops[props.page]
			: []
	);

	// Gets current names
	const getComps = useCallback(async () => {
		const names = await getDoc(doc(db, "competitions", props.compId));
		return names;
	}, [props.compId]);

	useEffect(() => {
		if (loading) {
			if (!students || students.length === 0) {
				getComps()
					.then((doc) => {
						// Size limiting for number of teams allowed, and the number of individuals allowed
						if (props.teams > doc.data().schTeams)
							props.teams = doc.data().schTeams;
						if (props.individuals > 10) props.individuals = 10;

						// Array to hold options for what position the person has
						let tempOptions = [];

						// Conditionally adding alternative and individual options
						if (props.teams > 0)
							tempOptions.push({ value: "Alternate", label: "Alternate" });
						if (props.individuals > 0)
							tempOptions.push({ value: "Individual", label: "Individual" });

						// Filling in the teams
						for (let i = 1; i <= props.teams; i++) {
							tempOptions.push({ value: `Team ${i}`, label: `Team ${i}` });
						}

						// Sets the team options
						setOptions(tempOptions);
						props.setCachedData((prev) => ({
							...prev,
							ops:
								prev.ops !== undefined
									? [...prev.ops, tempOptions]
									: [tempOptions],
						}));

						// Sets the retrieved student names submissions
						setStudents(doc.data().registration[props.regId].names);
					})
					.catch((error) => {
						console.error(error);
					});
			}
			setLoading(false);
		} else if (!loading && students === undefined) {
			// Creates a new list of students if none have been submitted yet

			// The number of students allowded for registration
			const numStudents =
				props.teams * 4 + props.individuals + (props.teams > 0 ? 2 : 0);

			// Number of spots to fill in people
			const fills = Array.from({ length: numStudents }, (_, i) => i + 1);

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
	}, [getComps, loading, props, students]);

	/**
	 * Adds names to registration
	 *
	 * @param {string} id : competition identifier
	 * @param {string} regId : registration identifier
	 * @param {array} students : registered students information list
	 * @returns {Promise} a Promise that updates the student information
	 */
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
		submitNames(props.compId, props.regId, students).then((result) => {
			setAlert(result);
			setClicked(true);
		});
	};

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
			valueOptions: props.level.split("-").map(i => ({ label: i, value: i})),
		},
		{
			field: "level",
			headerName: "Student Math Level",
			description: "The math level of the student.",
			flex: 1,
			editable: true,
			type: "singleSelect",
			valueOptions: [
				{
					label: "4",
					value: "4",
				},
				{
					value: "5",
					label: "5",
				},
				{
					label: "6",
					value: "6",
				},
				{
					label: "Pre-Algebra",
					value: "PA",
				},
				{
					value: "A1",
					label: "Algebra 1",
				},
				{
					label: "Algebra 2",
					value: "A2",
				},
				{
					label: "Geometry",
					value: "GE",
				},
				{
					label: "Pre-Calculus",
					value: "PC",
				},
				{
					label: "Calculus",
					value: "CA",
				},
			],
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

	/**
	 * Updates the data with with the input values
	 *
	 * @param {object} field : row of names table being updated
	 */
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
			<Alerts
				open={clicked}
				handleClose={() => setClicked(false)}
				type={alert ? "success" : "error"}
				message={
					alert
						? "Names successfully submitted."
						: "Names failed to submit, try submitting again or contact the web master for help if submitting doesn't resolve the issue."
				}
			/>

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
						<Grid item xs={2}>
							<Button
								fullWidth
								variant="contained"
								style={{ backgroundColor: "#3f51b5" }}
								onClick={onSubmit}>
								Submit
							</Button>
						</Grid>
						<Grid item xs={7} />
						<Grid
							item
							xs={1}
							sx={{
								display: "flex",
								flexDirection: "column",
								justifyContent: "center",
							}}>
							<Typography>
								{props.page + 1}/{props.registers}
							</Typography>
						</Grid>
						<Grid item xs={1}>
							<IconButton
								disabled={props.page === 0}
								onClick={() => {
									if (props.page > 0) {
										props.changePage(props.page - 1);
										let newCache = props.cachedData.comps;
										newCache[props.page] = students;
										props.setCachedData((prev) => ({
											...prev,
											comps: newCache,
										}));
										setStudents(
											!newCache[props.page - 1] ? [] : newCache[props.page - 1]
										);
										setOptions(
											!props.cachedData.ops[props.page - 1]
												? []
												: props.cachedData.ops[props.page - 1]
										);
										setLoading(true);
									}
								}}>
								<ArrowBackIosNewIcon />
							</IconButton>
						</Grid>
						<Grid item xs={1}>
							<IconButton
								disabled={props.page === props.registers - 1}
								onClick={() => {
									if (props.page < props.registers - 1) {
										props.changePage(props.page + 1);
										let newCache = props.cachedData.comps;
										if (newCache === undefined) {
											newCache = [students];
										} else {
											newCache[props.page] = students;
										}
										props.setCachedData((prev) => ({
											...prev,
											comps: newCache,
										}));
										setStudents(
											!newCache[props.page + 1] ? [] : newCache[props.page + 1]
										);
										setOptions(
											!props.cachedData.ops[props.page + 1]
												? []
												: props.cachedData.ops[props.page + 1]
										);
										setLoading(true);
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
