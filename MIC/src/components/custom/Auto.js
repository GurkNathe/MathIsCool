import { TextField, Grid } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import React from "react";

/**
 * 
 * @param props title, options, text, onChange, width, value, error
 */
 export default function Auto(props){
   return(
     <div style={{display:"flex"}}>
        <Grid item sm={3}>
           <p>{props.title}</p>
        </Grid>
        <Autocomplete
           options={props.options.map((option) => option.label)}
           value={props.value}
           onChange={props.onChange}
           disabled={props.disabled}
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
                             className={props.className}
                             style={props.className === undefined ? 
                              { ...props.style, width: props.width, maxWidth: "65vw", marginRight: 0 }:
                              null
                             }
                          />
                       }
        />
     </div>
  );
}
