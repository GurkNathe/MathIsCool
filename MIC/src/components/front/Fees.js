import React, { useState, useEffect } from "react";

import Page from "./Page";

// import fire from "../fire";

function Fees() {
  const [page, setPage] = useState("");

  // fire.firestore().collection('web').doc('fees').get()
  //   .then((doc) => {
  //     setPage(doc.data().fees.value);
  //   })
  //   .catch((error) => {
  //     console.log(error);
  //   })

  useEffect(() => {
    setPage(JSON.parse(localStorage.getItem('fees')).fees.value);
  }, [])

  return (
    <Page title="Fees" page={page}/>
  );
}

export default Fees;

