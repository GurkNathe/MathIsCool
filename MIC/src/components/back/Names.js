import React, { useState } from "react";
import { makeStyles, Typography } from "@material-ui/core";

import Auto from "../custom/Auto";
import Table from "../custom/Table";

import options from "./options.json";

const useStyles = makeStyles((theme) => ({
  page: {
    width:"100vw",
    minHeight:"80vh",
    display:"flex",
    textAlign:"center",
    justifyContent:"center",
    flexWrap:"wrap",
  },
  inner: {
    padding:"10px",
  },
  title: {
    fontSize: "1.35rem",
  },
  top: {
    display: "flex", 
    flexDirection:"row"
  },
  second: {
    width:"100vw", 
    minHeight:"70vh",
    borderRadius: "4px", 
    marginRight:"2%",
    marginLeft:"2%",
    marginBottom:"1%",
    boxShadow:"0 3px 1px -2px rgb(0 0 0 / 20%), 0 2px 2px 0 rgb(0 0 0 / 14%), 0 1px 5px 0 rgb(0 0 0 / 12%)"
  },
  bottom: {
    marginLeft:"1%", 
    marginRight:"1%",
    marginTop:"1%",
  }
}));

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

  return (
    <div className={classes.page}>
      <div className={classes.inner}>
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
        <div className={classes.second}>
          <div className={classes.bottom}>
            <Table teams={numbers}/>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Names;
