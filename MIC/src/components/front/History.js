import React, { useState, useEffect } from "react";

import Page from "./Page";

import getWeb from "./getWeb";
import getPage from "./getPage";

export default function History() {
  const title = "history";
  const [page, setPage] = useState(getPage(title, "value"));

  useEffect(() => {
    getWeb(title).then((result) => {
      result !== undefined ? setPage(result.value) : setPage(page);
    })
  }, [page])

  return (
    <Page title="History" page={page}/>
  );
}
