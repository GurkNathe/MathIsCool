import React, { useState, useEffect, useCallback } from "react";
import { Snackbar, Alert } from "@mui/material";
import {
	LayerOne,
	LayerTwo,
	LayerThree,
	ImageSet,
	Image,
} from "../styledComps.js";
import { useHistory } from "react-router-dom";
import { math, lake, train, wp, donate } from "../assets.js";

import getWeb from "./getWeb";
import getPage from "./getPage";

export default function Home(props) {
	const history = useHistory();
	const title = "news";
	const [news, setNews] = useState(getPage(title, "records"));
	const [open, setOpen] = useState(
		props.location.state ? props.location.state.alert : false
	);

	//holding names of articles
	var test = [];

	const handleClose = useCallback(() => {
		setOpen(false);
		history.replace({ state: undefined });
	}, [history]);

	useEffect(() => {
		getWeb(title).then((result) => {
			result !== undefined ? setNews(result.records) : setNews(news);
		});
		if (open) {
			// used to close snackbar if no clicking happens
			setTimeout(() => {
				handleClose();
			}, props.location.state.duration);
		}
	}, [news, handleClose, open, props.location.state]);

	//getting article names
	for (const i in news) {
		test.push(i);
	}

	test.sort(); //sorting names

	//getting article data in order
	for (let i = 0; i < test.length; i++) {
		test[i] = news[test[i]];
	}

	return (
		<LayerOne>
			{props.location.state ? (
				<Snackbar
					open={open}
					onClose={handleClose}
					anchorOrigin={{ vertical: "top", horizontal: "center" }}>
					<Alert severity={props.location.state.severity} variant="filled">
						{props.location.state.message}
					</Alert>
				</Snackbar>
			) : null}
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
