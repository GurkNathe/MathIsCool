import React, { useState, useEffect } from "react";

import Page from "./Page";

// import fire from "../fire";

function Contacts() {
  const [page, setPage] = useState("");

  // fire.firestore().collection('web').doc('whotocall').get()
  //   .then((doc) => {
  //     setPage(doc.data().whotocall.value);
  //   })
  //   .catch((error) => {
  //     console.log(error);
  //   })

  useEffect(() => {
    setPage(JSON.parse(localStorage.getItem('whotocall')).whotocall.value);
  }, [])

  return (
    <Page title="Contacts" page={page}/>
  );
}

export default Contacts;

