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
        for(const sign in register){
          if(register[sign].schoolID === schoolId && register[sign].uid === fire.auth().currentUser.uid){
            //TODO: add competition title
            competitions.push({teams: register[sign].numTeams, indiv: register[sign].numIndividuals});
          }
        }
      })
      return(competitions)
    }
  } catch(err){
    console.log("ERROR", err)
  }
}

/**
 * TODO: Add submit to Firestore/Google Sheets for names.
 */
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
    } else {
      setChoice((prevState) => ({
        ...prevState,
        school: null,
        error: false,
      }));
      setComp([]);
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
      
      //TODO: need to make it process multiple sign ups
      getComps(schoolData.value).then(vals => {
        for(const val in vals){
          console.log(vals)
          if(vals[val] !== undefined){
            setComp((prevState) => [
              ...prevState,
              {
                title:"test",
                teams:vals[val].teams,
                indivs:vals[val].indiv,
              }
            ]);
          }
          
          if(vals[val].teams !== 0 || vals[val].indiv !== 0){
            console.log("I GOT IT")
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
          {console.log(loading)}
          { !loading ?
            <div className={classes.bottom}>
              {
                compData.map((comp, index) => {
                  return(
                    <div key={index}>
                      {/* TODO: Need to at url for submission */}
                      {console.log("GETTING HERE")}
                      <Table title={comp.title} teams={comp.teams} individuals={comp.indivs}/>
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
