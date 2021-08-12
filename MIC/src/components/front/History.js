import React, { useState } from "react";

import Page from "./Page";

import fire from "../fire";

function History() {
  const [page, setPage] = useState("");

  fire.firestore().collection('web').doc('history').get()
    .then((doc) => {
      setPage(doc.data().history.value);
    })
    .catch((error) => {
      console.log(error);
    })

  return (
    <Page title="History" page={page}/>
  );
}

export default History;

