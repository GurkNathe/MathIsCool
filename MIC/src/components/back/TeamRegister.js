import React, { useState, useEffect, useCallback } from "react";
import { useHistory } from "react-router-dom";

import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";

import { collection, where, getDocs, getDoc, doc } from "@firebase/firestore";
import { auth, db } from "../fire";

import { Alerts, TeamForm, Auto, BasicPage } from "../styledComps";
import getOptions from "../getOptions";

export default function TeamRegister() {
	const history = useHistory();

	const [options, setOptions] = useState({
		...JSON.parse(sessionStorage.getItem("options")),
		numteam: [
			{
				label: "0",
				value: "0",
			},
			{
				value: "1",
				label: "1",
			},
			{
				label: "2",
				value: "2",
			},
			{
				value: "3",
				label: "3",
			},
			{
				value: "4",
				label: "4",
			},
			{
				label: "5",
				value: "5",
			},
			{
				label: "6",
				value: "6",
			},
			{
				value: "7",
				label: "7",
			},
			{
				label: "8",
				value: "8",
			},
			{
				value: "9",
				label: "9",
			},
			{
				value: "10",
				label: "10",
			},
		],
	});

	/**
	 * Gets the competitions that are open (i.e. status == reg)
	 *
	 * @param {string} title : title of data wanted
	 * @returns {array} [0] : competition data; [1] : masters data
	 */
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

	// Tells whether the information was submitted properly
	const [sent, setSent] = useState({ sent: false, error: false });

	// Stores email and username of user
	const user = {
		email: sessionStorage.getItem("email"),
		name: sessionStorage.getItem("username"),
		school: sessionStorage.getItem("school"),
	};

	/**
	 * Gets the value for width of text fields
	 *
	 * @param {integer} longest : scaling factor for returned value if
	 *                            there are no options, or no strings > longest
	 * @returns {integer} : integer value for width of largest string in the options
	 */
	const getLongest = (longest) => {
		//finding length of longest string in options and resize search box accordingly
		if (options !== null) {
			for (const option in options) {
				for (let i = 0; i < Object.keys(options[option]).length; i++) {
					if (options[option][i].label.length > longest)
						longest = options[option][i].label.length;
				}
			}
		}

		//don't know if there is a good way to do this, couldn't find anything
		return longest * 10;
	};

	// Used for storing the width of the longest string that can be selected in the drop-downs
	const longest = getLongest(10);

	/**
	 * Capitalizes the words in the given string
	 *
	 * @param {string} phrase : String that is to be capitalized
	 * @returns {string} : capitalized string
	 */
	const capitalize = (phrase) => {
		return phrase.replace(/\b\w/g, (c) => c.toUpperCase());
	};

	// Checks data to make sure things are filled out,
	// and redirects to the goole form with prefilled info.
	const onSubmit = () => {
		const error = setError(choice);
		if (!error) {
			const compId = setCompID(choice, comps);
			if (compId !== undefined) {
				// Check if a valid school was entered
				let s = typeof(choice.school) === "object";

				if (s) {
					// Submits the Google Form
					fetch(setURL(choice, compId), {
						method: "POST"
					})
					.then(_ => {
						setSent( { sent: true, error: false } );
					})
					.catch(_ => {
						setSent( { sent: true, error: true } );
					})
				} else {
					history.push({
						pathname: `/team-register/bad-submit/`,
						state: {
							school: choice.school,
							email: user.email,
							name: user.name
						},
					});
				}


			} else {
				setError(true);
			}
		}
	};

	/**
	 * Sets the competition id for submission
	 *
	 * @param {object} choice : Information filled out
	 * @param {object} comps : Available competitions
	 * @returns {string} : Found competition ID
	 */
	const setCompID = useCallback((choice, comps) => {
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
			return competition.site.toUpperCase() === choice.loc.value.toUpperCase();
		});

		return tempComps[0].compId;
	}, []);

	/**
	 * Setting error if something is not filled out.
	 *
	 * @param {object} choice : Object containing all the input values for registration
	 * @returns {boolean} : whether there is a required field that is missing
	 */
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

	/**
	 * Sets iframe url for filling google form
	 *
	 * @param {object} choice : Object containing all the input values for registration
	 * @param {string} compId : ID of the competition selected
	 * @returns {string} : URL for registration form
	 */
	const setURL = (choice, compId) => {
		const uid = auth.currentUser.uid;

		let url = new URL(
			"https://docs.google.com/forms/d/e/1FAIpQLSf8UTjphTqcOHwmrdGEG8Jsbjz4eVz7d6XVlgW7AlnM28vq_g/formResponse?usp=pp_url"
		);

		url.searchParams.append("entry.1951055040", choice.coach);
		url.searchParams.append("entry.74786596", uid);
		url.searchParams.append("entry.62573940", choice.loc.value);
		url.searchParams.append("entry.1929366142", choice.lev.value);
		url.searchParams.append("entry.680121242", choice.team.value);
		url.searchParams.append("entry.641937550", choice.indiv.value);
		url.searchParams.append("entry.1389254068", choice.school.value + " " + choice.school.label + " - " + choice.school.div);
		url.searchParams.append("entry.1720714498", user.email + (choice.email ? ", " + choice.email : ""));
		url.searchParams.append("entry.1445326839", compId);

		return url.href;
	};

	/**
	 * Used for variable state on input change
	 *
	 * @param {*} newValue : New input value for changed field
	 * @param {string} type : Tells which value to change
	 * @param {string} field : Tells which value to change when
	 *                         a general value is being changed
	 */
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
								comps[comp].grade.includes(newValue.value) &&
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
									tempOps.push({
										value: "Masters",
										label: "Masters",
									});
									break;
								}
							}
							setOptions((prev) => ({
								...prev,
								locations: tempOps,
							}));
						} else {
							setOptions((prev) => ({
								...prev,
								locations: tempOps,
							}));
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
						// If there is a grade level selected, attempt to update number of teams
						if (choice.lev !== null) {
							// Get the competition id for the selected competition
							const compId = setCompID(
								{
									lev: choice.lev,
									loc: newValue,
								},
								comps
							);

							// Setting the number of teams allowed per registration
							for (const key in comps) {
								if (key === compId) {
									setOptions((prev) => ({
										...prev,
										numteam: [...Array(comps[key].schTeams + 1)].map(
											(_, i) => ({
												label: String(i),
												value: String(i),
											})
										),
									}));
									break;
								}
							}
						} else if (choice.numteam && choice.numteam.length !== 11) {
							setOptions((prev) => ({
								...prev,
								numteam: [...Array(11)].map((_, i) => ({
									label: String(i),
									value: String(i),
								})),
							}));
						}
					}
					setChoice((prevState) => ({
						...prevState,
						lev: choice.lev,
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

	/**
	 *  Used to handle the redirect information filling and filtering
	 *
	 * @param {object} comps : Data on all found competitions
	 * @param {object} masters : Data on which schools + grades can sign up for masters
	 * @param {object} competition : Data from the competition redirect
	 * @param {object} school : User favorited school
	 */
	const redirected = useCallback(
		(comps, masters, competition, school) => {
			// Setting values if redirected from competition calendar
			if (
				history.location.state.level !== null &&
				history.location.state.level !== undefined &&
				history.location.state.location !== null &&
				history.location.state.location !== undefined
			) {
				// Adding the competition level & location
				const location = history.location.state.location.replace(
					/\w\S*/g,
					(w) => w.replace(/^\w/, (c) => c.toUpperCase())
				);
				const level = history.location.state.level;
				setChoice((prevState) => ({
					...prevState,
					lev: level,
					loc:
						location !== "Masters"
							? { value: location, label: location }
							: null,
					error: false,
				}));

				// Filter options
				let tempOps = [];
				let currOps = [];
				for (const comp in comps) {
					// Add site value if it isn't a duplicate, and isn't Masters
					if (
						!tempOps.includes(capitalize(comps[comp].site)) &&
						comps[comp].site.toUpperCase() !== "MASTERS"
					) {
						tempOps.push(capitalize(comps[comp].site));
					}

					// Adding filtered sites for the grade level
					if (
						comps[comp].grade.includes(level.value) &&
						!currOps.includes(capitalize(comps[comp].site)) &&
						comps[comp].site.toUpperCase() !== "MASTERS"
					) {
						currOps.push(capitalize(comps[comp].site));
					}
				}

				// Format sites
				tempOps.forEach((val, index) => {
					tempOps[index] = { value: val, label: val };
				});
				currOps.forEach((val, index) => {
					currOps[index] = { value: val, label: val };
				});

				// Save all sites
				sessionStorage.setItem("filteredComps", JSON.stringify(tempOps));

				// Getting school id for chosen school
				let tempMasters = null;
				if (school !== null) {
					const id = school.value;
					// Checking if school is able to sign up for masters
					for (const option in masters.teams) {
						if (
							masters.teams[option].grade === level.value &&
							masters.teams[option].schoolID === id
						) {
							tempMasters = {
								value: "Masters",
								label: "Masters",
							};
							break;
						}
					}
				}

				// Add Masters option if possible
				if (tempMasters !== null) {
					currOps.push(tempMasters);
				}

				const numteams = competition.schTeams;
				// Save sites with correct grade level and number of teams allowed
				setOptions((prev) => ({
					...prev,
					numteam: [...Array(numteams + 1)].map((_, i) => ({
						label: String(i),
						value: String(i),
					})),
					locations: currOps,
				}));
				setLocals(tempOps);
			}

			// Clears the state so it doesn't keep the state after a redirect
			setLoaded((prev) => ({
				...prev,
				state: true,
			}));
			history.replace({ ...history.location, state: null });
		},
		[history]
	);

	useEffect(() => {
		if (options !== null) {
			let potentialSchool = null;
			// If the user has a selected school (profile school), use it
			if (user.school && !choice.school) {
				let school = {};
				options.school.forEach((data, index) => {
					if (data.label === user.school) {
						school = options.school[index];
					}
				});
				potentialSchool = school;
				onChange(school, "school", "");
			}

			// If the competitions haven't already been loaded, load them
			if ((comps === null || masters === null) && !loaded.state) {
				getComps("competitions")
					.then((result) => {
						if (result !== undefined) {
							setComps(result[0]);
							setMasters(result[1]);

							// Filters the options based on the currently available competitions
							if (
								result[0] !== null &&
								result[0] !== undefined &&
								history.location.state !== null &&
								history.location.state !== undefined &&
								!loaded.state
							) {
								// Checks for redirect from competitions page
								const comp = history.location.state.competition;
								redirected(result[0], result[1], comp, potentialSchool);
							} else if (
								result[0] !== null &&
								result[0] !== undefined &&
								!loaded.state
							) {
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

								sessionStorage.setItem(
									"filteredComps",
									JSON.stringify(tempOps)
								);
								setOptions((prev) => ({
									...prev,
									locations: tempOps,
								}));
								setLocals(tempOps);
								setLoaded((prev) => ({
									...prev,
									state: true,
								}));
							}
						}
					})
					.catch((error) => console.error(error));
			} else if (!loaded.state) {
				// Filters the options based on the currently available competitions
				if (comps !== undefined && !loaded.options) {
					// If redirected and competition data already loaded
					if (
						history.location.state !== null &&
						history.location.state !== undefined
					) {
						// Checks for redirect from competitions page
						const comp = history.location.state.competition;
						redirected(comps, masters, comp, potentialSchool);
					} else {
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
			}
		} else {
			getOptions(setOptions);
		}
	}, [
		choice.school,
		comps,
		history.location.state,
		loaded.options,
		loaded.state,
		onChange,
		options,
		redirected,
		user.school,
		masters,
	]);

	return (
		<BasicPage>
			<Alerts
				open={sent.sent}
				handleClose={() => setSent({ sent: false, error: false })}
				type={!sent.error ? "success" : "error"}
				message={
					sent.error ? 
						"An error occured upon submitting. If you do not receive an email confirming your registration, please submit again, or contact a website administrator." :
						"Successfully registered for competition. You should receive a confirmation email shortly."
				}
			/>
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
							Submit
						</Button>
					</Grid>
				</Grid>
			</TeamForm>
			<p>
				A school's division level is assigned based on past performance at Math
				is Cool contests. For more details and a current list of schools and
				assignments, see&nbsp;
				<a href="/assets/docs/divisions.pdf" target="_blank" rel="noreferrer">
					2018-19 Divisions
				</a>
				.
			</p>
		</BasicPage>
	);
}
