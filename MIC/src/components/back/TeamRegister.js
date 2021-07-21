import { TextField, MenuItem, makeStyles, Grid } from "@material-ui/core";
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

function TeamRegister(){
   const classes = useStyles();
   const [choice, setChoice] = useState({loc: "", lev: "", school: "", coach: ""});

   const onChange = (event, type) => {
      switch (type) {
         case "location":
            setChoice((prevState) => ({
               ...prevState,
               loc: event.target.value,
            }));
            break;
         case "level":
            setChoice((prevState) => ({
               ...prevState,
               lev: event.target.value,
            }));
            break;
         case "school":
            setChoice((prevState) => ({
               ...prevState,
               school: event.target.value,
            }));
            break;
         case "coach":
            setChoice((prevState) => ({
               ...prevState,
               coach: event.target.value,
            }));
            break;
         default:
            console.log(event, type)
      }
   };

   return(
      <div style={{paddingLeft:"10px"}}>
         <p>
            <b>Rules for Individuals:</b> Any student may compete as an individual 
            in their grade level or any higher grade; however, a student may 
            compete as a team at one grade level only. This applies to both 
            Championships and Masters.<br/>

            Also note each team includes four students in addition to 
            two alternates per school that can compete as individuals. So 
            when registering n teams , you get to bring 4n+2 students along. 
            These students don't need to be registered as individuals separately.
         </p>
         <form className={classes.root} noValidate autoComplete="off">
            <div style={{display:"flex"}}>
               <Grid item sm={3}>
                  <p>Competition Location</p>
               </Grid>
               <TextField
                  select
                  variant="outlined"
                  label="Please Select Location"
                  value={choice.loc}
                  onChange={(event) => onChange(event, "location")}
               >
                  {options.locations.map((option) => (
                     <MenuItem key={option.value} value={option.value}>
                        {option.label}
                     </MenuItem>
                  ))}
               </TextField>
            </div>
            <div style={{display:"flex"}}>
               <Grid item sm={3}>
                  <p>Competition Level</p>
               </Grid>
               <TextField
                  select
                  variant="outlined"
                  label="Please Select Grade Level"
                  value={choice.lev}
                  onChange={(event) => onChange(event, "level")}
               >
                  {options.level.map((option) => (
                     <MenuItem key={option.value} value={option.value}>
                        {option.label}
                     </MenuItem>
                  ))}
               </TextField>
            </div>
            <div style={{display:"flex"}}>
               <Grid item sm={3}>
                  <p>School Registering</p>
               </Grid>
               <TextField
                  select
                  variant="outlined"
                  label="Please Select School"
                  value={choice.school}
                  onChange={(event) => onChange(event, "school")}
               >
                  {options.school.map((option) => (
                     <MenuItem key={option.value} value={option.value}>
                        {option.label}
                     </MenuItem>
                  ))}
               </TextField>
            </div>
            <div style={{display:"flex"}}>
               <Grid item sm={3}>
                  <p>Coach</p>
               </Grid>
               <TextField
                  variant="outlined" 
                  margin="normal" 
                  required
                  label="Coach"
                  value={choice.coach}
                  onChange={(event) => onChange(event, "coach")}
               >

               </TextField>
            </div>
         </form>
      </div>
   );
}

export default TeamRegister;