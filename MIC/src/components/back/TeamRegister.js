import { TextField, Button, makeStyles, Grid } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import React, { useState } from "react";

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

//json
//value
//onChange
//text
//width
function Auto(props){
   return(
      <div style={{display:"flex"}}>
         <Grid item sm={3}>
            <p>{props.title}</p>
         </Grid>
         <Autocomplete
            options={props.options.map((option) => option.label)}
            value={props.value}
            onChange={props.onChange}
            freeSolo
            renderInput={(params) => 
                           <TextField 
                              {...params} 
                              error={props.error && (props.value === null || props.value === "")}
                              helperText={props.error && (props.value === null || props.value === "") ? 
                                             "Please fill out to continue" : 
                                             null
                                          }
                              label={props.text} 
                              variant="outlined"
                              required
                              style={{ width: props.width }}
                           />
                        }
         />
      </div>
   );
}

function TeamRegister(){
   const classes = useStyles();
   const [choice, setChoice] = useState({ loc: null, 
                                          lev: null, 
                                          school: null,
                                          schoolData: null,
                                          team1: null,
                                          team2: null,
                                          coach: "",
                                          error: false,
                                       });

   let longest = 0;

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
         default:
            console.log(newValue, type)
      }
   };


   //NEED TO ADD SUBMISSION TO STORAGE
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
               schoolData: options.school[option],
            }));
            break;
         }
      }

      //send data to sheets/database
      console.log(event)
      console.log(choice)
   }

   return(
      <div style={{display: "flex", flexDirection:"row"}}>
         <div style={{borderRadius: "4px", margin:"2%", boxShadow:"0 3px 1px -2px rgb(0 0 0 / 20%), 0 2px 2px 0 rgb(0 0 0 / 14%), 0 1px 5px 0 rgb(0 0 0 / 12%)"}}>
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
                     title="Number of 4, 5, 6, 7, or 9-10th Teams"
                     options={options.numteam}
                     text="Select Number of Teams"
                     onChange={(event, newValue) => onChange(newValue, "team1")}
                     width={longest}
                     value={choice.team1}
                     error={choice.error}
                  />

                  <Auto
                     title="Number of 8 or 11-12th Teams"
                     options={options.numteam}
                     text="Select Number of Teams"
                     onChange={(event, newValue) => onChange(newValue, "team2")}
                     width={longest}
                     value={choice.team2}
                     error={choice.error}
                  />
                  
                  <div style={{display:"flex"}}>
                        <Grid item sm={3}>
                           <p>Person Bringing Students to Event</p>
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
                           Submit
                        </Button>
                     </Grid>
                  </Grid>
                  
               </form>
               <p>
                  A school's division level is assigned based on past performance at 
                  Math is Cool contests. For more details and a current list of 
                  schools and assignments, see&nbsp;
                  <a href="../../../public.divisions.pdf" target="_blank" rel="noreferrer">2018-19 Divisions</a>.
               </p>
            </div>
         </div>
      </div>
   );
}

export default TeamRegister;