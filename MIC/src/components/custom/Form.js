import React from "react";
import { makeStyles } from "@material-ui/styles";

//NEED TO FIND A WAY TO DISABLE SCROLL BAR OF GOOGLE FORM

const useStyles = makeStyles((theme) => ({
  gform: {
    width:"100%",
    height:"1379px",
    frameBorder:"0",
    marginHeight:"0",
    marginWidth:"0",
 }
}))

function Form(props) {
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

export default Form;