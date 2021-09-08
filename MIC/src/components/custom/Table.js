import React, { useState, useEffect } from "react";
import { Grid, Button, Typography, Divider, Snackbar } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import ReactLoading from "react-loading";

import useStyles from "../style";
import Student from "./Student"
import fire from "../fire";

//Used for Enter Names table

//adds names to registration
async function submitNames(id, regId, students){
  const comps = fire.firestore().collection("competitions").doc(id);
  const res = await comps.get()
    .then((doc) => {
      comps.update({
        ...doc.data(),
        registration: {
          ...doc.data().registration,
          [regId]: {
            ...doc.data().registration[regId],
            names: students,
          }
        }
      })
      return(true)
    })
    .catch((error) => {
      console.log(error)
      return(false)
    })
  return(res)
}

/**
 * @param  {integer} teams 
 * @param  {integer} individuals
 */
export default function Table(props) {
  const classes = useStyles();
  const [students, setStudents] = useState(1);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(false);
  const [clicked, setClicked] = useState(false);

  if(props.teams > 10)
    props.teams = 10;
  if(props.individuals > 10)
    props.individuals = 10;

  //number of spots to fill in people
  const fills = Array.from({length: props.teams * 4 + props.individuals + 2}, (_, i) => i + 1);
  
  //array to hold options for what position the person has
  var options = [{value:"Individual", label:"Individual"}, {value:"Alternate", label:"Alternate"}]

  //filling in the teams
  for(let i = 1; i <= props.teams; i++){
    options.push({value:`Team ${i}`, label:`Team ${i}`});
  }

  //TODO: might need to change this
  const callback = (result) => {
    setStudents(result)
  }

  //gets current names
  const getComps = async (call) => {
    const comps = fire.firestore().collection("competitions").doc(props.id);

    const names = await comps.get()
      .then((doc) => {
        if(doc.data().registration[props.regId] !== undefined && doc.data().registration[props.regId].names !== undefined)
          sessionStorage.setItem("students", JSON.stringify(doc.data().registration[props.regId].names));
          call(doc.data().registration[props.regId].names)
      })
      .catch((error) => {
        console.log(error)
      });
  }

  useEffect(() => {
    if(students === 1){
      getComps(callback)
      setLoading(false)
    }
  },[])

  const onSubmit = () => {
    submitNames(props.id, props.regId, students)
      .then((result) => {
        setAlert(result);
        setClicked(true);
      })
  }

  if(!loading && students === undefined){
    var studs = {};
    for(const i in fills){
      studs[i] = {
        name:"",
        grade:null,
        level:null,
        pos:null,
      }
    }
    setStudents(studs)
  }

  const onChange = (newValue, index, type) => {
    setStudents((prevState) => ({
      ...prevState,
      [index]:{
        ...prevState[index],
        [type]: newValue,
      }
    }))
  }

  const handleClose = (event, reason) => {
    if (reason === 'clickaway')
      return;
    setClicked(false);
  }
  
  return(
    <div className={classes.tableTop}>
      <Snackbar open={clicked} autoHideDuration={3000} onClose={handleClose} anchorOrigin={{vertical:'top', horizontal:'center'}}>
        {alert ? 
          <Alert onClose={handleClose} severity="success" variant="filled">
            This is a success message!
          </Alert>:
          <Alert onClose={handleClose} severity="error" variant="filled">
            This is an error message!
          </Alert>
        }
      </Snackbar>
      { students !== undefined && students !== 1 ?
        <>
          <Typography>
            {props.title}
          </Typography>
          <div className={classes.table}>
            <table>
              <thead>
                <tr>
                  <th>
                    Student Name
                  </th>
                  <th>
                    Student Grade
                  </th>
                  <th>
                    Student Math Level
                  </th>
                  <th>
                    Student Position
                  </th>
                </tr>
              </thead>
              <tbody>
                {fills.map((doc, index) => {
                  return(
                      <Student
                        ops={options}
                        key={doc}
                        index={index}
                        onChange={onChange}
                        stud={students[index]}
                      />
                  )
                })}
              </tbody>
            </table>
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
          </div>
          <br/><Divider/><br/>
        </>:
        !loading ? 
          null:
          <div style={{position:"fixed", top:"45%", left:"45%"}}>
            <ReactLoading type="spinningBubbles" color="#000" style={{width:"50px", height:"50px"}}/>
          </div>
      }
    </div>
  );
}
