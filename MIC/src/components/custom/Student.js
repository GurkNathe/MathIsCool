import React from "react";
import { TextField } from "@material-ui/core"
import options from "../back/options.json";
import Auto from "./Auto";
import useStyles from "../style";

export default function Student(props){
  const classes = useStyles();

  return(
    <tr className={classes.main}>
      <td>
        <TextField 
          value={props.stud.name}
          onChange={(event) => props.onChange(event.target.value, props.index, "name")}
          variant="outlined"
        >
        </TextField>
      </td>
      <td>
        <Auto
          options={options.grade}
          value={props.stud.grade}
          className={classes.field}
          onChange={(event, newValue) => props.onChange(newValue, props.index, "grade")}
        />
      </td>
      <td>
        <Auto
          options={options.stlev}
          value={props.stud.level}
          className={classes.field}
          onChange={(event, newValue) => props.onChange(newValue, props.index, "level")}
        />
      </td>
      <td>
        <Auto
          options={props.ops}
          value={props.stud.pos}
          className={classes.field}
          onChange={(event, newValue) => props.onChange(newValue, props.index, "pos")}
        />
      </td>
    </tr>
  );
}