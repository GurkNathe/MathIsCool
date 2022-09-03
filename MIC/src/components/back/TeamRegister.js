import React, { useState, useEffect, useCallback } from "react";
import { useHistory } from "react-router-dom";

import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";

import { collection, where, getDocs, getDoc, doc } from "@firebase/firestore";
import { auth, db } from "../fire";

import { TeamForm, Auto, BasicPage } from "../styledComps";
import { divisions } from "../assets.js";

export default function TeamRegister() {
	const history = useHistory();

	const [options, setOptions] = useState(
		JSON.parse(sessionStorage.getItem("options"))
	);

	// Gets the competitions that are open (i.e. status == reg)
	const getComps = async (title) => {
		//holds the competitions
		let comps = {};

		//checks if load variable in local storage is true, meaning database can be pulled
		if (
			!sessionStorage.getItem(title + "Data") ||
			!sessionStorage.getItem("mastersData")
		) {
			//getting the 'web' collection from firestore
			const competitions = await getDocs(
				collection(db, title),
				where("status", "==", "reg")
			);
			const masters = await getDoc(doc(db, "masters", "teams"));

			//adding open competitions to holding variable
			competitions.forEach((item) => {
				comps = {
					...comps,
					[item.id]: item.data(),
				};
			});

			//checking to make sure it actually got data
			if (competitions.empty) {
				return;
			}

			//adding web page html/data to local storage
			sessionStorage.setItem(title + "Data", JSON.stringify(comps));
			sessionStorage.setItem(
				"mastersData",
				masters ? JSON.stringify(masters.data()) : null
			);

			return [comps, masters ? masters.data() : null];
		}
	};

	// All open competitions
	const [comps, setComps] = useState(
		JSON.parse(sessionStorage.getItem("competitionsData"))
	);

	// Stores the masters data
	const [masters, setMasters] = useState(
		JSON.parse(sessionStorage.getItem("mastersData"))
	);

	// Input variables
	const [choice, setChoice] = useState({
		loc: null,
		lev: null,
		school: null,
		team: null,
		indiv: null,
		email: "",
		coach: "",
		error: false,
	});

	// Used to store the locations, does not change
	const [locals, setLocals] = useState(
		JSON.parse(sessionStorage.getItem("filteredComps"))
	);

	// Used as a checking variable for history.location.state
	const [loaded, setLoaded] = useState({ state: false, options: false });

	// Stores email and username of user
	const user = {
		email: sessionStorage.getItem("email"),
		name: sessionStorage.getItem("username"),
		school: sessionStorage.getItem("school"),
	};

	// Gets the value for width of text fields
	const getLongest = (longest) => {
		//finding length of longest string in options and resize search box accordingly
		for (const option in options) {
			for (let i = 0; i < Object.keys(options[option]).length; i++) {
				if (options[option][i].label.length > longest)
					longest = options[option][i].label.length;
			}
		}
		//don't know if there is a good way to do this, couldn't find anything
		return longest * 10;
	};

	// Used for storing the width of the longest string that can be selected in the drop-downs
	const longest = getLongest(0);

	// Capitalizes the words in the given string
	const capitalize = (phrase) => {
		return phrase.replace(/\b\w/g, (c) => c.toUpperCase());
	};

	// Checks data to make sure things are filled out,
	// and redirects to the goole form with prefilled info.
	const onSubmit = () => {
		const error = setError(choice);
		if (!error) {
			const compId = setCompID(choice);
			if (compId !== undefined) {
				// Navigates to the Google Form if there is no error
				history.push({
					pathname: `/team-register/confirm/`,
					state: {
						key: setURL(choice, compId),
					},
				});
			} else {
				setError(true);
			}
		}
	};

	// Sets the competition id for submission
	const setCompID = useCallback(
		(choice) => {
			// Get all competitions at the selected grade level
			let tempComps = [];
			for (const i in comps) {
				if (comps[i].grade.includes(choice.lev.value)) {
					let totalRegs = 0;
					for (const reg in comps[i].registration) {
						totalRegs += comps[i].registration[reg].numTeams;
					}

					if (totalRegs < comps[i].maxTeams) {
						tempComps.push({ ...comps[i], compId: i });
					}
				}
			}

			// Get the competition id based off the location
			tempComps = tempComps.filter((competition) => {
				return (
					competition.site.toUpperCase() === choice.loc.value.toUpperCase()
				);
			});

			return tempComps[0].compId;
		},
		[comps]
	);

	// Setting error if something is not filled out.
	const setError = (choice) => {
		let err = false;
		for (const item in choice) {
			if ((choice[item] === null || choice[item] === "") && item !== "email") {
				setChoice((prevState) => ({
					...prevState,
					error: true,
				}));
				err = true;
				break;
			}
		}
		return err;
	};

	// Sets iframe url for filling google form
	const setURL = (choice, compId) => {
		const uid = auth.currentUser.uid;
		return `https://docs.google.com/forms/d/e/1FAIpQLSf8UTjphTqcOHwmrdGEG8Jsbjz4eVz7d6XVlgW7AlnM28vq_g/viewform?usp=pp_url&entry.1951055040=${
			choice.coach
		}&entry.74786596=${uid}&entry.62573940=${
			choice.loc.value
		}&entry.1929366142=${choice.lev.value}&entry.680121242=${
			choice.team.value
		}&entry.641937550=${choice.indiv.value}&entry.1389254068=${
			choice.school.value +
			" " +
			choice.school.label +
			" - " +
			choice.school.div
		}&entry.1720714498=${
			user.email + (choice.email ? ", " + choice.email : "")
		}&entry.1445326839=${compId}`;
	};

	const onChange = useCallback(
		(newValue, type, field) => {
			switch (type) {
				case "level":
					if (newValue != null) {
						setChoice((prevState) => ({
							...prevState,
							lev: newValue,
							loc: null,
							error: false,
						}));

						// Get competitions with the selected grade level
						// Except for the master option
						let tempOps = [];
						for (const comp in comps) {
							if (
								comps[comp].grade.substr(1).includes(newValue.value) &&
								!tempOps.includes(capitalize(comps[comp].site)) &&
								comps[comp].site.toUpperCase() !== "MASTERS"
							) {
								tempOps.push(capitalize(comps[comp].site));
							}
						}

						// Format options
						tempOps.forEach((val, index) => {
							tempOps[index] = { value: val, label: val };
						});

						setOptions((prev) => ({
							...prev,
							locations: tempOps,
						}));

						// Used to add the Masters option if the school is marked for Masters
						if (choice.school) {
							// Getting school id for chosen school
							const id = choice.school.value;

							// Checking if school is able to sign up for masters
							for (const option in masters.teams) {
								if (
									masters.teams[option].grade === newValue.value &&
									masters.teams[option].schoolID === id
								) {
									setOptions((prev) => ({
										...prev,
										locations: [
											...prev.locations,
											{
												value: "Masters",
												label: "Masters",
											},
										],
									}));
									break;
								}
							}
						}
					} else {
						setChoice((prevState) => ({
							...prevState,
							lev: null,
							loc: null,
							error: false,
						}));

						// Resets the available locations if field is cleared
						setOptions((prev) => ({
							...prev,
							locations: locals,
						}));
					}
					break;
				case "school":
					if (newValue != null) {
						// Getting school id for chosen school
						const id = newValue.value;

						// For checking if school is a masters school
						let check = false;

						// Checking if school is able to sign up for masters
						if (choice.lev !== null) {
							for (const option in masters.teams) {
								// Checking if the grade and id of the school
								// are the same as the selected level and school
								if (
									masters.teams[option].grade === choice.lev.value &&
									masters.teams[option].schoolID === id
								) {
									// If there is already a Masters option, don't add another
									if (
										!options.locations.some(
											(option) => option.value === "Masters"
										)
									) {
										setOptions((prev) => ({
											...prev,
											locations: [
												...prev.locations,
												{
													value: "Masters",
													label: "Masters",
												},
											],
										}));
									}
									check = true;
									break;
								}
							}
							// If the school selected isn't marked for
							// masters filter out masters option
							if (!check) {
								const tempOps = options.locations.filter((data) => {
									return data.value !== "Masters";
								});
								setOptions((prev) => ({
									...prev,
									locations: tempOps,
								}));
							}
						}

						// Reset location unless they redirected from
						// competitions, and it wasn't a masters competition
						setChoice((prevState) => ({
							...prevState,
							school: newValue,
							loc:
								loaded.state && choice.loc && choice.loc.value !== "Masters"
									? prevState.loc
									: check
									? prevState.loc
									: null,
							error: false,
						}));
					} else {
						// Deletes any masters in location options "reseting options"
						let tempOps = options.locations;
						tempOps = tempOps.filter((_, index, arr) => {
							return arr[index].value !== "Masters";
						});
						setOptions((prev) => ({
							...prev,
							locations: tempOps,
						}));

						setChoice((prevState) => ({
							...prevState,
							school: null,
							loc: null,
							error: false,
						}));
					}
					break;
				case "location":
					// Updating how many teams are allowed per registration
					if (newValue !== null) {
						const compId = setCompID({ ...choice, loc: newValue });
						for (const key in comps) {
							if (key === compId) {
								setOptions((prev) => ({
									...prev,
									numteam: [...Array(comps[key].schTeams + 1)].map((_, i) => ({
										label: String(i),
										value: String(i),
									})),
								}));
								break;
							}
						}
					} else {
						setOptions((prev) => ({
							...prev,
							numteam: [...Array(11)].map((_, i) => ({
								label: String(i),
								value: String(i),
							})),
						}));
					}
					setChoice((prevState) => ({
						...prevState,
						loc: newValue,
						error: false,
					}));
					break;
				case "general":
					setChoice((prevState) => ({
						...prevState,
						[field]: newValue,
						error: false,
					}));
					break;
				default:
					break;
			}
		},
		[choice, loaded.state, comps, locals, masters, options.locations, setCompID]
	);

	useEffect(() => {
		// If the user has a selected school (profile school), use it
		if (user.school && !choice.school) {
			let school = {};
			options.school.forEach((data, index) => {
				if (data.label === user.school) {
					school = options.school[index];
				}
			});
			onChange(school, "school", "");
		}

		// Setting values if redirected from competition calendar
		if (
			history.location.state !== null &&
			history.location.state !== undefined &&
			!loaded.state
		) {
			if (
				history.location.state.level !== null &&
				history.location.state.level !== undefined &&
				history.location.state.location !== null &&
				history.location.state.location !== undefined
			) {
				// Adding the competition level
				onChange(history.location.state.level, "level", "lev");

				// Adding location
				const location = history.location.state.location.replace(
					/\w\S*/g,
					(w) => w.replace(/^\w/, (c) => c.toUpperCase())
				);
				if (location !== "Masters") {
					onChange({ value: location, label: location }, "general", "loc");
				}
			}
			// Clears the state so it doesn't keep the state after a redirect
			history.replace({ ...history.location, state: null });
			setLoaded((prev) => ({
				...prev,
				state: true,
			}));
		}

		// If the competitions haven't already been loaded, load them
		if (comps === null) {
			getComps("competitions")
				.then((result) => {
					if (result !== undefined) {
						setComps(result[0]);
						setMasters(result[1]);

						// Filters the options based on the currently available competitions
						if (result[0] !== null && result[0] !== undefined) {
							let tempOps = [];
							for (const comp in result[0]) {
								// Add site value if it isn't a duplicate, and isn't Masters
								if (
									!tempOps.includes(capitalize(result[0][comp].site)) &&
									result[0][comp].site.toUpperCase() !== "MASTERS"
								) {
									tempOps.push(capitalize(result[0][comp].site));
								}
							}

							// Format sites
							tempOps.forEach((val, index) => {
								tempOps[index] = { value: val, label: val };
							});

							sessionStorage.setItem("filteredComps", JSON.stringify(tempOps));
							setOptions((prev) => ({
								...prev,
								locations: tempOps,
							}));
							setLocals(tempOps);
						}
					}
				})
				.catch((error) => console.error(error));
		} else {
			// Filters the options based on the currently available competitions
			if (comps !== undefined && !loaded.options) {
				let tempOps = [];
				for (const comp in comps) {
					// Add site value if it isn't a duplicate, and isn't Masters
					if (
						!tempOps.includes(capitalize(comps[comp].site)) &&
						comps[comp].site.toUpperCase() !== "MASTERS"
					) {
						tempOps.push(capitalize(comps[comp].site));
					}
				}

				// Format sites
				tempOps.forEach((val, index) => {
					tempOps[index] = { value: val, label: val };
				});

				sessionStorage.setItem("filteredComps", JSON.stringify(tempOps));
				setOptions((prev) => ({
					...prev,
					locations: tempOps,
				}));
				setLocals(tempOps);
				setLoaded((prev) => ({
					...prev,
					options: true,
				}));
			}
		}
	}, [
		choice.school,
		comps,
		history,
		loaded.options,
		loaded.state,
		onChange,
		options.school,
		user.school,
	]);

	return (
		<BasicPage>
			<h1>Team Registration</h1>
			<p>
				<b>Rules for Individuals:</b> Any student may compete as an individual
				in their grade level or any higher grade; however, a student may compete
				as a team at one grade level only. This applies to both Championships
				and Masters.
				<br />
				<br />
				Also note each team includes four students in addition to two alternates
				per school that can compete as individuals. So when registering n teams,
				you get to bring 4n+2 students along. These students don't need to be
				registered as individuals separately.
			</p>
			<TeamForm noValidate autoComplete="off">
				<Auto
					title="Competition Level"
					options={options.level}
					text="Select Your Grade Level"
					onChange={(_, newValue) => onChange(newValue, "level", "")}
					width={longest}
					value={choice.lev}
					error={choice.error}
				/>

				<Auto
					title="School Registering"
					options={options.school}
					text="Select Your School"
					onChange={(_, newValue) => onChange(newValue, "school", "")}
					width={longest}
					value={choice.school}
					error={choice.error}
				/>

				<Auto
					title="Competition Location"
					disabled={options.locations.length === 0}
					options={options.locations}
					text={
						options.locations.length === 0
							? "No locations for this competition level."
							: "Select Competition Location"
					}
					onChange={(_, newValue) => onChange(newValue, "location", "")}
					width={longest}
					value={choice.loc}
					error={choice.error}
				/>

				<Auto
					title="Number Teams"
					options={options.numteam}
					text="Select Number of Teams"
					onChange={(_, newValue) => onChange(newValue, "general", "team")}
					width={longest}
					value={choice.team}
					error={choice.error}
				/>

				<Auto
					title="Number Individuals"
					options={[...Array(11)].map((_, i) => ({
						label: String(i),
						value: String(i),
					}))}
					text="Select Number of Individuals"
					onChange={(_, newValue) => onChange(newValue, "general", "indiv")}
					width={longest}
					value={choice.indiv}
					error={choice.error}
				/>

				<div style={{ display: "flex" }}>
					<Grid item sm={3}>
						<p>Coach Name(s)</p>
					</Grid>
					<TextField
						error={choice.error && choice.coach === ""}
						helperText={
							choice.error && choice.coach === ""
								? "Please fill out to continue"
								: null
						}
						variant="outlined"
						margin="normal"
						required
						label="Coach Name(s)"
						value={choice.coach}
						onChange={(event) =>
							onChange(event.target.value, "general", "coach")
						}
						style={{
							width: longest,
							maxWidth: "65vw",
							marginRight: 0,
						}}></TextField>
				</div>

				<div style={{ display: "flex" }}>
					<Grid item sm={3}>
						<p>Additional Emails</p>
					</Grid>
					<TextField
						error={choice.error && choice.email === ""}
						helperText={
							choice.error && choice.email === ""
								? "Please fill out to continue"
								: "Example: notyour@email.com, another@coach.com"
						}
						variant="outlined"
						margin="normal"
						label="Other Emails"
						value={choice.email}
						onChange={(event) =>
							onChange(event.target.value, "general", "email")
						}
						style={{
							width: longest,
							maxWidth: "65vw",
							marginRight: 0,
						}}></TextField>
				</div>

				<Grid container>
					<Grid item sm={3}></Grid>
					<Grid item sm={3} width={longest}>
						<Button
							fullWidth
							variant="contained"
							onClick={onSubmit}
							style={{ background: "#3f51b5" }}>
							Continue
						</Button>
					</Grid>
				</Grid>
			</TeamForm>
			<p>
				A school's division level is assigned based on past performance at Math
				is Cool contests. For more details and a current list of schools and
				assignments, see&nbsp;
				<a href={divisions} target="_blank" rel="noreferrer">
					2018-19 Divisions
				</a>
				.
			</p>
		</BasicPage>
	);
}
