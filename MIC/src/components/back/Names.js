import React, { useState, useEffect } from "react";
import { Typography } from "@material-ui/core";

import Table from "../custom/Table";
import useStyles from "../style";
import fire from "../fire";

import options from "./options.json";

//returns the values of #individuals and #teams for each competition where the current user
//signed up the chosen school
async function getComps(){
  try{
    const comps = await fire.firestore().collection("competitions").get();
    var competitions = [];
    if(comps.empty){
      return;
    } else {
      comps.forEach(doc => {
        const register = doc.data().registration;

        //gets the proper grade level displays
        var grade = doc.data().grade.substr(1)
        var grades = []
        for(const item in options.level){
          for(const char in grade){
            if(options.level[item].value === grade[char]){
              grades.push(options.level[item].label)
              break;
            }
          }
        }
        const title = `Grade ${grades.length > 2 ? grades.join(", "): grades.join(" and ")} Competition on ${doc.data().compDate}`;

        //adds the competitions that current user has signed up for
        for(const sign in register){
          if(register[sign].uid === fire.auth().currentUser.uid){
            competitions.push({
              regID: sign, 
              compID: doc.id, 
              title: title, 
              teams: register[sign].numTeams, 
              indiv: register[sign].numIndividuals,
              schoolID: register[sign].schoolID,
            });
          }
        }
      })
      return(competitions)
    }
  } catch(err){
    console.log("ERROR:", err)
  }
}

export default function Names() {
  const classes = useStyles();
  var schoolData = []; //used to store the schools current user has registered for
  const [compData, setComp] = useState([]); //registration data that current user has submitted
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    //gets registrations
    getComps().then(vals => {
      for(const val in vals){
        if(vals[val] !== undefined){
          setComp((prevState) => [
            ...prevState,
            {
              regId:vals[val].regID,
              compId:vals[val].compID,
              title:vals[val].title,
              teams:vals[val].teams,
              indivs:vals[val].indiv,
              schoolID:vals[val].schoolID,
            }
          ]);
        }
        
        //checks if there are teams/individuals signed up for a competition
        if(vals[val].teams !== 0 || vals[val].indiv !== 0){
          setLoading(false);
        }
      }
    });
  }, [])

  //gets school names
  if(!loading && schoolData.length === 0){
    for(const item in compData){
      for(const option in options.school){
        if(compData[item].schoolID === options.school[option].value){
          schoolData.push(options.school[option].label)
          break;
        }
      }
    }
  }
  
  return (
    <div className={classes.page}>
      <div className={classes.top}>
        <div className={classes.middle}>
          { !loading ?
            <div className={classes.bottom}>
              {
                compData.map((comp, index) => {
                  return(
                    <div key={index}>
                      <Table  
                        title={comp.title + " for " + schoolData[index]} 
                        teams={comp.teams} 
                        individuals={comp.indivs} 
                        id={comp.compId}
                        regId={comp.regId}
                      />
                    </div>
                  )
                })
              }
            </div>:
            !loading ? 
              null:
              <Typography style={{opacity:"50%"}}>
                You have no registrations.
              </Typography>
          }
        </div>
      </div>
    </div>
  );
}
