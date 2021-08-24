import React, { useState } from "react";
import ReactLoading from "react-loading";
import { TextField, Grid, Button, Typography } from "@material-ui/core";
import useStyles from "../style";

//Used for Enter Names table

/**
 * @param  {integer} teams 
 * @param  {integer} individuals
 */
export default function Table(props) {
  const classes = useStyles();
  const [students, setStudents] = useState({});

  //creates an array with length of 1 to props.teams/individuals
  const teams = Array.from({length: props.teams}, (_, i) => i + 1);
  const indivs = Array.from({length: props.individuals}, (_, i) => i + 1);

  //creates the object that handles name inputs.
  var info = {}
  if(Object.keys(students).length === 0){
    
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
    info[teams.length+1] = {alt1: "", alt2: ""};

    setStudents(info);
  }
    
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
    
    console.log(students);
  }

  const onSubmit = (event) => {
    event.preventDefault();
    console.log("SUBMIT");
  }

  return(
    <div className={classes.root}>
      {Object.keys(students).length !== 0 ?
        <div className={classes.table}>
          {/*display for the teams*/
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
            })
          }
          <div className={classes.table}>
            <Typography>Individuals</Typography>
            <div className={classes.indiv}>
              {/*display for the individuals*/
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
                })
              }
            </div>
          </div>
          <div className={classes.table}>
            <Typography>Alternates</Typography>
            {/*display for the alternates*/
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
              })
            }
          </div>
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
        <div style={{position:"fixed", top:"45%", left:"45%"}}>
          <ReactLoading type="spinningBubbles" color="#000" style={{width:"50px", height:"50px"}}/>
        </div>
      }
    </div>
  );
}
