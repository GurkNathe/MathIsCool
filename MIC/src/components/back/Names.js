import React, { useState, useEffect } from "react";
import { Typography } from "@mui/material";
import ReactLoading from "react-loading";
import { NamesOne, NamesTwo, NamesThree } from "../styledComps";
import Table from "../custom/Table";
import options from "./options.json";
import { getDocs, collection } from "@firebase/firestore";
import { auth, db } from "../fire";

//returns the values of #individuals and #teams for each competition where the current user
//signed up the chosen school
async function getComps() {
	try {
		const comps = await getDocs(collection(db, "competitions"));
		var competitions = [];
		if (comps.empty) {
			return;
		} else {
			comps.forEach((doc) => {
				const register = doc.data().registration;

				//gets the proper grade level displays
				var grade = doc.data().grade.substr(1);
				var grades = [];
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
}

export default function Names() {
	// Used to store the schools the current user has registered for
	var schoolData = [];
	// Registration data that current user has submitted
	const [compData, setComp] = useState([]);
	const [loading, setLoading] = useState(true);
	const [selected, setSelected] = useState(0);
	const [loadedComps, setLoadedComps] = useState([]);

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

					//checks if there are teams/individuals signed up for a competition
					if (vals[val].teams !== 0 || vals[val].indiv !== 0) {
						setLoading(false);
					}
				}
			});
		}
	}, [compData.length]);

	//gets school names
	if (!loading && schoolData.length === 0) {
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
					{!loading ? (
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
