import React from "react";
import { Button, Typography } from "@material-ui/core";
import { Link } from "react-router-dom";
import useStyles from "../style";

export default function CoachTools(props){

   const classes = useStyles();

   return(
      <div className={classes.all}>
         <Typography className={classes.sHeader}>
            Coach Tools
         </Typography>
         <div style={{paddingLeft:"20px"}}>
            <div>
               <Link to="/team-register" className={classes.link} onClick={props.onClick}>
                  <Button className={classes.button}>
                     Register Team
                  </Button>
               </Link>
               <Link to="/enter-names" className={classes.link} onClick={props.onClick}>
                  <Button className={classes.button}>
                     Enter Names
                  </Button>
               </Link>
            </div>
         </div>
      </div>
   );
}
