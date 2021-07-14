import React from "react";
import { Link } from "react-router-dom";
import { Accordion, Button, AccordionSummary, ButtonGroup, AccordionDetails, ClickAwayListener } from "@material-ui/core";
import useStyles from "./style";

function CoachTools(){

   const classes = useStyles();

   return(
      <div class={classes.all}>
         <Accordion>
            <AccordionSummary class={classes.button}>
               Coach Tools
            </AccordionSummary>
            <div style={{paddingLeft:"20px"}}>
               <ButtonGroup orientation="vertical">
                  <Button class={classes.button} href="/team-register">
                     Register Team
                  </Button>
                  <Button class={classes.button} href="/masters-register">
                     Register for Masters
                  </Button>
                  <Button class={classes.button} href="/edit-registers">
                     Edit Registration(s)
                  </Button>
                  <Button class={classes.button} href="/individual">
                     Register an Individual
                  </Button>
                  <Button class={classes.button} href="/names">
                     Enter Names
                  </Button>
                  <Button class={classes.button} href="/invoices">
                     View Invoices
                  </Button>
               </ButtonGroup>
            </div>
         </Accordion>
      </div>
   );
}

export default CoachTools;