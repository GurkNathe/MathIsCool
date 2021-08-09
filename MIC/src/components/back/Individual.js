import { TextField, Button, makeStyles, Grid } from "@material-ui/core";
import React, { useState } from "react";
import Auto from "../random/Auto.js";

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
   const classes = useStyles();
   const [choice, setChoice] = useState({ loc: null, 
                                          lev: null, 
                                          name: "",
                                          grade: null,
                                          school: null,
                                          stlev: null,
                                          schoolData: {
                                             value: null,
                                             label: null,
                                             div: null,
                                           },
                                          team1: null,
                                          team2: null,
                                          coach: "",
                                          error: false,
                                       });

   let longest = 0;

   var url = `https://docs.google.com/forms/d/e/1FAIpQLSeJ_fqnbSPgfrCmRAlcGN8lFCnLKw2zbvb8YUMRtYDjSTMXVQ/viewform?usp=pp_url
                &entry.296234163=${choice.loc}
                &entry.1262511676=${choice.lev}
                &entry.2068664503=${choice.schoolData.label}
                &entry.962283225=${choice.schoolData.value}
                &entry.1420093772=${choice.schoolData.div}
                &entry.75608970=${choice.team1}
                &entry.2041045214=${choice.team2}
                &entry.2062002355=${choice.coach}`

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
      
      //Setting error if something is not filled out.
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

      //Getting all the data for that school
      for(option in options.school){
         if(options.school[option].label === choice.school){
            setChoice((prevState) => ({
               ...prevState,
               schoolData: {
                value: options.school[option].value,
                label: options.school[option].label,
                div: options.school[option].div,
               }
            }));
            console.log(options.school[option])
            break;
         }
      }
   }

   return(
      <>
         {!choice.schoolData.value ?
            <div style={{display: "flex", flexDirection:"row"}}>
               <div style={{borderRadius: "4px", margin:"2%", boxShadow:"0 3px 1px -2px rgb(0 0 0 / 20%), 0 2px 2px 0 rgb(0 0 0 / 14%), 0 1px 5px 0 rgb(0 0 0 / 12%)"}}>
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