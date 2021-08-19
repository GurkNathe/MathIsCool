import React, { useState, useEffect } from "react";

import Page from "./Page";

import getWeb from "./getWeb";

function History() {
  const [page, setPage] = useState("");

  const title = "history";

  useEffect(() => {
    getWeb(title);
    if(localStorage.getItem(title))
      setPage(JSON.parse(localStorage.getItem(title)).history.value);
  }, [])

  return (
    <Page title="History" page={page}/>
  );
}

export default History;

