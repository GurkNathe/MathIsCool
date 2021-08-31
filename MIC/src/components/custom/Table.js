import React, { useState, useEffect } from "react";
import { TextField, Grid, Button, Typography } from "@material-ui/core";
import useStyles from "../style";

import fire from "../fire";

//Used for Enter Names table

/**
 * @param  {integer} teams 
 * @param  {integer} individuals
 */
export default function Table(props) {
  const classes = useStyles();
  const [students, setStudents] = useState(1);
  const [loading, setLoading] = useState(true);
  
  //creates an array with length of 1 to props.teams/individuals
  const [teams, setTeams] = useState(Array.from({length: props.teams}, (_, i) => i + 1));
  const [indivs, setIndivs] = useState(Array.from({length: props.individuals}, (_, i) => i + 1));

  const getNames = (teams, indivs) => {
    //creates the object that handles name inputs.
    var info = {}
    if(students !== 1){
      
      const student = {
        student1: "",
        student2: "",
        student3: "",
        student4: "",
      };

      //adds number of teams to list
      teams.forEach(team => {
        info[team] = {};
        for(const s in student){
          info[team][s] = student[s];
        }
      });
      
      //adds number of individuals to list
      info[Object.keys(info).length+1] = {};
      indivs.forEach(ind => {
        info[Object.keys(info).length+1] = {[`indiv${ind}`]: ""};
      })

      //adds the two alternates per competition
      if(Object.keys(info).length !== 1){
        info[teams.length+1] = {alt1: "", alt2: ""};
      }

      return(info);
    }
  }

  useEffect(() => {
    if(students === 1 || students === undefined)
      setStudents(getNames(teams, indivs));
    if(students !== 1){
      setLoading(false);
    }
  },[students])
  
  /**
   * @param  {integer} team
   * @param  {string} type
   * @param  {string} newValue
   */
  const onChange = (team, type, newValue) => {
    //team = position in list
    //type = name of element at position in list
    //newValue = value being typed in the text box
    setStudents((prevStudents) => ({
      ...prevStudents,
      [team]: {
        ...prevStudents[team],
        [type]: newValue,
      }
    }))
  }

  const onSubmit = () => {

    //adds names to registration
    fire.firestore().collection("competitions")
      .doc(props.id)
      .collection("registration")
      .get()
      .then((doc) => {
        fire.firestore().collection("competitions").doc(props.id).collection("registration")
          .update({
            ...doc.data(),
            [props.regId]: {
              ...doc.data()[props.regId],
              names: students
            }
          })
      })
      .catch(error => {console.log(error)})
      
  }
  
  return(
    <div className={classes.root}>
      <Typography>
        {props.title}
      </Typography>
      { !loading && students !== undefined ?
        <div className={classes.table}>
          {/*display for the teams*/}
          <div className={classes.table}>
            {
              props.teams !== 0 ?
              teams.map((team, index) => {
                return(
                  <div className={classes.table} key={index}>
                    <Typography>Team {team}</Typography>
                    { 
                      [1,2,3,4].map((num, ind) => {
                        return(
                          <div className={classes.table} key={ind}>
                            <TextField
                              variant="outlined" 
                              margin="normal"
                              label={`Student #${num}`}
                              value={students[team][`student${num}`]}
                              onChange={(event) => onChange(team, `student${num}`, event.target.value)}
                            />
                        </div>
                        );
                      })
                    }
                  </div>
                )
              }):
              <div className={classes.table}>
                <Typography>Teams</Typography>
                <Typography style={{opacity:"50%"}}>
                  No teams signed up for this competition.
                </Typography>
              </div>
            }
          </div>

          {/* display for individuals */}
          <div className={classes.table}>
            <Typography>Individuals</Typography>
            <div className={classes.indiv}>
              {
                props.individuals !== 0 ?
                indivs.map((indNum, index) => {
                  return(
                    <div className={classes.table} key={index}>
                      <TextField
                        variant="outlined" 
                        margin="normal"
                        label={`Individual #${indNum}`}
                        value={students[indNum][`indiv${indNum}`]}
                        onChange={(event) => onChange(indNum + props.teams + 1, `indiv${indNum}`, event.target.value)}
                      />
                    </div>
                  )
                }):
                <Typography style={{opacity:"50%"}}>
                  No individuals signed up for this competition.
                </Typography>
              }
            </div>
          </div>

          {/*display for the alternates*/}
          <div className={classes.table}>
            <Typography>Alternates</Typography>
            {
              props.teams !== 0 ?
              [1,2].map((num, index) => {
                return(
                  <div className={classes.table} key={index}>
                    <TextField
                      variant="outlined" 
                      margin="normal"
                      label={`Alternate #${num}`}
                      value={students[Object.keys(students).length][`alt${num}`]}
                      onChange={(event) => {onChange(props.teams + 1, `alt${num}`, event.target.value)}}
                    />
                  </div>
                );
              }):
              <Typography style={{opacity:"50%"}}>
                No teams signed up for this competition.
              </Typography>
            }
          </div>
          
          {/* Submit Button */}
          <Grid container>
            <Grid item sm={2}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={onSubmit}
              >
                  Submit
              </Button>
            </Grid>
          </Grid>
        </div>:
        <div style={{display:"flex", alignItems:"center", justifyContent:"center",}}>
          <Typography style={{opacity:"50%"}}>
            No competitions signed up for current school.
          </Typography>
        </div>
      }
    </div>
  );
}
