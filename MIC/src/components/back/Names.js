import React, { useState, useEffect } from "react";
import { Typography } from "@mui/material";
import ReactLoading from "react-loading";
import { getDocs, collection } from "@firebase/firestore";
import { auth, db } from "../fire";

import { NamesOne, NamesTwo, NamesThree } from "../styledComps";
import Table from "../custom/Table";
import options from "./options.json";

export default function Names() {
	// Used to store the schools the current user has registered for
	let schoolData = [];
	// Registration data that current user has submitted
	const [compData, setComp] = useState([]);
	const [loading, setLoading] = useState(true);
	const [selected, setSelected] = useState(0);
	// Cached competition data
	const [loadedComps, setLoadedComps] = useState([]);

	// Returns the values of # individuals and # teams for each competition
	// where the current user signed up the chosen school
	const getComps = async () => {
		try {
			const comps = await getDocs(collection(db, "competitions"));
			let competitions = [];
			if (comps.empty) {
				return;
			} else {
				comps.forEach((doc) => {
					const register = doc.data().registration;

					//gets the proper grade level displays
					const grade = doc.data().grade.substr(1);
					let grades = [];
					for (const item in options.level) {
						for (const char in grade) {
							if (options.level[item].value === grade[char]) {
								grades.push(options.level[item].label);
								break;
							}
						}
					}
					const title = `Grade ${
						grades.length > 2 ? grades.join(", ") : grades.join(" and ")
					} Competition on ${doc.data().compDate}`;

					//adds the competitions that current user has signed up for
					for (const sign in register) {
						if (register[sign].uid === auth.currentUser.uid) {
							competitions.push({
								regID: sign,
								compID: doc.id,
								title: title,
								teams: register[sign].numTeams,
								indiv: register[sign].numIndividuals,
								schoolID: register[sign].schoolID,
							});
						}
					}
				});
				return competitions;
			}
		} catch (err) {
			console.log("ERROR:", err);
		}
	};

	useEffect(() => {
		//gets registrations
		if (compData.length === 0) {
			getComps().then((vals) => {
				for (const val in vals) {
					if (vals[val] !== undefined) {
						setComp((prevState) => [
							...prevState,
							{
								regId: vals[val].regID,
								compId: vals[val].compID,
								title: vals[val].title,
								teams: vals[val].teams,
								indivs: vals[val].indiv,
								schoolID: vals[val].schoolID,
							},
						]);
					}
				}
				setLoading(false);
			});
		}
	}, [compData.length]);

	// Gets school names if :
	// not loading, hasn't already been loaded, and there are actually competitions
	if (!loading && schoolData.length === 0 && compData.length > 0) {
		for (const item in compData) {
			for (const option in options.school) {
				if (compData[item].schoolID === options.school[option].value) {
					schoolData.push(options.school[option].label);
					break;
				}
			}
		}
	}

	return (
		<NamesOne>
			<NamesTwo>
				<NamesThree>
					{!loading && compData.length > 0 ? (
						<Table
							title={compData[selected].title + " for " + schoolData[selected]}
							teams={compData[selected].teams}
							individuals={compData[selected].indivs}
							id={compData[selected].compId}
							regId={compData[selected].regId}
							page={selected}
							registers={compData.length}
							changePage={setSelected}
							cachedData={loadedComps}
							setCachedData={setLoadedComps}
						/>
					) : !loading ? (
						<Typography style={{ opacity: "50%" }}>
							You have no registrations.
						</Typography>
					) : (
						<ReactLoading
							type="spinningBubbles"
							color="#000"
							style={{ width: "50px", height: "50px" }}
						/>
					)}
				</NamesThree>
			</NamesTwo>
		</NamesOne>
	);
}
