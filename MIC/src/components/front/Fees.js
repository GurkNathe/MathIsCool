import React, { useState } from "react";

import Page from "./Page";

import fire from "../fire";

function Fees() {
  const [page, setPage] = useState("");

  fire.firestore().collection('web').doc('fees').get()
    .then((doc) => {
      setPage(doc.data().fees.value);
    })
    .catch((error) => {
      console.log(error);
    })

  return (
    <Page title="Fees" page={page}/>
  );
}

export default Fees;

