import React from "react";
import { Accordion, Button, AccordionSummary, ButtonGroup, Typography } from "@material-ui/core";
import useStyles from "../style";

function CoachTools(){

   const classes = useStyles();

   return(
      <div className={classes.all}>
         <Typography style={{display:"flex", color:"white", justifyContent:"center", paddingTop:"5px"}}>
            Coach Tools
         </Typography>
         <div style={{paddingLeft:"20px"}}>
            <ButtonGroup orientation="vertical">
               <Button className={classes.button} href="/team-register">
                  Register Team
               </Button>
               <Button className={classes.button} href="/enter-names">
                  Enter Names
               </Button>
            </ButtonGroup>
         </div>
      </div>
   );
}

export default CoachTools;