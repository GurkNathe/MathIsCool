import React, { useEffect, useState, useCallback } from "react";
import { Redirect } from "react-router-dom";

import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

import { doc, setDoc } from "@firebase/firestore";
import { db } from "../fire";

import { BasicPage, color, DataTable } from "../styledComps";

/**
 * Table for loading the masters information for the chosen competition on Mark Masters
 *
 * @param {object} props.location.state : information passed from Mark Masters to component
 * @param {object} props.location.state.data : information about the competition being marked
 * @param {array} props.location.state.masters.teams : list fo every school elligible for masters, with the grade level they are elligible for
 */
export default function MastersTeams(props) {
	// Used for getting the grades on the page
	const level = JSON.parse(sessionStorage.getItem("options")).level;

	// Used for getting the names of schools
	const schools = JSON.parse(sessionStorage.getItem("options")).school;

	// Used for getting the grades on the page
	const data = props.location.state ? props.location.state.data : null;

	// Stores the teams on the page
	const masters = props.location.state
		? props.location.state.masters
			? props.location.state.masters.teams
			: null
		: null;

	/**
	 * Adds schools to the list of elligible schools to sign up for masters
	 *
	 * @param {array} master : list fo every school elligible for masters, with the grade level they are elligible for
	 * @param {array} values : row states for the registered schools
	 * @param {string} grade : competition grade level
	 * @returns {array} new list of elligible schools + grade level for masters
	 */
	const setMasters = async (master, values, grade) => {
		let newMasters = [];

		// Getting masters that aren't in grade group
		for (const i in master) {
			if (!grade.includes(master[i].grade)) {
				newMasters.push({
					grade: master[i].grade,
					schoolID: master[i].schoolID,
				});
			}
		}

		// Getting data that is marked as a masters team
		for (const i in values) {
			// Only competitions marked for masters
			if (values[i].status === "Masters Team") {
				const reg = values[i];
				let test = true;
				// Checking/filtering if already in masters
				for (const j in master) {
					if (
						master[j].grade === reg.level &&
						master[j].schoolID === reg.schoolId
					) {
						newMasters.push(master[j]);
						test = false;
						break;
					}
				}
				if (test) {
					newMasters.push({ grade: reg.level, schoolID: reg.schoolId });
				}
			}
		}

		const newData = { teams: newMasters };
		setDoc(doc(db, "masters", "teams"), newData);
		return newData;
	};

	// Gets the stringified version of the current competition's grade(s)
	const getGrade = () => {
		// Get display form of grades (i.e. instead of 1 get 11-12 or for 9 get 9-10)
		let grades = [];
		for (const item in level) {
			for (const char in data.grade.substr(1)) {
				if (level[item].value === data.grade.substr(1)[char]) {
					grades.push(level[item].label);
					break;
				}
			}
		}

		// Stringify grades into a legible format
		let grade = grades.length > 2 ? grades.join(", ") : grades.join(" and ");
		grade =
			grades.length > 2
				? grade.substring(0, grade.lastIndexOf(", ")) +
				  ", and " +
				  grade.substring(grade.lastIndexOf(", ") + 2, grade.length)
				: grade;
		return grade;
	};

	const grade = getGrade();

	/**
	 * Gets the school's name based on the school ID
	 *
	 * @param {object} reg : object containing the registration data for a school
	 * @returns {string} : the school's name
	 */
	const getSchoolName = useCallback(
		(reg) => {
			let schoolName = "";
			for (const option in schools) {
				if (schools[option].value === reg.schoolID) {
					schoolName = schools[option].label;
					break;
				}
			}
			return schoolName;
		},
		[schools]
	);

	// Table format
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
			field: "schoolId",
			headerName: "School ID",
			description: "School ID",
			flex: 1,
			hide: true,
			editable: false,
		},
		{
			field: "school",
			headerName: "School",
			description: "School",
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
			field: "status",
			headerName: "Status",
			description: "Status",
			flex: 1,
			editable: true,
			renderCell: (params) => (
				<select
					defaultValue={params.row.status}
					id={params.row.id}
					onChange={(event) => {
						params.row.status = event.target.value;
					}}>
					<option value="Team">Team</option>
					<option value="Masters Team">Masters Team</option>
				</select>
			),
		},
	];

	// Row states for the marking table
	const [rows, setRows] = useState([]);

	// Checking variable that determines whether an attempt to create rows was made
	const [checked, setChecked] = useState(false);

	/**
	 * Used to check if team has been marked as a Masters Team
	 *
	 * @param {array} list : list fo every school elligible for masters, with the grade level they are elligible for
	 * @param {object} value : object containing the registration data for a school
	 * @returns {boolean} : boolean value indicating whether the given value is in the list
	 */
	const same = (list, value) => {
		for (const i in list) {
			if (list[i].schoolID === value.schoolID && list[i].grade === value.level)
				return true;
		}
		return false;
	};

	// Submits the masters updates to database and updates local information
	const onSubmit = () => {
		setMasters(masters, rows, data.grade.substr(1)).then((result) => {
			sessionStorage.setItem("mastersData", JSON.stringify(result));
		});
	};

	useEffect(() => {
		// Redirect back to the main mark masters page if entry point wasn't through mark masters page
		if (!props.location.state) {
			return <Redirect to="/admin/mark-masters" />;
		}

		// Initializes row data for the competition
		if (data !== null && rows.length === 0 && !checked) {
			let newRows = [];
			Object.values(data.registration).forEach((reg, index) => {
				newRows.push({
					id: index,
					schoolId: reg.schoolID,
					school: getSchoolName(reg),
					level: reg.level,
					status: same(masters, reg) ? "Masters Team" : "Team",
				});
			});
			setRows(newRows);
			setChecked(true);
		}

	}, [data, getSchoolName, masters, rows, props.location.state, checked]);

	return (
		<BasicPage>
			{Object.keys(data.registration).length > 0 ? (
				<div>
					<p> 
						Competition at&nbsp;
						{data.site.replace(/\w\S*/g, (w) =>
							w.replace(/^\w/, (c) => c.toUpperCase())
						)}{" "}
						for&nbsp;
						{grade} on&nbsp;
						{data.compDate}
					</p>

					<DataTable columns={columns} rows={rows}/>

					<Grid container style={{ paddingTop: 5, paddingBottom: 5 }}>
						<Grid item sm={3} width="100px">
							<Button
								fullWidth
								variant="contained"
								onClick={onSubmit}
								style={{ backgroundColor: color }}>
								Submit
							</Button>
						</Grid>
					</Grid>
				</div>
			) : (
				<div
					style={{
						display: "flex",
						height: "80vh",
						alignItems: "center",
						justifyContent: "center",
					}}>
					<Typography style={{ opacity: "50%" }}>
						There are no teams signed up for this compeition.
					</Typography>
				</div>
			)}
		</BasicPage>
	);
}
