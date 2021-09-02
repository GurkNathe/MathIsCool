import React from "react";
import useStyles from "../style";

//NEED TO FIND A WAY TO DISABLE SCROLL BAR OF GOOGLE FORM (MIGHT NOT BE POSSIBLE)

export default function Form(props) {
  const classes = useStyles();

  return(
    <iframe 
      id="frame"
      title="register"
      src={props.location.state.key} 
      className={classes.gform}
    >
      Loading…
    </iframe>
  );
}
