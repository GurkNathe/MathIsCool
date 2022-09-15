import React, { useState, useEffect } from "react";

import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";

import { doc, getDoc } from "@firebase/firestore";
import { ref, getDownloadURL } from "@firebase/storage";
import { db, storage } from "../fire";

import { BasicPage, Td, Th } from "../styledComps";

import getOptions from "../getOptions";

export default function PastTests() {
	// Used to control the state of which grade of tests are shown
	const [chosen, setChosen] = useState(null);

	// Database reference for each pdf file (necessary for downloading)
	const [samples, setSamples] = useState(
		JSON.parse(sessionStorage.getItem("samples"))
	);

	// Options object
	const [options, setOptions] = useState(
		JSON.parse(sessionStorage.getItem("options"))
	);

	// Holds the array of results for table construction
	const [year, setYear] = useState([]);

	// Gets the database information about the past tests
	const getSamples = async () => {
		const samps = await getDoc(doc(db, "web", "samples"));
		sessionStorage.setItem("samples", JSON.stringify(samps.data().records));
		return samps.data().records;
	};

	/**
	 * Filters samples for the chosen grade level
	 *
	 * @param {string} grade : grade level of tests chosen
	 * @returns {object} : chosen samples
	 */
	const getChosenSamples = (grade) => {
		const stuff = Object.values(samples).filter((sample) => {
			return sample.level === grade + "th";
		});

		return stuff;
	};

	/**
	 * Gets the sample info for the chosen grade level.
	 *
	 * @param {object} items : samples for selected grade level
	 * @returns {array} : list of past tests sorted by years for selected grade level
	 */
	const getYears = (items) => {
		let arr = [];
		items.forEach((sampled) => {
			// Checking if alredy in array.
			let contained = false;
			arr.forEach((item) => {
				if (item.year === sampled.year) {
					contained = true;
				}
			});

			// Getting the URL for the current test.
			if (!contained) {
				arr.push({
					year: sampled.year,
					data: [{ desc: sampled.description, url: sampled.url }],
				});
			} else {
				arr.forEach((item) => {
					if (item.year === sampled.year) {
						item.data.push({ desc: sampled.description, url: sampled.url });
					}
				});
			}
		});

		arr.sort((a, b) => {
			if (Number(a.year.substr(0, 4)) > Number(b.year.substr(0, 4))) {
				return 1;
			} else {
				return -1;
			}
		});

		return arr;
	};

	/**
	 * Gets link to pdf for past test
	 *
	 * @param {string} url : url for the past test chosen
	 */
	const getLink = (url) => {
		url = url.replace(/%20/g, " ");
		getDownloadURL(ref(storage, `Past Tests/${url}`)).then((link) => {
			window.open(link, "_blank").focus();
		});
	};

	// Gets all samples from database
	useEffect(() => {
		if (options === null) {
			getOptions(setOptions);
		}
		if (samples === null || samples === undefined) {
			getSamples().then((sampleInfo) => {
				setSamples(sampleInfo);
			});
		}
	}, [samples, options]);

	return (
		<BasicPage>
			<h1 style={{ fontStyle: "italic" }}>Past Tests</h1>
			<span>Choose Grade Level: </span>
			{options
				? options.level.map((item, index) => {
						return (
							<Button
								key={index}
								style={{ padding: "10px", margin: "10px" }}
								variant={chosen === item.label ? "contained" : "outlined"}
								color="primary"
								onClick={() => {
									let val =
										chosen === null
											? item.label
											: chosen === item.label
											? null
											: item.label;

									// The past tests for the chosen grade.
									const gradeSamples = getChosenSamples(val);

									// Set value for grade selection feedback
									setChosen(val);

									// Set the past tests for the chosen grade.
									setYear(getYears(gradeSamples));
								}}>
								{item.label}
							</Button>
						);
				  })
				: null}
			<Divider />
			{chosen === null ? (
				<p
					style={{
						display: "flex",
						height: "100%",
						justifyContent: "center",
						alignItems: "center",
						opacity: "0.5",
						marginTop: "10%",
					}}>
					No grade level selected.
				</p>
			) : (
				<table
					style={{
						width: "100%",
						marginTop: "1%",
						border: "2px inset black",
						borderCollapse: "collapse",
					}}>
					<thead>
						<tr>
							<Th style={{ width: "20%" }}>Year</Th>
							<Th>Test Description</Th>
						</tr>
					</thead>
					<tbody>
						{year.length !== 0 ? (
							year.map((item, index) => {
								return (
									<tr key={index}>
										<Td>{item.year}</Td>
										<Td>
											{item.data.map((data, index) => {
												return (
													<React.Fragment key={index}>
														<Button onClick={() => getLink(data.url)}>
															{data.desc}
														</Button>
														{index !== item.data.length - 1 ? " : " : null}
													</React.Fragment>
												);
											})}
										</Td>
									</tr>
								);
							})
						) : (
							<p>There is an issue loading the samples.</p>
						)}
					</tbody>
				</table>
			)}
		</BasicPage>
	);
}
