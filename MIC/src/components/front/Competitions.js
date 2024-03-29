import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";

import { getDocs, getDoc, collection, doc } from "@firebase/firestore";
import { db } from "../fire";

import { LayerOne, LayerTwo } from "../styledComps";
import getOptions from "../getOptions";

export default function Competitions() {
	const history = useHistory();

	// States for the chosen grade level and chosen competition
	const [chosen, setChosen] = useState(["4", {}]);

	// All competitions
	const [competitions, setCompetitions] = useState(
		JSON.parse(sessionStorage.getItem("calendarCompetitions"))
	);

	// Options object
	const [options, setOptions] = useState(
		JSON.parse(sessionStorage.getItem("options"))
	);

	// Current competition selected
	const [comp, setComp] = useState(null);

	// All possible sites
	const [sites, setSites] = useState(null);

	const days = [
		"Sunday",
		"Monday",
		"Tuesday",
		"Wednesday",
		"Thursday",
		"Friday",
		"Saturday",
	];

	const months = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	];

	// Firestore call that gets all competitions
	const getComps = async () => {
		const comps = await getDocs(collection(db, "competitions"));

		let compsArr = [];

		comps.forEach((item) => {
			if (item.data().status !== "closed" && item.data().status !== "archive") {
				compsArr.push(item.data());
			}
		});

		sessionStorage.setItem("calendarCompetitions", JSON.stringify(compsArr));
		return compsArr;
	};

	// Gets every possible competition site
	const getSites = async () => {
		const sites = await getDoc(doc(db, "web", "sites"));
		return sites.data();
	};

	// Gets all competitions and sites if there are none in the session storage
	useEffect(() => {
		// If the options weren't loaded before, load them
		if (options === null) {
			getOptions(setOptions);
		}

		if (competitions === null || competitions === undefined) {
			getComps().then((comps) => {
				setCompetitions(comps);
			});
		}
		if (sites === null || sites === undefined) {
			getSites().then((site) => {
				setSites(site);
			});
		}
	}, [competitions, sites, options]);

	/**
	 * Function that uses the competition to parse the grade value and formats
	 * the grade level into something more useable.
	 *
	 * @param {object} comp : competition
	 * @returns {string} : formatted grade level
	 */
	const getGrade = (comp) => {
		let grades = [];
		for (const item in options.level) {
			for (const char in comp.grade.substr(1)) {
				if (options.level[item].value === comp.grade.substr(1)[char]) {
					grades.push(options.level[item].label);
					break;
				}
			}
		}
		let grade = grades.length > 2 ? grades.join(", ") : grades.join(" and ");
		grade =
			grades.length > 2
				? grade.substring(0, grade.lastIndexOf(", ")) +
				  ", and " +
				  grade.substring(grade.lastIndexOf(", ") + 2, grade.length)
				: grade;
		return grade;
	};

	/**
	 * Function that formats the grade level into something more useable
	 *
	 * @param {string} grade : grade level id
	 * @returns {string} : human readable grade level
	 */
	const parseGrade = (grade) => {
		for (const item in options.level) {
			if (options.level[item].value === grade) {
				grade = options.level[item].label;
				break;
			}
		}
		return grade;
	};

	/**
	 * Gets the time values from the schedule for the Tentative Schedule
	 *
	 * @param {array} comp : schedule of competition split on the \n character
	 * @returns {array} : returns only times for times in the schedule
	 */
	const getTimes = (comp) => {
		let times = [];
		for (let i = 0; i < comp.length; i++) {
			if (i % 2 === 0) {
				times.push(comp[i]);
			}
		}
		return times;
	};

	/**
	 * Gets the events values from the schedule for the Tentative Schedule
	 *
	 * @param {array} comp : schedule of competition split on the \n character
	 * @returns {array} : returns only times for events in the schedule
	 */
	const getEvents = (comp) => {
		let events = [];
		for (let i = 0; i < comp.length; i++) {
			if (i % 2 !== 0) {
				events.push(comp[i]);
			}
		}
		return events;
	};

	/**
	 * Takes in a date string and returns string of the day of the week + date
	 *
	 * @param {string} date : string in 'MM/DD/YYYY' format
	 * @returns {string} : string in 'DAY-OF-THE-WEEK, MONTH DATE, YEAR' format
	 * @example "2/21/2021" => "Sunday, February 21, 2021"
	 */
	const getDate = (date) => {
		let dayOfWeek = new Date(date);
		return `${days[dayOfWeek.getDay()]}, ${
			months[dayOfWeek.getMonth()]
		} ${dayOfWeek.getDate()}, ${dayOfWeek.getFullYear()}`;
	};

	// onClick function to link to registration page
	const register = () => {
		let registerData = {};
		registerData.level = { label: parseGrade(chosen[0]), value: chosen[0] };
		registerData.location = comp.site;
		registerData.competition = comp;
		history.push({
			pathname: "/team-register",
			state: registerData,
		});
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
					{options
						? options.level.map((item, index) => {
								return (
									<Button
										key={index}
										style={{ padding: "10px", margin: "10px" }}
										variant={
											chosen[0] === item.value ? "contained" : "outlined"
										}
										color="primary"
										onClick={() => {
											setChosen((prevState) => [item.value, {}]);
											setComp(null);
										}}>
										{item.label}
									</Button>
								);
						  })
						: null}
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
					{competitions !== null &&
					competitions !== undefined &&
					options !== null
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
								} else {
									return null;
								}
						  })
						: null}
				</div>
				<Divider />

				{comp !== null && comp !== undefined ? (
					<>
						<div
							style={{ margin: "20px", display: "flex", flexDirection: "row" }}>
							<div style={{ width: "50%", height: "100%" }}>
								<p style={{ fontSize: "20px" }}>Details</p>
								<p>
									{parseGrade(chosen[0])}th Grade Math is Cool Contest <br />
									{getDate(comp.compDate)}
								</p>
								<p>
									{sites ? Object.keys(sites.records).map((item, index) => {
										if (sites.records[item].name === comp.site) {
											return (
												<span key={index}>
													{sites.records[item].name} (
													<a
														target="_blank"
														rel="noreferrer"
														href={sites.records[item].mapUrl}>
														map
													</a>
													) <br />
													{sites.records[item].street} <br />
													{sites.records[item].city === 0
														? null
														: sites.records[item].city}
												</span>
											);
										} else {
											return null;
										}
									}) : null}
								</p>
								<p>
									Contact: {comp.contact} (
									<a target="_top" href={`mailto:${comp.email}`}>
										email
									</a>
									)
								</p>
								<p>
									Registration Deadline: {getDate(comp.regDate)}
									<br />
									Maximum teams per school: {comp.schTeams}
									<br />
									{comp.note !== undefined && comp.note !== null
										? `Note : ${comp.note}`
										: null}
								</p>
							</div>
							<hr style={{ margin: "10px" }} />
							<div
								style={{
									width: "50%",
									height: "100%",
								}}>
								<p style={{ fontSize: "20px" }}>Tentative Schedule of Events</p>
								<table>
									<tbody>
										{getTimes(comp.schedule.split("\n")).map((item, index) => {
											let events = getEvents(comp.schedule.split("\n"));
											return (
												<tr key={index}>
													<td style={{ paddingRight: "20px" }}>{item}</td>
													<td>{events[index]}</td>
												</tr>
											);
										})}
									</tbody>
								</table>
							</div>
						</div>
						<Divider />
						<div
							style={{
								display: "flex",
								justifyContent: "center",
								flexDirection: "column",
								marginLeft: "20px",
								marginTop: "10px",
							}}>
							<p>To Team Registration</p>
							<Button
								style={{
									width: "20%",
								}}
								variant="contained"
								color="primary"
								onClick={register}>
								Register
							</Button>
						</div>
					</>
				) : (
					<p
						style={{
							display: "flex",
							height: "80%",
							justifyContent: "center",
							alignItems: "center",
							opacity: "0.5",
						}}>
						No competition selected.
					</p>
				)}
			</LayerTwo>
		</LayerOne>
	);
}
