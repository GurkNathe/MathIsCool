import React, { useState, useEffect } from "react";
import { LayerOne, LayerTwo, LayerThree, Map } from "../styledComps.js";

import { map } from "../assets.js";
import getPage from "./getPage";
import getWeb from "./getWeb";

export default function Locations() {
	const title = "sites";
	const [loc, setLoc] = useState(getPage(title, "records"));

	//holding names of sites
	let locations = [];

	useEffect(() => {
		getWeb(title).then((result) => {
			result !== undefined ? setLoc(result.records) : setLoc(loc);
		});
	}, [loc]);

	//getting site names
	for (const i in loc) {
		locations.push(loc[i].name);
	}

	//sorting site names
	locations.sort();

	//alphabetically ordering getting site names
	for (const i in locations) {
		for (const j in loc) {
			if (locations[i] === loc[j].name) locations[i] = loc[j];
		}
	}

	return (
		<LayerOne>
			<LayerTwo>
				<LayerThree>
					<h1 style={{ fontStyle: "italic" }}>Locations</h1>
					<div style={{ display: "flex" }}>
						<div style={{ marginRight: "10px" }}>
							<h3>WEST</h3>
							{locations.map((doc) => {
								return doc.region === "west" ? (
									<span key={doc.name}>
										<a href={doc.mapUrl}>{doc.name}</a> -{doc.street},{" "}
										{doc.city}
										<br />
									</span>
								) : null;
							})}
							<h3>CENTRAL</h3>
							{locations.map((doc) => {
								return doc.region === "central" ? (
									<span key={doc.name}>
										<a href={doc.mapUrl}>{doc.name}</a> -{doc.street},{" "}
										{doc.city}
										<br />
									</span>
								) : null;
							})}
							<h3>EAST</h3>
							{locations.map((doc) => {
								return doc.region === "east" ? (
									<span key={doc.name}>
										<a href={doc.mapUrl}>{doc.name}</a> -{doc.street},{" "}
										{doc.city}
										<br />
									</span>
								) : null;
							})}
							<h3>MASTERS</h3>
							{locations.map((doc) => {
								return doc.region === "masters" ? (
									<span key={doc.name}>
										<a href={doc.mapUrl}>{doc.name}</a> -{doc.street}
										{doc.city === " " ? null : ","} {doc.city}
										<br />
									</span>
								) : null;
							})}
						</div>
						<Map src={map} alt="map" />
					</div>
				</LayerThree>
			</LayerTwo>
		</LayerOne>
	);
}
