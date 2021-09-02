import React, { useState, useEffect } from "react";
import fire from "../fire";
import getWeb from "./getWeb";

export default function Competitions() {
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
    // console.log(comp)
    // for(const i in comp){
    //   fire.firestore().collection("competitions")
    //   .add({...comp[i], registration: reg})
    //   .then(console.log("done"))
    //   .catch(err => {console.log(err)})
    // }
    console.log("doing")
    fire.firestore().collection("competitions")
      .doc("Dv446ASPVxNOLriehOok")
      .set({
        schTeams: 8,
        regDate: "11/12/2020",
        timestamp: 1617133987894,
        registration: {},
        user: "tom",
        year: "2020-21",
        maxTeams: 200,
        contact: "Gregg Sampson",
        status: "reg",
        id: 1,
        schedule: "3:00 - 3:10\nOrientation\n3:10 - 3:25\nMental Math          (8 questions, 30 sec./question)\n3:30 - 4:05\nIndividual Test      (40 questions, 35 min.)\n4:10 - 4:25\nIndivid. M.C. Test   (10 quest., 15 min., Multiple choice)\n4:35 - 4:50\nTeam Test               (10 questions, 15 min.)\n4:55 - 5:05\nPressure Round      (5 quest., 10 min. --> 1 ans./2 min.)\n5:15 - 5:30\nCollege Bowl 1/2    (10 Questions each)\n5:30 - 5:45\nCollege Bowl 3/4    (10 Questions each)\n5:45 - 6:00\nCollege Bowl 5/6    (10 Questions each)\n6:00\nContest WrapUp\n",
        compDate: "12/02/2020",
        site: "online",
        email: "registrar@academicsarecool.com",
        grade: "G91"
    })
    .then(console.log("done"))
  .catch(err => {console.log(err)})
  }

  return (
    <div className="Competitions">
      <button onClick={onClick}>Competitions</button>
    </div>
  );
}
