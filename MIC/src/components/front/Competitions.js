import React, { useState, useEffect } from "react";
import { Button, Divider } from "@mui/material";
import { useHistory } from "react-router-dom";
import { LayerOne, LayerTwo } from "../styledComps";
import options from "../back/options.json";

import { getDocs, collection } from "@firebase/firestore";
import { db } from "../fire";

//!! Not configured for mobile yet

export default function Competitions() {
	const [chosen, setChosen] = useState(["4", {}]); // states for the chosen grade level and chosen competition
	const [competitions, setCompetitions] = useState(
		JSON.parse(sessionStorage.getItem("calendarCompetitions"))
	); // all competitions
	const [comp, setComp] = useState(null); // current competition selected

	// firestore call that gets all competitions
	const getComps = async () => {
		const comps = await getDocs(collection(db, "competitions"));

		let compsArr = [];

		comps.forEach((item) => {
			compsArr.push(item.data());
		});

		sessionStorage.setItem("calendarCompetitions", JSON.stringify(compsArr));
		return compsArr;
	};

	// gets all competitions if there are none in the session storage
	useEffect(() => {
		if (competitions === null || competitions === undefined) {
			getComps().then((comps) => {
				setCompetitions(comps);
			});
		}
	}, [competitions]);

	// function that formats the grade level into something more useable
	const getGrade = (comp) => {
		var grades = [];
		for (const item in options.level) {
			for (const char in comp.grade.substr(1)) {
				if (options.level[item].value === comp.grade.substr(1)[char]) {
					grades.push(options.level[item].label);
					break;
				}
			}
		}
		var grade = grades.length > 2 ? grades.join(", ") : grades.join(" and ");
		grade =
			grades.length > 2
				? grade.substring(0, grade.lastIndexOf(", ")) +
				  ", and " +
				  grade.substring(grade.lastIndexOf(", ") + 2, grade.length)
				: grade;
		return grade;
	};

	// function that creates schedule array
	const createSchedule = (comp) => {
		let schedule = [];
		for (let i = 0; i < comp.length - 1; i += 2) {
			schedule.push({ time: comp[i], info: comp[i + 1] });
		}
		return schedule;
	};

	const getTimes = (comp) => {
		let times = [];
		for (let i = 0; i < comp.length; i++) {
			if (i % 2 === 0) {
				times.push(comp[i]);
			}
		}
		return times;
	};

	const getEvents = (comp) => {
		let events = [];
		for (let i = 0; i < comp.length; i++) {
			if (i % 2 !== 0) {
				events.push(comp[i]);
			}
		}
		return events;
	};

	return (
		<LayerOne>
			<LayerTwo style={{ width: "25%" }}>
				<p
					style={{
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
					}}>
					Select Grade Level
				</p>
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						justifyContent: "space-between",
						alignItems: "center",
					}}>
					{options.level.map((item, index) => {
						return (
							<Button
								key={index}
								style={{ padding: "10px", margin: "10px" }}
								variant={chosen[0] === item.value ? "contained" : "outlined"}
								color="primary"
								onClick={() => setChosen((prevState) => [item.value, {}])}>
								{item.label}
							</Button>
						);
					})}
				</div>
			</LayerTwo>
			<LayerTwo style={{ width: "75%" }}>
				<div
					style={{
						display: "flex",
						flexDirection: "row",
						alignItems: "center",
					}}>
					<p style={{ fontSize: "20px", paddingLeft: "20px" }}>Competitions:</p>
					{competitions !== null && competitions !== undefined
						? competitions.map((item, index) => {
								let grade = getGrade(item);
								if (grade.includes(chosen[0])) {
									return (
										<Button
											key={index}
											style={{ padding: "10px", margin: "10px" }}
											variant={
												chosen[1] === item.timestamp ? "contained" : "outlined"
											}
											color="primary"
											onClick={() => {
												setComp(item);
												setChosen([chosen[0], item.timestamp]);
											}}>
											{item.site.replace(/\w\S*/g, (w) =>
												w.replace(/^\w/, (c) => c.toUpperCase())
											)}{" "}
											on {item.compDate}
										</Button>
									);
								}
						  })
						: null}
				</div>
				<Divider />
				<div style={{ margin: "20px", display: "flex", flexDirection: "row" }}>
					<div style={{ width: "50%", height: "100%" }}>
						<p style={{ fontSize: "20px" }}>Details</p>
						<p></p>
					</div>
					<hr style={{ margin: "10px" }} />
					<div
						style={{
							width: "50%",
							height: "100%",
						}}>
						<p style={{ fontSize: "20px" }}>Tentative Schedule of Events</p>
						<table>
							{comp !== null && comp !== undefined
								? getTimes(comp.schedule.split("\n")).map((item, index) => {
										let events = getEvents(comp.schedule.split("\n"));
										return (
											<tr key={index}>
												<td style={{ paddingRight: "20px" }}>{item}</td>
												<td>{events[index]}</td>
											</tr>
										);
								  })
								: null}
						</table>
					</div>
				</div>
			</LayerTwo>
		</LayerOne>
	);
}
