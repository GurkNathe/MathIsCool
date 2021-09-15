import React from "react";
import useStyles from "../style";

export default function BasicPage(props) {
  const classes = useStyles();
  return(
    <div className={classes.root}>
      <div className={classes.second}>
        <div className={classes.inner}>
          {props.children}
        </div>
      </div>
    </div>
  );
}
