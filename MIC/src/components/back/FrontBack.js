import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Accordion, Button, AccordionSummary, ButtonGroup, AccordionDetails, ClickAwayListener } from "@material-ui/core";
import useStyles from "./style";

function FrontBack(){
   const classes = useStyles();
   const [open, setOpen] = useState(false);
   const [away, setAway] = useState({p1: true, p2: true});

   const handleChange = (panel) => (event, isOpen) => {
      setOpen(isOpen ? panel : false);
      setAway({p1:true, p2:true});
   }

   return(
      <div className={classes.all}>
         <Accordion defaultExpanded>
            <AccordionSummary>
               Home
            </AccordionSummary>
            <div style={{paddingLeft:"20px"}}>
               <Button className={classes.button} href="/">
                  Homepage
               </Button>
               <ClickAwayListener onClickAway={() => setAway({...away, p1: false})}>
                  <Accordion expanded={open === 'panel1' && away.p1} onChange={handleChange('panel1')}>
                     <AccordionSummary className={classes.button}>
                        About Us
                     </AccordionSummary>
                     <AccordionDetails>
                        <ButtonGroup orientation="vertical"> 
                           <Button className={classes.button} href="/about/history">History</Button>
                           <Button className={classes.button} href="/about/contacts">Contacts</Button>
                           <Button className={classes.button} href="/about/locations">Locations</Button>
                        </ButtonGroup>
                     </AccordionDetails>
                  </Accordion>
               </ClickAwayListener>
               <ClickAwayListener onClickAway={() => setAway({...away, p2: false})}>
                  <Accordion expanded={open === 'panel2' && away.p2} onChange={handleChange('panel2')}>
                     <AccordionSummary className={classes.button}>
                        Information
                     </AccordionSummary>
                     <AccordionDetails>
                        <ButtonGroup orientation="vertical"> 
                           <Button className={classes.button} href="/information/rules">Rules</Button>
                           <Button className={classes.button} href="/information/fees">Fees</Button>
                           <Button className={classes.button} href="/information/faq">FAQ</Button>
                           <Button className={classes.button} href="/information/past-tests">Past Tests</Button>
                        </ButtonGroup>
                     </AccordionDetails>
                  </Accordion>
               </ClickAwayListener>
               <Button className={classes.button} href="/competitions">Competitions</Button>
            </div>
         </Accordion>
      </div>
   );
};

export default FrontBack;
