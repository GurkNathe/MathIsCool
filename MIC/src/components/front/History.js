import React, { useState, useEffect } from "react";

import Page from "./Page";

// import fire from "../fire";

function History() {
  const [page, setPage] = useState("");

  // fire.firestore().collection('web').doc('history').get()
  //   .then((doc) => {
  //     setPage(doc.data().history.value);
  //   })
  //   .catch((error) => {
  //     console.log(error);
  //   })
  
  useEffect(() => {
    setPage(JSON.parse(localStorage.getItem('history')).history.value);
  }, [])

  return (
    <Page title="History" page={page}/>
  );
}

export default History;

