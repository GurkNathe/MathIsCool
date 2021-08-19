import React from "react";
import { Accordion, Button, AccordionSummary, ButtonGroup } from "@material-ui/core";
import useStyles from "./style";

function CoachTools(){

   const classes = useStyles();

   return(
      <div className={classes.all}>
         <Accordion defaultExpanded>
            <AccordionSummary>
               Coach Tools
            </AccordionSummary>
            <div style={{paddingLeft:"20px"}}>
               <ButtonGroup orientation="vertical">
                  <Button className={classes.button} href="/team-register">
                     Register Team
                  </Button>
                  <Button className={classes.button} href="/names">
                     Enter Names
                  </Button>
               </ButtonGroup>
            </div>
         </Accordion>
      </div>
   );
}

export default CoachTools;