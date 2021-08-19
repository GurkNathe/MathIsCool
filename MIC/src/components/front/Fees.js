import React, { useState, useEffect } from "react";

import Page from "./Page";

import getWeb from "./getWeb";

function Fees() {
  const [page, setPage] = useState("");

  const title = "fees";

  useEffect(() => {
    getWeb(title)
    if(localStorage.getItem(title))
      setPage(JSON.parse(localStorage.getItem(title)).fees.value);
  }, [])

  return (
    <Page title="Fees" page={page}/>
  );
}

export default Fees;

