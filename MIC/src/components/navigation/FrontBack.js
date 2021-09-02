import React, { useState } from "react";
import { Accordion, Button, AccordionSummary, ButtonGroup, AccordionDetails, ClickAwayListener, Typography } from "@material-ui/core";
import useStyles from "../style";

export default function FrontBack(){
   const classes = useStyles();
   const [open, setOpen] = useState(false);
   const [away, setAway] = useState({p1: true, p2: true});

   const handleChange = (panel) => (event, isOpen) => {
      setOpen(isOpen ? panel : false);
      setAway({p1:true, p2:true});
   }

   return(
      <div className={classes.all}>
         <Typography style={{display:"flex", color:"white", justifyContent:"center", paddingTop:"5px"}}>
            Home
         </Typography>
         <div style={{paddingLeft:"20px"}}>
            <Button className={classes.homeButton} href="/">
               Homepage
            </Button>
            <ClickAwayListener onClickAway={() => setAway({...away, p1: false})}>
               <Accordion expanded={open === 'panel1' && away.p1} onChange={handleChange('panel1')}>
                  <AccordionSummary className={classes.homeButton}>
                     About Us
                  </AccordionSummary>
                  <AccordionDetails>
                     <ButtonGroup orientation="vertical"> 
                        <Button className={classes.homeButton} href="/about/history">History</Button>
                        <Button className={classes.homeButton} href="/about/contacts">Contacts</Button>
                        <Button className={classes.homeButton} href="/about/locations">Locations</Button>
                     </ButtonGroup>
                  </AccordionDetails>
               </Accordion>
            </ClickAwayListener>
            <ClickAwayListener onClickAway={() => setAway({...away, p2: false})}>
               <Accordion expanded={open === 'panel2' && away.p2} onChange={handleChange('panel2')}>
                  <AccordionSummary className={classes.homeButton}>
                     Information
                  </AccordionSummary>
                  <AccordionDetails>
                     <ButtonGroup orientation="vertical"> 
                        <Button className={classes.homeButton} href="/information/rules">Rules</Button>
                        <Button className={classes.homeButton} href="/information/fees">Fees</Button>
                        <Button className={classes.homeButton} href="/information/faq">FAQ</Button>
                        <Button className={classes.homeButton} href="/information/past-tests">Past Tests</Button>
                     </ButtonGroup>
                  </AccordionDetails>
               </Accordion>
            </ClickAwayListener>
            <Button className={classes.homeButton} href="/competitions">Competitions</Button>
         </div>
      </div>
   );
};
