import React, { useState, useEffect } from "react";

import Page from "./Page";

import getWeb from "./getWeb";

function Rules() {
  const [page, setPage] = useState("");

  const title = "rules";

  useEffect(() => {
    getWeb(title);
    if(localStorage.getItem(title))
      setPage(JSON.parse(localStorage.getItem(title)).rules.value);
  }, [])

  return (
    <Page title="Rules" page={page}/>
  );
}

export default Rules;


