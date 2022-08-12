import React, { useState } from "react";
import { Accord, BasicPage } from "../styledComps";
import Select from "react-select";

import ops from "../back/options.json";
import { Button } from "@mui/material";

import { doc, setDoc } from "firebase/firestore";
import { db } from "../fire";

// Add a new document in collection "cities"

export default function FlexLayoutGrid() {
	const [state, setState] = useState("team");

	const options = [
		{ value: "team", label: "Team" },
		{ value: "masters team", label: "Masters Team" },
	];

	const [thing, setThing] = useState(ops);

	return (
		<BasicPage>
			<Select
				defaultValue={state}
				options={options}
				onChange={(event) => {
					setState(event.value);
				}}
			/>
			<Accord key={1} title="Test" content="Testing this" />
			<Button
				onClick={() => {
					console.log(thing);
					// setDoc(doc(db, "web", "options"), ops);
				}}
			/>
		</BasicPage>
	);
}
