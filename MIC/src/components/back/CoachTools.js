import React from "react";
// import { Link } from "react-router-dom";
import { Accordion, Button, AccordionSummary, ButtonGroup, AccordionDetails, ClickAwayListener } from "@material-ui/core";
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
                  <Button className={classes.button} href="/masters-register">
                     Register for Masters
                  </Button>
                  <Button className={classes.button} href="/edit-registers">
                     Edit Registrations
                  </Button>
                  <Button className={classes.button} href="/individual">
                     Register an Individual
                  </Button>
                  <Button className={classes.button} href="/names">
                     Enter Names
                  </Button>
                  <Button className={classes.button} href="/invoices">
                     View Invoices
                  </Button>
               </ButtonGroup>
            </div>
         </Accordion>
      </div>
   );
}

export default CoachTools;