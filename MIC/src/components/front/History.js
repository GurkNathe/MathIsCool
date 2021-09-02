import React, { useState, useEffect } from "react";

import Page from "./Page";

import getWeb from "./getWeb";
import getPage from "./getPage";

export default function History() {
  const [page, setPage] = useState("");

  const title = "history";

  useEffect(() => {
    getWeb(title);
    setPage(getPage(title, "value"))
  }, [])

  return (
    <Page title="History" page={page}/>
  );
}
