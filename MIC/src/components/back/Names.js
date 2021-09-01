import React, { useState } from "react";
import Typography from "@material-ui/core/Typography";

import Auto from "../custom/Auto";
import Table from "../custom/Table";
import useStyles from "../style";
import fire from "../fire";

import options from "./options.json";
import { Divider } from "@material-ui/core";

//returns the values of #individuals and #teams for each competition where the current user
//signed up the chosen school
async function getComps(schoolId){
  try{
    const comps = await fire.firestore().collection("competitions").get();
    var competitions = [];
    if(comps.empty){
      return;
    } else {
      comps.forEach(doc => {
        const register = doc.data().registration;
        const title = "Grade " + doc.data().grade.substr(1) + " Competition on " + doc.data().compDate;
        for(const sign in register){
          if(register[sign].schoolID === schoolId && register[sign].uid === fire.auth().currentUser.uid){
            competitions.push({
              regID: sign, 
              compID: doc.id, 
              title: title, 
              teams: register[sign].numTeams, 
              indiv: register[sign].numIndividuals
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

function Names() {
  const classes = useStyles();
  const [choice, setChoice] = useState({
                                        school: null,
                                        error: null
                                      });
  var schoolData = {};
  const [compData, setComp] = useState([]);
  const [loading, setLoading] = useState(true);

  const onChange = (newValue) => {
    //setting the school
    if(newValue != null){
      setChoice((prevState) => ({
        ...prevState,
        school: newValue,
        error: false,
      }));
      setComp([]);
      setLoading(true);
    } else {
      setChoice((prevState) => ({
        ...prevState,
        school: null,
        error: false,
      }));
      setComp([]);
      setLoading(true);
      localStorage.removeItem("students")
    }

    if(newValue !== null){
      //getting school data for firestore
      for(const i in options.school){
        if(options.school[i].label === newValue){
          schoolData = {
            value: options.school[i].value,
            label: options.school[i].label,
            div: options.school[i].div,
          }
          break;
        }
      }
      
      getComps(schoolData.value).then(vals => {
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
              }
            ]);
          }
          
          if(vals[val].teams !== 0 || vals[val].indiv !== 0){
            setLoading(false);
          }
        }
      });
    } else {
      setLoading(true);
    }
  };

  return (
    <div className={classes.page}>
      <div className={classes.innerN}>
        <Typography className={classes.title}>
          School Registering
        </Typography>
        <Auto
          title=""
          options={options.school}
          text="Select Your School"
          onChange={(event, newValue) => onChange(newValue)}
          width="50vw"
          value={choice.school}
          error={choice.error}
        />
      </div>
      <div className={classes.top}>
        <div className={classes.middle}>
          { !loading ?
            <div className={classes.bottom}>
              {
                compData.map((comp, index) => {
                  return(
                    <div key={index}>
                      <Table  
                        title={comp.title} 
                        teams={comp.teams} 
                        individuals={comp.indivs} 
                        id={comp.compId}
                        regId={comp.regId}
                      />
                      <br/><Divider/><br/>
                    </div>
                  )
                })
              }
            </div>:
            <Typography style={{opacity:"50%"}}>
              No competitions signed up for current school.
            </Typography>
          }
        </div>
      </div>
    </div>
  );
}

export default Names;
