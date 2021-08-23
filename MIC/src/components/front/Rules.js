import React, { useState, useEffect } from "react";

import Page from "./Page";

import getWeb from "./getWeb";
import getPage from "./getPage";

function Rules() {
  const [page, setPage] = useState("");

  const title = "rules";

  useEffect(() => {
    getWeb(title);
    setPage(getPage(title, "value"))
  }, [])

  return (
    <Page title="Rules" page={page}/>
  );
}

export default Rules;


