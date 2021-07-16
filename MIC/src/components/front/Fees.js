import React, { useState } from "react";

import Page from "./Page";

import fire from "../fire";

function Fees() {
  const [page, setPage] = useState("");

  fire.firestore().collection('pages').onSnapshot((snapshot) => {
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setPage(data[0].fees.value);
  })

  return (
    <Page title="Fees" page={page}/>
  );
}

export default Fees;

