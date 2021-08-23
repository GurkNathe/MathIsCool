import React, { useState } from "react";

import { TextField } from "@material-ui/core";
import useStyles from "../style";

//Used for Enter Names table

//props #individuals, #teams
export default function Table(props) {
  const classes = useStyles();
  const [students, setStudents] = useState({
                                              student1: "",
                                              student2: "",
                                              student3: "",
                                              student4: "",
                                              alt1: "",
                                              alt2: "",
                                            });
  //creates an array with from 1 to props.teams
  const teams = Array.from({length: props.teams}, (_, i) => i + 1);

  const onChange = (type, newValue) => {
    switch (type) {
      case "student1":
        setStudents((prevStudents) => ({
          ...prevStudents,
          student1: newValue,
        }))
        break;
      case "student2":
        setStudents((prevStudents) => ({
          ...prevStudents,
          student1: newValue,
        }))
        break;
      case "student3":
        setStudents((prevStudents) => ({
          ...prevStudents,
          student1: newValue,
        }))
        break;
      case "student4":
        setStudents((prevStudents) => ({
          ...prevStudents,
          student1: newValue,
        }))
        break;
      default:
        console.log(newValue);
    }

  }

  return(
    <div className={classes.root}>
      <div className={classes.table}>
        {
          teams.map((team, index) => {
            return(
              <div className={classes.table} key={index}>
              {team}
                {
                  [1,2,3,4].map((num, ind) => {
                    return(
                      <div key={ind}>
                        <TextField
                          variant="outlined" 
                          margin="normal"
                          label={`Student #${num}`}
                          value={students[`student${num}`]}
                          onChange={(event, newValue) => onChange(`student${num}`,newValue)}
                        />
                    </div>
                    );
                  })
                }
              </div>
            )
          })
        }
        {
          [1,2].map((num, index) => {
            return(
              <div key={index}>
                <TextField
                  variant="outlined" 
                  margin="normal"
                  label={`Alternate #${num}`}
                  value={students[`student${num}`]}
                />
              </div>
            );
          })
        }
      </div>
      
    </div>
  );
}
