import React, { useState, useEffect } from "react";

import Page from "./Page";
import { map } from "../assets.js"; //not working
import getWeb from "./getWeb";
import getPage from "./getPage";

function Contacts() {
  const [page, setPage] = useState("");

  const title = "whotocall";

  useEffect(() => {
    getWeb(title);
    setPage(getPage(title, "value"));
  }, [])

  return (
    <Page title="Contacts" page={page}/>
  );
}

export default Contacts;
