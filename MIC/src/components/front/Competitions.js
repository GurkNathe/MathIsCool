import React, { useState, useEffect } from "react";
import fire from "../fire";
import getWeb from "./getWeb";

function Competitions() {
  const [comp, setComp] = useState("");

  const title = "competitions";

  useEffect(() => {
    getWeb(title);
    if(localStorage.getItem(title))
      setComp(JSON.parse(localStorage.getItem(title)).competitions.records);
  }, [])

  console.log(comp);
  const uid = "0";

  const reg = { 
    [uid]:{
      numTeams: 0,
      numIndividuals: 0,
      schoolID: 0,
    }
  }

  const onClick = () => {
    console.log(comp)
    for(const i in comp){
      fire.firestore().collection("competitions")
      .add({...comp[i], registration: reg})
      .then(console.log("done"))
      .catch(err => {console.log(err)})
    }
  }

  return (
    <div className="Competitions">
      <button onClick={null}>Competitions</button>
    </div>
  );
}

export default Competitions;
