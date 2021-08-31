import { TextField, Button, makeStyles, Grid } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import React, { useState, useEffect } from "react";
import Auto from "../custom/Auto.js";
import fire from "../fire";

//Options for each dropdown. Probably use JSON for them

let options = require("./options");

//TODO: change to style.js
const useStyles = makeStyles((theme) => ({
   root: {
     '& .MuiTextField-root': {
       margin: theme.spacing(1),
       width: '25ch',
     },
   },
   top: {
      display: "flex", 
      flexDirection:"row"
    },
    second: {
      width:"100%",
      borderRadius: "4px", 
      margin:"2%",
      boxShadow:"0 3px 1px -2px rgb(0 0 0 / 20%), 0 2px 2px 0 rgb(0 0 0 / 14%), 0 1px 5px 0 rgb(0 0 0 / 12%)"
    },
    bottom: {
      marginLeft:"1%", 
      marginRight:"1%",
    }
 }));

//gets the competitions that are open (i.e. status == reg)
async function getComps(title){
   
   //holds the competitions
   var comps = {};

   //checks if load variable in local storage is true, meaning database can be pulled
   if(!localStorage.getItem(title + "Data")){

      //getting the 'web' collection from firestore
      const doc = await fire.firestore().collection(title).where('status', '==', 'reg').get();

      //adding open competitions to holding variable
      doc.forEach((item) => {
         comps = {
            ...comps,
            [item.id]: item.data()
         }
      })

      //checking to make sure it actually got data
      if(doc.empty){
         console.log(doc);
         return;
      }

      //adding web page html/data to local storage
      localStorage.setItem(title + "Data", JSON.stringify(comps));
   }
}

function TeamRegister(){
   const history = useHistory();
   const classes = useStyles();
   const [choice, setChoice] = useState({ loc: null, 
                                          lev: null, 
                                          school: null,
                                          team: null,
                                          indiv: null,
                                          date: null,
                                          compId: null,
                                          email: "",
                                          coach: "",
                                          error: false,
                                       });  
   const [locals, setLocals] = useState([]);
                                    
   let comps = JSON.parse(localStorage.getItem("competitionsData"));
   let times = [];

   for(const i in comps){
      times.push({value: comps[i].compDate, label: comps[i].compDate, id: i})
   }

   useEffect(() => {
      getComps("competitions");
      setLocals(options.locations)
   }, []);
   
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

   //filters the options based on the currently available competitions
   for(const i in options.locations){
      let test = false;
      for(const j in comps){
         if(options.locations[i].value.toUpperCase() === comps[j].site.toUpperCase()){
            test = true;
         }
      }
      if(!test){
         delete options.locations[i]
      }
   }

   const onChange = (newValue, type) => {
      switch (type) {
         case "date":
            for(const i in times){
               if(newValue === times[i].value){
                  console.log(times[i].id)
                  if(newValue != null){
                     setChoice((prevState) => ({
                        ...prevState,
                        date: newValue,
                        compId: times[i].id,
                        error: false,
                     }));
                  } else {
                     setChoice((prevState) => ({
                        ...prevState,
                        date: null,
                        compId: null,
                        error: false,
                     }));
                  }
               }
            }
            break;
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
                  loc: null,
                  error: false,
               }));

               let temp = [];

               //gets the value of each level option
               let value = "";
               for(const i in options.level){
                  if(options.level[i].label === newValue)
                     value = options.level[i].value
               }

               //resets the available options if field is cleared
               options.locations = locals;

               // for removing locations that don't have the grade associated with it
               for(const i in options.locations){
                  for(const j in comps){
                     //checks if same location
                     if(options.locations[i].value.toUpperCase() === comps[j].site.toUpperCase()){
                        //checks if level is in the grade range for selected location
                        if(newValue !== null && comps[j].grade.indexOf(value) !== -1){
                           //checks if option is already included
                           if(!temp.includes(options.locations[i])){
                              temp.push(options.locations[i])
                           }
                        }
                     }
                  }
               }
               options.locations = temp;
            } else {
               setChoice((prevState) => ({
                  ...prevState,
                  lev: null,
                  loc: null,
                  error: false,
               }));

               //resets the available options if field is cleared
               options.locations = locals;
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
         case "email":
            if(newValue != null){
               setChoice((prevState) => ({
                  ...prevState,
                  email: newValue.target.value,
                  error: false,
               }));
            } else {
               setChoice((prevState) => ({
                  ...prevState,
                  email: "",
                  error: false,
               }));
            }
            break;
         default:
            console.log(newValue, type)
      }
   };

   //checks data to make sure things are filled out, and redirects to the goole form with prefilled info.
   const onSubmit = () => {

      const error = setError(choice);
      setSchoolData();
      setURL(choice, schoolData);

      if(!error){
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
      var err = false;
      for (const item in choice){
         if((choice[item] === null || choice[item] === "") && item !== "email"){
            console.log(item, choice[item])
            setChoice((prevState) => ({
               ...prevState,
               error: true,
            }));
            err = true;
            break;
         }
      }
      return err;
   }

   //sets iframe url for filling google form
   const setURL = (choice, schoolData) => {
      const uid = fire.auth().currentUser.uid; //might need to do something with this, since it might not be fast enough.
      url = `https://docs.google.com/forms/d/e/1FAIpQLSf8UTjphTqcOHwmrdGEG8Jsbjz4eVz7d6XVlgW7AlnM28vq_g/viewform?usp=pp_url&entry.1951055040=${choice.coach}&entry.74786596=${uid}&entry.62573940=${choice.loc}&entry.1929366142=${choice.lev}&entry.680121242=${choice.team}&entry.641937550=${choice.indiv}&entry.1389254068=${schoolData.value + " " + schoolData.label + " - " + schoolData.div}&entry.1720714498=${user.email + ", " + choice.email}&entry.831651134=${choice.date}&entry.1445326839=${choice.compId}`
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
      <div className={classes.top}>
         <div className={classes.second}>
            <div className={classes.bottom}>
               <h1>Team Registration</h1>
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
                     title="Competition Date"
                     options={times}
                     text="Select Date"
                     onChange={(event, newValue) => onChange(newValue, "date")}
                     width={longest}
                     value={choice.date}
                     error={choice.error}
                  />

                  <Auto
                     title="Competition Location"
                     disabled={options.locations.length === 0}
                     options={options.locations}
                     text={options.locations.length === 0 ? 
                              "No Locations for this competition level." : 
                              "Select Competition Location"
                           }
                     onChange={(event, newValue) => onChange(newValue, "location")}
                     width={longest}
                     value={choice.loc}
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
                        <p>Coach Name(s)</p>
                     </Grid>
                     <TextField
                        error={choice.error && choice.coach === ""}
                        helperText={choice.error && choice.coach === "" ? 
                                       "Please fill out to continue" : null
                                    }
                        variant="outlined" 
                        margin="normal" 
                        required
                        label="Coach Name(s)"
                        value={choice.coach}
                        onChange={(event) => onChange(event, "coach")}
                        style={{ width: longest, maxWidth: "65vw", marginRight: 0 }}
                     >
                     </TextField>
                  </div>

                  <div style={{display:"flex"}}>
                     <Grid item sm={3}>
                        <p>Additional Emails</p>
                     </Grid>
                     <TextField
                        error={choice.error && choice.email === ""}
                        helperText={choice.error && choice.email === "" ? 
                                       "Please fill out to continue" : 
                                       "Example: notyour@email.com, another@coach.com"
                                    }
                        variant="outlined" 
                        margin="normal" 
                        required
                        label="Other Emails"
                        value={choice.email}
                        onChange={(event) => onChange(event, "email")}
                        style={{ width: longest, maxWidth: "65vw", marginRight: 0 }}
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