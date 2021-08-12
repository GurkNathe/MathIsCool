import React, { useState } from "react";

import Page from "./Page";

import fire from "../fire";

function Contacts() {
  const [page, setPage] = useState("");

  fire.firestore().collection('web').doc('whotocall').get()
    .then((doc) => {
      setPage(doc.data().whotocall.value);
    })
    .catch((error) => {
      console.log(error);
    })

  return (
    <Page title="Contacts" page={page}/>
  );
}

export default Contacts;

