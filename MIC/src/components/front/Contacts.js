import React, { useState, useEffect } from "react";

import Page from "./Page";
// import { map } from "../assets.js"; //not working
import getWeb from "./getWeb";
import getPage from "./getPage";

export default function Contacts() {
  const title = "whotocall";
  const [page, setPage] = useState(getPage(title, "value"));
  

  useEffect(() => {
    getWeb(title).then((result) => {
      result !== undefined ? setPage(result.value) : setPage(page);
    })
  }, [page])

  return (
    <Page title="Contacts" page={page}/>
  );
}
