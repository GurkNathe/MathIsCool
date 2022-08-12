import React, { useState, useEffect, useCallback } from "react";
import {
	Alerts,
	LayerOne,
	LayerTwo,
	LayerThree,
	ImageSet,
	Image,
} from "../styledComps.js";
import { useHistory } from "react-router-dom";

// Static Images for side of homepage
// ? Should this be changed to easily allow updating the pictures? (Storage)
import { math, lake, train, wp, donate } from "../assets.js";

// Used to get the page contents if they are not already loaded
import getWeb from "./getWeb";

// Used to get the page contents if they are already loaded
import getPage from "./getPage";

// TODO: Get PayPal link for the organizations
// TODO: Figure out how to get the links to work
/**
 *  @param {object} props.state :
 *      @param {boolean} alert - tells whether an alert is shown
 *      @param {string}  message - the alert message
 *      @param {string}  severity - type of alert (e.g., error, success)
 */
export default function Home(props) {
	const history = useHistory();
	const title = "news";
	const [news, setNews] = useState(getPage(title, "records"));
	const [open, setOpen] = useState(
		props.location.state ? props.location.state.alert : false
	);

	// Used to close alerts
	const handleClose = useCallback(() => {
		setOpen(false);
		history.replace({ state: undefined });
	}, [history]);

	useEffect(() => {
		getWeb(title).then((result) => {
			result !== undefined ? setNews(result.records) : setNews(news);
		});
	}, [news]);

	// Holding names of articles
	let test = [];

	// Getting article names
	for (const i in news) {
		// Check if the article is supposed to be shown
		if (news[i].visible) {
			test.push(i);
		}
	}

	//Sorting articles by priority
	test.sort((a, b) => {
		return news[a].priority - news[b].priority;
	});

	// Getting article data in order
	for (let i = 0; i < test.length; i++) {
		test[i] = news[test[i]];
	}

	return (
		<LayerOne>
			<Alerts
				open={open}
				handleClose={handleClose}
				type={props.location.state ? props.location.state.severity : "success"}
				message={props.location.state ? props.location.state.message : ""}
			/>
			<LayerTwo>
				<LayerThree>
					<h1 style={{ fontStyle: "italic" }}>What's Happening</h1>
					<>
						{test.map((doc) => {
							return (
								<p key={doc.title}>
									<b>{doc.title}:</b>&nbsp;
									<span
										dangerouslySetInnerHTML={{ __html: doc.article }}></span>
								</p>
							);
						})}
					</>
				</LayerThree>
			</LayerTwo>
			<ImageSet>
				<a
					href="https://www.paypal.com/us/home"
					target="_blank"
					rel="noreferrer">
					<img
						src={donate}
						alt="PayPal"
						style={{ width: "50%", borderRadius: "5px", marginBottom: "1%" }}
					/>
				</a>
				<Image src={math} alt="math" />
				<Image src={lake} alt="lake" />
				<Image src={train} alt="train" />
				<Image src={wp} alt="wp" />
			</ImageSet>
		</LayerOne>
	);
}
