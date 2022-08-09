import React, { useState, useEffect } from "react";

import { Page } from "../styledComps";
import getWeb from "./getWeb";
import getPage from "./getPage";

export default function Contacts() {
	const title = "whotocall";
	const [page, setPage] = useState(getPage(title, "value"));

	useEffect(() => {
		getWeb(title)
			.then((result) => {
				result !== undefined ? setPage(result.value) : setPage(page);
			})
			.catch((error) => {
				console.error(error);
			});
	}, [page]);

	return <Page title="Contacts" page={page} />;
}
