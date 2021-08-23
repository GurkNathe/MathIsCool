import React, { useState, useEffect } from "react";

import Page from "./Page";

import getWeb from "./getWeb";
import getPage from "./getPage";

function Fees() {
  const [page, setPage] = useState("");

  const title = "fees";

  useEffect(() => {
    getWeb(title)
    setPage(getPage(title, "value"))
  }, [])

  return (
    <Page title="Fees" page={page}/>
  );
}

export default Fees;

