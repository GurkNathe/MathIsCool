import React from "react";
import { Link } from "react-router-dom";
import { Accordion, Button, AccordionSummary, ButtonGroup, AccordionDetails, ClickAwayListener } from "@material-ui/core";
import useStyles from "./style";

import fire from "../fire";

//Add ClickAwayListeners for each Accordion so that they close when you click to another one.

function FrontBack(){
   const classes = useStyles();

   return(
      <div className={classes.all}>
         <Accordion defaultExpanded={fire.auth().currentUser ? false : true}>
            <AccordionSummary>
               Home
            </AccordionSummary>
            <div style={{paddingLeft:"20px"}}>
               <Button className={classes.button} href="/">
                  Homepage
               </Button>
               <Accordion>
                  <AccordionSummary className={classes.button}>
                     About Us
                  </AccordionSummary>
                  <AccordionDetails>
                     <ButtonGroup orientation="vertical"> 
                        <Button className={classes.button} component={Link} to="/about/history">History</Button>
                        <Button className={classes.button} component={Link} to="/about/contacts">Contacts</Button>
                        <Button className={classes.button} component={Link} to="/about/locations">Locations</Button>
                     </ButtonGroup>
                  </AccordionDetails>
               </Accordion>
               <Accordion>
                  <AccordionSummary className={classes.button}>
                     Information
                  </AccordionSummary>
                  <AccordionDetails>
                     <ButtonGroup orientation="vertical"> 
                        <Button className={classes.button} component={Link} to="/information/rules">Rules</Button>
                        <Button className={classes.button} component={Link} to="/information/fees">Fees</Button>
                        <Button className={classes.button} component={Link} to="/information/faq">FAQ</Button>
                     </ButtonGroup>
                  </AccordionDetails>
               </Accordion>
               <Accordion>
                  <AccordionSummary className={classes.button}>
                     Resources
                  </AccordionSummary>
                  <AccordionDetails>
                     <ButtonGroup orientation="vertical"> 
                        <Button className={classes.button} component={Link} to="/resources/rules">Rules</Button>
                        <Button className={classes.button} component={Link} to="/resources/past-tests">Past Tests</Button>
                     </ButtonGroup>
                  </AccordionDetails>
               </Accordion>
               <Button className={classes.button} href="/competitions">Competitions</Button>
            </div>
         </Accordion>
      </div>
   );
};

export default FrontBack;