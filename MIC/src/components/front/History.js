import React, { useState } from "react";

import Page from "./Page";

import fire from "../fire";

function History() {
  const [page, setPage] = useState("");

  fire.firestore().collection('pages').onSnapshot((snapshot) => {
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setPage(data[0].history.value);
  })

  return (
    <Page title="History" page={page}/>
  );
}

export default History;

