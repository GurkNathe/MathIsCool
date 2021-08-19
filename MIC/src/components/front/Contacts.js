import React, { useState, useEffect } from "react";

import Page from "./Page";

import getWeb from "./getWeb";

function Contacts() {
  const [page, setPage] = useState("");

  const title = "whotocall";

  useEffect(() => {
    getWeb(title);
    if(localStorage.getItem(title))
      setPage(JSON.parse(localStorage.getItem(title)).whotocall.value);
  }, [])

  return (
    <Page title="Contacts" page={page}/>
  );
}

export default Contacts;
