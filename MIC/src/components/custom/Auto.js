import { TextField, Grid } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import React from "react";

/**
 * 
 * @param props title, options, text, onChange, width, value, error
 */
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
                             style={{ ...props.style, width: props.width, maxWidth: "65vw", marginRight: 0 }}
                          />
                       }
        />
     </div>
  );
}

export default Auto;