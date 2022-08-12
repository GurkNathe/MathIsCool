import React, { useState } from "react";
import ReactLoading from "react-loading";
import { useHistory } from "react-router";

import { doc, getDoc, getDocs, collection } from "@firebase/firestore";
import { db } from "../fire";

import { BasicPage } from "../styledComps";
import DataTable from "../custom/DataTable";

// TODO: Add documentation

export default function MarkMasters() {
	const history = useHistory();

	const [comps, setComps] = useState({
		comp: JSON.parse(sessionStorage.getItem("mastersComps")),
		loading: true,
	});

	const [mast, setMast] = useState(
		JSON.parse(sessionStorage.getItem("mastersData"))
	);

	const [options] = useState(JSON.parse(sessionStorage.getItem("options")));

	//gets every compeition currently available
	const getComps = async () => {
		try {
			//getting all competitions
			const comps = await getDocs(collection(db, "competitions"));

			//getting masters schools
			const masters = await getDoc(doc(db, "masters", "teams"));
			const master = masters ? masters.data() : null;

			//creating an Array version of the competions
			let competitions = [];
			comps.forEach((doc) => {
				competitions.push(doc.data());
			});

			//prevents the need for multiple reads in one session
			sessionStorage.setItem("mastersComps", JSON.stringify(competitions));
			sessionStorage.setItem("mastersData", JSON.stringify(master));

			return [competitions, master];
		} catch (error) {
			return error;
		}
	};

	//TODO: flex or width?
	//Columns and rows of the data table
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
	let rows = [];

	//gets the competitions to mark
	if (
		comps.comp === null ||
		comps.comp === undefined ||
		mast === null ||
		mast === undefined
	) {
		getComps().then((result) => {
			setMast(result[1]);
			setComps((prev) => ({
				...prev,
				comp: result[0],
				loading: false,
			}));
		});
	} else if (comps.loading) {
		setComps((prev) => ({
			...prev,
			loading: false,
		}));
	}

	const onClick = (data, mast) => {
		history.push({
			pathname: "/admin/mark-masters/teams",
			state: {
				data: data,
				masters: mast,
			},
		});
	};

	return (
		<BasicPage>
			{!comps.loading ? (
				<>
					{Object.values(comps.comp).map((data, index) => {
						if (data.site !== "masters") {
							let grades = [];
							for (const item in options.level) {
								for (const char in data.grade.substr(1)) {
									if (
										options.level[item].value === data.grade.substr(1)[char]
									) {
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

							rows.push({
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
						return null;
					})}
					<h1>Mark Masters</h1>
					<DataTable
						columns={columns}
						rows={rows}
						disableDensitySelector
						disableColumnSelector
						disableColumnFilter
					/>
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
