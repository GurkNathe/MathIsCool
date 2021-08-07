import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Accordion, Button, AccordionSummary, ButtonGroup, AccordionDetails, ClickAwayListener } from "@material-ui/core";
import useStyles from "./style";

function FrontBack(){
   const classes = useStyles();
   const [open, setOpen] = useState(false);
   const [away, setAway] = useState({p1: true, p2: true, p3: true});

   const handleChange = (panel) => (event, isOpen) => {
      setOpen(isOpen ? panel : false);
      setAway({p1:true, p2:true, p3:true});
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
                           <Button className={classes.button} component={Link} to="/about/history">History</Button>
                           <Button className={classes.button} component={Link} to="/about/contacts">Contacts</Button>
                           <Button className={classes.button} component={Link} to="/about/locations">Locations</Button>
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
                           <Button className={classes.button} component={Link} to="/information/rules">Rules</Button>
                           <Button className={classes.button} component={Link} to="/information/fees">Fees</Button>
                           <Button className={classes.button} component={Link} to="/information/faq">FAQ</Button>
                        </ButtonGroup>
                     </AccordionDetails>
                  </Accordion>
               </ClickAwayListener>
               <ClickAwayListener onClickAway={() => setAway({...away, p3: false})}>
                  <Accordion expanded={open === 'panel3' && away.p3} onChange={handleChange('panel3')}>
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
               </ClickAwayListener>
               <Button className={classes.button} href="/competitions">Competitions</Button>
            </div>
         </Accordion>
      </div>
   );
};

export default FrontBack;
