import { TextField, Button, makeStyles, Grid } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import React, { useState } from "react";
import Auto from "../random/Auto.js";
import fire from "../fire";

//Options for each dropdown. Probably use JSON for them

let options = require("./options");

const useStyles = makeStyles((theme) => ({
   root: {
     '& .MuiTextField-root': {
       margin: theme.spacing(1),
       width: '25ch',
     },
   },
 }));

function TeamRegister(){
   const history = useHistory();
   const classes = useStyles();
   const [choice, setChoice] = useState({ loc: null, 
                                          lev: null, 
                                          school: null,
                                          team: null,
                                          indiv: null,
                                          coach: "",
                                          error: false,
                                       });

   let longest = 0;
   var schoolData = {value: null, label: null, div: null}
   const user = {email: fire.auth().currentUser.email, name: fire.auth().currentUser.displayName};

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
         case "team":
            if(newValue != null){
               setChoice((prevState) => ({
                  ...prevState,
                  team: newValue,
                  error: false,
               }));
            } else {
               setChoice((prevState) => ({
                  ...prevState,
                  team: null,
                  error: false,
               }));
            }
            break;
         case "indiv":
            if(newValue != null){
               setChoice((prevState) => ({
                  ...prevState,
                  indiv: newValue,
                  error: false,
               }));
            } else {
               setChoice((prevState) => ({
                  ...prevState,
                  indiv: null,
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
         default:
            console.log(newValue, type)
      }
   };

   const onSubmit = () => {
      
      setError(choice);
      setSchoolData();
      setURL(choice, schoolData);

      if(!choice.error){
         history.push({
            pathname: `/team-register/confirm/`,
            state:{
               key: url
            }
         });
      }
   }

   //Setting error if something is not filled out.
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
      url = `https://docs.google.com/forms/d/e/1FAIpQLSf8UTjphTqcOHwmrdGEG8Jsbjz4eVz7d6XVlgW7AlnM28vq_g/viewform?usp=pp_url
               &entry.1015404157=${user.email}
               &entry.1951055040=${user.name}
               &entry.62573940=${choice.loc}
               &entry.1929366142=${choice.lev}
               &entry.680121242=${choice.team}
               &entry.641937550=${choice.indiv}
               &entry.1389254068=${schoolData.value}
               &entry.1720714498=${choice.coach}`
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
      <div style={{display: "flex", flexDirection:"row"}}>
         <div style={{width:"100%", borderRadius: "4px", margin:"2%", boxShadow:"0 3px 1px -2px rgb(0 0 0 / 20%), 0 2px 2px 0 rgb(0 0 0 / 14%), 0 1px 5px 0 rgb(0 0 0 / 12%)"}}>
            <div style={{marginLeft:"1%", marginRight:"1%",}}>
               <p>
                  <b>Rules for Individuals:</b> Any student may compete as an individual 
                  in their grade level or any higher grade; however, a student may 
                  compete as a team at one grade level only. This applies to both 
                  Championships and Masters.<br/><br/>

                  Also note each team includes four students in addition to 
                  two alternates per school that can compete as individuals. So 
                  when registering n teams , you get to bring 4n+2 students along. 
                  These students don't need to be registered as individuals separately.
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

                  <Auto
                     title="School Registering"
                     options={options.school}
                     text="Select Your School"
                     onChange={(event, newValue) => onChange(newValue, "school")}
                     width={longest}
                     value={choice.school}
                     error={choice.error}
                  />

                  <Auto
                     title="Number Teams"
                     options={options.numteam}
                     text="Select Number of Teams"
                     onChange={(event, newValue) => onChange(newValue, "team")}
                     width={longest}
                     value={choice.team}
                     error={choice.error}
                  />

                  <Auto
                     title="Number Individuals"
                     options={options.numteam}
                     text="Select Number of Individuals"
                     onChange={(event, newValue) => onChange(newValue, "indiv")}
                     width={longest}
                     value={choice.indiv}
                     error={choice.error}
                  />

                  <div style={{display:"flex"}}>
                     <Grid item sm={3}>
                        <p>Additional Emails & Coach Names</p>
                     </Grid>
                     <TextField
                        error={choice.error && choice.coach === ""}
                        helperText={choice.error && choice.coach === "" ? 
                                       "Please fill out to continue" : 
                                       "Example: someone@gmail.com, John Doe"
                                    }
                        variant="outlined" 
                        margin="normal" 
                        required
                        label="Emails and Coaches"
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
                  A school's division level is assigned based on past performance at 
                  Math is Cool contests. For more details and a current list of 
                  schools and assignments, see&nbsp;
                  <a href="../../assets/divisions.pdf" target="_blank" rel="noreferrer">2018-19 Divisions</a>.
               </p>
            </div>
         </div>
      </div>
   );
}

export default TeamRegister;