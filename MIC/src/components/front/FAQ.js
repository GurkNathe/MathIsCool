import React, { useState, useEffect } from "react";

import { Accord, BasicPage } from "../styledComps";
import getWeb from "./getWeb";
import getPage from "./getPage";

export default function FAQ() {
	const title = "faq";
	const [faq, setFAQ] = useState(getPage(title, "records"));

	// Stores each section on the FAQ page
	let sections = [];

	// Stores the title of each section
	let titles = [];

	useEffect(() => {
		getWeb(title).then((result) => {
			result !== undefined ? setFAQ(result.records) : setFAQ(faq);
		});
	}, [faq]);

	// Used for sorting the questions by section
	for (const i in faq) {
		if (faq[i].answer !== undefined && faq[i].answer !== null) {
			// Check if Q&A should be shown
			if (faq[i].visible) {
				const digit = Math.floor((Number(i) + 100) / 100) - 2;
				sections[digit] = {
					...sections[digit],
					[i]: faq[i],
				};
			}
		} else {
			titles.push(faq[i].question);
		}
	}

	return (
		<BasicPage>
			<h1 style={{ fontStyle: "italic" }}>FAQ</h1>
			{sections.map((group, index) => {
				return (
					<div key={index}>
						<p>
							<b>{titles[index]}</b>
						</p>
						{Object.values(group).map((quest, ind) => {
							return (
								<Accord
									key={ind}
									title={quest.question}
									content={quest.answer}
								/>
							);
						})}
					</div>
				);
			})}
		</BasicPage>
	);
}
