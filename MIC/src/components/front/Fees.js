import React, { useState, useEffect } from "react";

import { Page } from "../styledComps";

import getWeb from "./getWeb";
import getPage from "./getPage";

export default function Fees() {
  const title = "fees";
  const [page, setPage] = useState(getPage(title, "value"));
  
  useEffect(() => {
    getWeb(title).then((result) => {
      result !== undefined ? setPage(result.value) : setPage(page);
    })
  }, [page])

  return (
    <Page title="Fees" page={page}/>
  );
}
