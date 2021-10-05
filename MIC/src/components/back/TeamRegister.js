import React, { useState, useEffect } from "react";
import { TextField, Button, Grid } from "@mui/material";
import { useHistory } from "react-router-dom";
import { TeamForm, Auto, BasicPage } from "../styledComps";
import { divisions } from "../assets.js";

import { collection, where, getDocs, getDoc, doc } from "@firebase/firestore"
import { auth, db } from "../fire";

let options = require("./options");

//gets the competitions that are open (i.e. status == reg)
async function getComps(title){
   
   //holds the competitions
   var comps = {};

   //checks if load variable in local storage is true, meaning database can be pulled
   if(!sessionStorage.getItem(title + "Data") || !sessionStorage.getItem("mastersData")){

      //getting the 'web' collection from firestore
      const doc = await getDocs(collection(db, title), where('status', '==', 'reg'));
      const masters = await getDoc(doc(db, "masters", "teams"));

      //adding open competitions to holding variable
      doc.forEach((item) => {
         comps = {
            ...comps,
            [item.id]: item.data()
         }
      })

      //checking to make sure it actually got data
      if(doc.empty){
         return;
      }

      //adding web page html/data to local storage
      sessionStorage.setItem(title + "Data", JSON.stringify(comps));
      sessionStorage.setItem("mastersData", masters ? JSON.stringify(masters.data()) : null);

      return([comps, masters ? masters.data() : null]);
   }
}

//!! ISSUE WITH LOCATION LIMITING
export default function TeamRegister(){
   const history = useHistory();
   
   const [comps, setComps] = useState(JSON.parse(sessionStorage.getItem("competitionsData")));//all open competitions
   const [masters, setMasters] = useState(JSON.parse(sessionStorage.getItem("mastersData"))); //stores the masters data
   const [choice, setChoice] = useState({ loc: null, 
                                          lev: null, 
                                          school: null,
                                          team: null,
                                          indiv: null,
                                          email: "",
                                          coach: "",
                                          error: false,
                                       });  //input variables
   const [locals, setLocals] = useState(JSON.parse(sessionStorage.getItem("filteredComps"))); //used to store the locations, does not change

   const user = {email: sessionStorage.getItem("email"), name: sessionStorage.getItem("username")}; //stores email and username of user
   
   //gets the value for width of text fields
   const getLongest = (longest) => {
      //finding length of longest string in options and resize search box accordingly
      for(const option in options){
         for(let i = 0; i < Object.keys(options[option]).length; i++){
            if(options[option][i].label.length > longest)
               longest = options[option][i].label.length;
         }
      }
      //don't know if there is a good way to do this, couldn't find anything
      return longest * 10;
   }

   let compId = null; //used to store the id of the competition being signed up for
   let longest = getLongest(0); //used for storing the width of the longest string that can be selected in the drop-downs
   let schoolData = {value: null, label: null, div: null} //used to store the data of the selected school
   let url = ""; //used to store the url for the Google Form

   useEffect(() => {
      getComps("competitions").then((result) => {
         if(result !== undefined){
            setComps(result[0]);
            setMasters(result[1]);

            var temp = options.locations;

            //filters the options based on the currently available competitions
            if(result[0] !== null && result[0] !== undefined){
               for(const i in temp){
                  let test = false;
                  for(const j in result[0]){
                     if(temp[i].value.toUpperCase() === result[0][j].site.toUpperCase()){
                        test = true;
                     }
                  }
                  
                  if(!test){
                     const ops = options.locations.filter((value, index, arr) => {
                        if(arr[index].value !== temp[i].value)
                           return value;
                        else
                           return;
                     })
                     options.locations = ops;
                  }
               }
               sessionStorage.setItem("filteredComps", JSON.stringify(options.locations));
            }
         }
         setLocals(options.locations);
      });
   }, []);
   
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
               //reset options
               options.locations = locals;

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
                  if(options.level[i].label === newValue){
                     value = options.level[i].value
                     break;
                  }
               }

               //TODO: might need to change options.location to a state
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

               //getting school id for chosen school
               let id = null;
               for(const option in options.school){
                  if(options.school[option].label === choice.school){
                     id = options.school[option].value;
                  }
               }
               
               //checking if school is able to sign up for masters
               for(const option in masters.teams){
                  if(masters.teams[option].grade === newValue && masters.teams[option].schoolID === id){
                     options.locations.push({"value": "Masters", "label": "Masters"});
                     break;
                  }
               }
               
            } else {
               setChoice((prevState) => ({
                  ...prevState,
                  lev: null,
                  loc: null,
                  error: false,
               }));

               //resets the available locations if field is cleared
               options.locations = locals;
            }
            break;
         case "school":
            if(newValue != null){
               //deletes any masters in location options "reseting options"
               for(const option in options.locations){
                  options.locations = options.locations.filter((value, index, arr) => {
                     return arr[index].value !== "Masters"
                  })
               }
               
               //getting school id for chosen school
               let id = null;
               for(const option in options.school){
                  if(options.school[option].label === newValue){
                     id = options.school[option].value;
                  }
               }

               //checking if school is able to sign up for masters
               for(const option in masters.teams){
                  if(masters.teams[option].grade === choice.lev && masters.teams[option].schoolID === id){
                     options.locations.push({"value": "Masters", "label": "Masters"});
                     break;
                  }
               }

               setChoice((prevState) => ({
                  ...prevState,
                  school: newValue,
                  loc: null,
                  error: false,
               }));
            } else {
               //deletes any masters in location options "reseting options"
               for(const option in options.locations){
                  options.locations = options.locations.filter((value, index, arr) => {
                     return arr[index].value !== "Masters"
                  })
               }

               setChoice((prevState) => ({
                  ...prevState,
                  school: null,
                  loc: null,
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

      compId = setCompID(choice);
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

   //sets the competition id
   const setCompID = (choice) => {
      //gets the proper grade level displays
      let id = null;
      comp_loop:
      for(const i in comps){
         var grade = comps[i].grade.substr(1)
         var grades = []
         for(const item in options.level){
            for(const char in grade){
               if(options.level[item].value === grade[char]){
                  grades.push(options.level[item].label)
                  break;
               }
            }
         }
         
         for(const j in grades){
            if(grades[j] === choice.lev && choice.loc.toUpperCase() === comps[i].site.toUpperCase()){
               id = i;
               break comp_loop;
            }
         }
      }
      return id;
   }

   //Setting error if something is not filled out.
   const setError = (choice) => {
      var err = false;
      for (const item in choice){
         if((choice[item] === null || choice[item] === "") && item !== "email"){
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
      const uid = auth.currentUser.uid; //!might need to do something with this, since it might not be fast enough.
      url = `https://docs.google.com/forms/d/e/1FAIpQLSf8UTjphTqcOHwmrdGEG8Jsbjz4eVz7d6XVlgW7AlnM28vq_g/viewform?usp=pp_url&entry.1951055040=${choice.coach}&entry.74786596=${uid}&entry.62573940=${choice.loc}&entry.1929366142=${choice.lev}&entry.680121242=${choice.team}&entry.641937550=${choice.indiv}&entry.1389254068=${schoolData.value + " " + schoolData.label + " - " + schoolData.div}&entry.1720714498=${user.email + ", " + choice.email}&entry.1445326839=${compId}`
   }

   //Getting all the data for that school
   const setSchoolData = () => {
      for(const option in options.school){
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
      <BasicPage>
         <h1>Team Registration</h1>
         <p>
            <b>Rules for Individuals:</b> Any student may compete as an individual 
            in their grade level or any higher grade; however, a student may 
            compete as a team at one grade level only. This applies to both 
            Championships and Masters.<br/><br/>

            Also note each team includes four students in addition to 
            two alternates per school that can compete as individuals. So 
            when registering n teams, you get to bring 4n+2 students along. 
            These students don't need to be registered as individuals separately.
         </p>
         <TeamForm noValidate autoComplete="off">

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
               title="Competition Location"
               disabled={options.locations.length === 0}
               options={options.locations}
               text={options.locations.length === 0 ? 
                        "No locations for this competition level." : 
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
                     onClick={onSubmit}
                     style={{ background:"#3f51b5" }}
                  >
                     Continue
                  </Button>
               </Grid>
            </Grid>

         </TeamForm>
         <p>
                  A school's division level is assigned based on past performance at 
                  Math is Cool contests. For more details and a current list of 
                  schools and assignments, see&nbsp;
                  <a href={divisions} target="_blank" rel="noreferrer">2018-19 Divisions</a>.
               </p>
      </BasicPage>
   );
}
