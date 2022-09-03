import React, { useState, useEffect, useCallback } from "react";
import ReactLoading from "react-loading";
import { useHistory } from "react-router";

import { doc, getDoc, getDocs, collection } from "@firebase/firestore";
import { db } from "../fire";

import { BasicPage, DataTable } from "../styledComps";

export default function MarkMasters() {
	const history = useHistory();

	// Raw data for the competitions
	const [comps, setComps] = useState({
		comp: JSON.parse(sessionStorage.getItem("mastersComps")),
		loading: true,
	});

	// Schools that have been marked as masters
	const [mast, setMast] = useState(
		JSON.parse(sessionStorage.getItem("mastersData"))
	);

	const [options] = useState(JSON.parse(sessionStorage.getItem("options")));

	// Gets every compeition currently available
	const getComps = async () => {
		try {
			// Getting all competitions
			const comps = await getDocs(collection(db, "competitions"));

			// Getting masters schools
			const masters = await getDoc(doc(db, "masters", "teams"));
			const master = masters ? masters.data() : null;

			// Creating an Array version of the competions
			let competitions = [];
			comps.forEach((doc) => {
				competitions.push(doc.data());
			});

			// Prevents the need for multiple reads in one session
			sessionStorage.setItem("mastersComps", JSON.stringify(competitions));
			sessionStorage.setItem("mastersData", JSON.stringify(master));

			return [competitions, master];
		} catch (error) {
			return error;
		}
	};

	// Columns of the data table
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
			headerName: "Site",
			description: "Site",
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
			field: "page",
			headerName: "View Teams",
			description: "View Teams",
			flex: 1,
			editable: false,
			renderCell: (params) => (
				<button onClick={() => onClick(params.value, mast)}>View Teams</button>
			),
		},
	];

	// Rows of the data table (competitions)
	const [rows, setRows] = useState([]);

	// Navigates the user to the page displaying the mark masters section for that competition
	const onClick = (data, mast) => {
		history.push({
			pathname: "/admin/mark-masters/teams",
			state: {
				data: data,
				masters: mast,
			},
		});
	};

	// Filters the competition data and puts it into a more readable format
	const filterRows = useCallback(
		(data) => {
			let tempRows = [];
			Object.values(data).forEach((data, index) => {
				if (data.site !== "masters") {
					// Create presentable grade label
					let grades = [];
					for (const item in options.level) {
						for (const char in data.grade.substr(1)) {
							if (options.level[item].value === data.grade.substr(1)[char]) {
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

					// Add information to rows of competitions
					tempRows.push({
						id: index,
						site: data.site.replace(/\w\S*/g, (w) =>
							w.replace(/^\w/, (c) => c.toUpperCase())
						),
						level: grade,
						date: data.compDate,
						status: data.status,
						page: data,
					});
				}
			});
			setRows(tempRows);
		},
		[options.level]
	);

	useEffect(() => {
		// Gets the competitions to mark
		if (
			comps.comp === null ||
			comps.comp === undefined ||
			mast === null ||
			mast === undefined
		) {
			// If information isn't loaded in, load it
			getComps().then((result) => {
				setMast(result[1]);
				filterRows(result[0]);

				setComps((prev) => ({
					...prev,
					comp: result[0],
					loading: false,
				}));
			});
		} else if (comps.loading) {
			// If information is loaded already, create the rows only
			filterRows(comps.comp);
			setComps((prev) => ({
				...prev,
				loading: false,
			}));
		}
	}, [comps.comp, comps.loading, mast, filterRows]);

	return (
		<BasicPage>
			{!comps.loading ? (
				<>
					<h1>Mark Masters</h1>
					<DataTable columns={columns} rows={rows} />
				</>
			) : (
				<div style={{ position: "fixed", top: "45%", left: "45%" }}>
					<ReactLoading
						type="spinningBubbles"
						color="#000"
						style={{ width: "50px", height: "50px" }}
					/>
				</div>
			)}
		</BasicPage>
	);
}
