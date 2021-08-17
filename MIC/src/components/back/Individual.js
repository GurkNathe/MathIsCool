import { TextField, Button, makeStyles, Grid } from "@material-ui/core";
import React, { useState } from "react";
import Auto from "../random/Auto.js";
import { useHistory } from "react-router-dom";

//Options for each dropdown. Probably use JSON for them

let options = require("./options");

const useStyles = makeStyles((theme) => ({
   root: {
     '& .MuiTextField-root': {
       margin: theme.spacing(1),
       width: '25ch',
     },
   },
   gform: {
      width:"100%",
      height:"1379px",
      frameBorder:"0",
      marginHeight:"0",
      marginWidth:"0",
   }
 }));

function Individual(){
   const history = useHistory();
   const classes = useStyles();
   const [choice, setChoice] = useState({ loc: null, 
                                          lev: null, 
                                          name: "",
                                          grade: null,
                                          school: null,
                                          stlev: null,
                                          team1: null,
                                          team2: null,
                                          coach: "",
                                          error: false,
                                       });

   let longest = 0;
   var schoolData = {value: null, label: null, div: null}
   const user = {email: localStorage.getItem("email"), name: localStorage.getItem("username")};
   var url = "";

   //finding length of longest string in options and resize search box accordingly
   for(var option in options){
      for(let i = 0; i < Object.keys(options[option]).length; i++){
         if(options[option][i].label.length > longest)
            longest = options[option][i].label.length;
      }
   }

   //don't know if there is a good way to do this, couldn't find anything
   longest *= 10;

   const onChange = (newValue, type) => {
      switch (type) {
         case "location":
            if(newValue != null){
               setChoice((prevState) => ({
                  ...prevState,
                  loc: newValue,
                  error: false,
               }));
            } else {
               setChoice((prevState) => ({
                  ...prevState,
                  loc: null,
                  error: false,
               }));
            }
            break;
         case "level":
            if(newValue != null){
               setChoice((prevState) => ({
                  ...prevState,
                  lev: newValue,
                  error: false,
               }));
            } else {
               setChoice((prevState) => ({
                  ...prevState,
                  lev: null,
                  error: false,
               }));
            }
            break;
         case "school":
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
            }
            break;
         case "team1":
            if(newValue != null){
               setChoice((prevState) => ({
                  ...prevState,
                  team1: newValue,
                  error: false,
               }));
            } else {
               setChoice((prevState) => ({
                  ...prevState,
                  team1: null,
                  error: false,
               }));
            }
            break;
         case "team2":
            if(newValue != null){
               setChoice((prevState) => ({
                  ...prevState,
                  team2: newValue,
                  error: false,
               }));
            } else {
               setChoice((prevState) => ({
                  ...prevState,
                  team2: null,
                  error: false,
               }));
            }
            break;
         case "coach":
            if(newValue != null){
               setChoice((prevState) => ({
                  ...prevState,
                  coach: newValue.target.value,
                  error: false,
               }));
            } else {
               setChoice((prevState) => ({
                  ...prevState,
                  coach: "",
                  error: false,
               }));
            }
            break;
         case "name":
            if(newValue != null){
               setChoice((prevState) => ({
                  ...prevState,
                  name: newValue.target.value,
                  error: false,
               }));
            } else {
               setChoice((prevState) => ({
                  ...prevState,
                  name: "",
                  error: false,
               }));
            }
            break;
          case "grade":
            if(newValue != null){
               setChoice((prevState) => ({
                  ...prevState,
                  grade: newValue,
                  error: false,
               }));
            } else {
               setChoice((prevState) => ({
                  ...prevState,
                  grade: null,
                  error: false,
               }));
            }
            break;
          case "stlev":
              if(newValue != null){
                 setChoice((prevState) => ({
                    ...prevState,
                    stlev: newValue,
                    error: false,
                 }));
              } else {
                 setChoice((prevState) => ({
                    ...prevState,
                    stlev: null,
                    error: false,
                 }));
              }
              break;
         default:
            console.log(newValue, type)
      }
   };

   const onSubmit = (event) => {
      setError(choice)
      setSchoolData()
      setURL(choice, schoolData)

      if(!choice.error){
         history.push({
            pathname: `/individual-register`,
            state:{
               key: url
            }
         });
      }
   }

   const setError = (choice) => {
      for (const item in choice){
         if(choice[item] === null || choice[item] === ""){
            console.log("ERROR :", item)
            setChoice((prevState) => ({
               ...prevState,
               error: true,
            }));
            break;
         }
      }
   }

   const setURL = (choice, schoolData) => {
      url = "localhost:3000"
      // url = `https://docs.google.com/forms/d/e/1FAIpQLSf8UTjphTqcOHwmrdGEG8Jsbjz4eVz7d6XVlgW7AlnM28vq_g/viewform?usp=pp_url&entry.1951055040=${user.name}&entry.62573940=${choice.loc}&entry.1929366142=${choice.lev}&entry.680121242=${choice.team}&entry.641937550=${choice.indiv}&entry.1389254068=${schoolData.value + " " + schoolData.label + " - " + schoolData.div}&entry.1720714498=${user.email + ", " + choice.coach}`
   }

   //Getting all the data for that school
   const setSchoolData = () => {
      for(option in options.school){
         if(options.school[option].label === choice.school){
            schoolData = {
               value: options.school[option].value,
               label: options.school[option].label,
               div: options.school[option].div,
            }
            break;
         }
      }
   }

   return(
      <>
         {!schoolData.value ?
            <div style={{display: "flex", flexDirection:"row"}}>
               <div style={{width:"100%", borderRadius: "4px", margin:"2%", boxShadow:"0 3px 1px -2px rgb(0 0 0 / 20%), 0 2px 2px 0 rgb(0 0 0 / 14%), 0 1px 5px 0 rgb(0 0 0 / 12%)"}}>
                  <div style={{marginLeft:"1%", marginRight:"1%",}}>
                      <p>
                        <b>This is for registering individual competitors only, for teams go <a href="/team-register" style={{color:"black"}}>here</a>.</b>
                      </p>
                      <form className={classes.root} noValidate autoComplete="off">

                        <Auto
                            title="Competition Location"
                            options={options.locations}
                            text="Select Competition Location"
                            onChange={(event, newValue) => onChange(newValue, "location")}
                            width={longest}
                            value={choice.loc}
                            error={choice.error}
                        />

                        <Auto
                            title="Competition Level"
                            options={options.level}
                            text="Select Your Grade Level"
                            onChange={(event, newValue) => onChange(newValue, "level")}
                            width={longest}
                            value={choice.lev}
                            error={choice.error}
                        />

                        <div style={{display:"flex"}}>
                            <Grid item sm={3}>
                              <p>Student Name</p>
                            </Grid>
                            <TextField
                              error={choice.error && choice.name === ""}
                              helperText={choice.error && choice.name === "" ? 
                                              "Please fill out to continue" : 
                                              null
                                          }
                              variant="outlined" 
                              margin="normal" 
                              required
                              label="Student"
                              value={choice.name}
                              onChange={(event) => onChange(event, "name")}
                              style={{ width: longest }}
                            >
                            </TextField>
                        </div>

                        <Auto
                            title="Student's Current Grade"
                            options={options.grade}
                            text="Select Grade Level"
                            onChange={(event, newValue) => onChange(newValue, "grade")}
                            width={longest}
                            value={choice.grade}
                            error={choice.error}
                        />

                        <Auto
                            title="Student's Math Level for competition"
                            options={options.stlev}
                            text="Select Math Level"
                            onChange={(event, newValue) => onChange(newValue, "stlev")}
                            width={longest}
                            value={choice.stlev}
                            error={choice.error}
                        />

                        <Auto
                            title="School Registering"
                            options={options.school}
                            text="Select Your School"
                            onChange={(event, newValue) => onChange(newValue, "school")}
                            width={longest}
                            value={choice.school}
                            error={choice.error}
                        />

                        <div style={{display:"flex"}}>
                            <Grid item sm={3}>
                              <p>Coach</p>
                            </Grid>
                            <TextField
                              error={choice.error && choice.coach === ""}
                              helperText={choice.error && choice.coach === "" ? 
                                              "Please fill out to continue" : 
                                              null
                                          }
                              variant="outlined" 
                              margin="normal" 
                              required
                              label="Coach"
                              value={choice.coach}
                              onChange={(event) => onChange(event, "coach")}
                              style={{ width: longest }}
                            >
                            </TextField>
                        </div>

                        <Grid container>
                            <Grid item sm={3}></Grid>
                            <Grid item sm={3} width={longest}>
                              <Button
                                  fullWidth
                                  variant="contained"
                                  color="primary"
                                  onClick={onSubmit}
                              >
                                  Continue
                              </Button>
                            </Grid>
                        </Grid>

                      </form>
                      <p>
                        Note: team registrations include 2 alternates per grade level.
                      </p>
                  </div>
               </div>
            </div> :
            <iframe 
               src={url} 
               className={classes.gform}
            >
               Loading…
            </iframe>
         }
      </>
   );
}

export default Individual;