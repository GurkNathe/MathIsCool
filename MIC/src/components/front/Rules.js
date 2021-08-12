import React, { useState } from "react";

import Page from "./Page";

import fire from "../fire";

function Rules() {
  const [page, setPage] = useState("");

  fire.firestore().collection('web').doc('rules').get()
    .then((doc) => {
      setPage(doc.data().rules.value);
    })
    .catch((error) => {
      console.log(error);
    })

  return (
    <Page title="Rules" page={page}/>
  );
}

export default Rules;


