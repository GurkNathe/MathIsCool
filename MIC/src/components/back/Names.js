import React, { useState } from "react";
import Typography from "@material-ui/core/Typography";

import Auto from "../custom/Auto";
import Table from "../custom/Table";
import useStyles from "../style";

import options from "./options.json";

/**
 * TODO: Add Firestore pull on selection of school.
 * TODO: Add submit to Firestore/Google Sheets for names.
 */
function Names() {
  const classes = useStyles();
  const [choice, setChoice] = useState({
                                        school: null,
                                        error: null
                                      });

  const onChange = (newValue, type) => {
    switch (type) {
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
       default:
          console.log(newValue, type)
    }
 };

 const numbers = 6;
 const indiv = 12;

  return (
    <div className={classes.page}>
      <div className={classes.innerN}>
        <Typography className={classes.title}>
          School Registering
        </Typography>
        <Auto
          title=""
          options={options.school}
          text="Select Your School"
          onChange={(event, newValue) => onChange(newValue, "school")}
          width="50vw"
          value={choice.school}
          error={choice.error}
          
        />
      </div>
      <div className={classes.top}>
        <div className={classes.middle}>
          <div className={classes.bottom}>
            <Table teams={numbers} individuals={indiv}/>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Names;
