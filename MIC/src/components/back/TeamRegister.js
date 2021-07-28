import { TextField, MenuItem, makeStyles, Grid } from "@material-ui/core";
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

// <TextField
// select
// variant="outlined"
// label="Please Select Grade Level"
// value={choice.lev}
// onChange={(event) => onChange(event, "level")}
// >
// {options.level.map((option) => (
//    <MenuItem key={option.value} value={option.value}>
//       {option.label}
//    </MenuItem>
// ))}
// </TextField>

{/* <div style={{display:"flex"}}>
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
      style={{ width: longest }}
   >

   </TextField>
</div> */}

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
                              label={props.text} 
                              variant="outlined"
                              style={{ width: props.width }}
                           />
                        }
         />
      </div>
   );
}

function TeamRegister(){
   const classes = useStyles();
   const [choice, setChoice] = useState({loc: "", lev: "", school: "", coach: ""});

   let longest = 0;

   //finding length of longest string in options and resize search box accordingly
   for(var option in options){
      for(let i = 0; i < Object.keys(options[option]).length; i++){
         if(options[option][i].label.length > longest)
            longest = options[option][i].label.length;
      }
   }

   //don't know if there is a good way to do this, couldn't find anything
   longest *= 11;

   const onChange = (newValue, type) => {
      switch (type) {
         case "location":
            if(newValue != null){
               setChoice((prevState) => ({
                  ...prevState,
                  loc: newValue,
               }));
            } else {
               setChoice((prevState) => ({
                  ...prevState,
                  loc: "",
               }));
            }
            console.log(choice)
            break;
         case "level":
            if(newValue != null){
               setChoice((prevState) => ({
                  ...prevState,
                  lev: newValue,
               }));
            } else {
               setChoice((prevState) => ({
                  ...prevState,
                  lev: "",
               }));
            }
            console.log(choice)
            break;
         case "school":
            if(newValue != null){
               setChoice((prevState) => ({
                  ...prevState,
                  school: newValue,
               }));
            } else {
               setChoice((prevState) => ({
                  ...prevState,
                  school: "",
               }));
            }
            console.log(choice)
            break;
         case "coach":
            setChoice((prevState) => ({
               ...prevState,
               coach: newValue.target.value,
            }));
            break;
         default:
            console.log(newValue, type)
      }
   };

   return(
      <div style={{display: "flex", flexDirection:"row"}}>
         <div style={{borderRadius: "4px", margin:"2%", boxShadow:"0 3px 1px -2px rgb(0 0 0 / 20%), 0 2px 2px 0 rgb(0 0 0 / 14%), 0 1px 5px 0 rgb(0 0 0 / 12%)"}}>
            <div style={{marginLeft:"1%", marginRight:"1%"}}>
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
                  />
                  <Auto
                     title="Competition Level"
                     options={options.level}
                     text="Select Your Grade Level"
                     onChange={(event, newValue) => onChange(newValue, "level")}
                     width={longest}
                     value={choice.lev}
                  />
                  <Auto
                     title="School Registering"
                     options={options.school}
                     text="Select Your School"
                     onChange={(event, newValue) => onChange(newValue, "school")}
                     width={longest}
                     value={choice.school}
                  />
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