import React, { useState, useEffect } from "react";

import Page from "./Page";

// import fire from "../fire";

function Rules() {
  const [page, setPage] = useState("");

  // fire.firestore().collection('web').doc('rules').get()
  //   .then((doc) => {
  //     setPage(doc.data().rules.value);
  //   })
  //   .catch((error) => {
  //     console.log(error);
  //   })
  
  useEffect(() => {
    setPage(JSON.parse(localStorage.getItem('rules')).rules.value);
  }, [])

  return (
    <Page title="Rules" page={page}/>
  );
}

export default Rules;


