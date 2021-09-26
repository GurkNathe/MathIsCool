import React, { useState } from "react";
import { Accordion, Button, AccordionSummary, AccordionDetails, ClickAwayListener, Typography } from "@material-ui/core";
import { Link } from "react-router-dom";
import useStyles from "../style";

export default function FrontBack(props){
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
            <Link className={classes.link} to="/" onClick={props.onClick}>
               <Button className={classes.homeButton}>
                  Homepage
               </Button>
            </Link>
            <ClickAwayListener onClickAway={() => setAway({...away, p1: false})}>
               <Accordion expanded={open === 'panel1' && away.p1} onChange={handleChange('panel1')}>
                  <AccordionSummary className={classes.homeButton}>
                     About Us
                  </AccordionSummary>
                  <AccordionDetails>
                     <div>
                        <Link className={classes.link} to="/about/history" onClick={props.onClick}>
                           <Button className={classes.homeButton}>
                              History
                           </Button>
                        </Link> 
                        <Link className={classes.link} to="/about/contacts" onClick={props.onClick}>
                           <Button className={classes.homeButton}>
                              Contacts
                           </Button>
                        </Link> 
                        <Link className={classes.link} to="/about/locations" onClick={props.onClick}>
                           <Button className={classes.homeButton}>
                              Locations
                           </Button>
                        </Link>
                     </div>
                  </AccordionDetails>
               </Accordion>
            </ClickAwayListener>
            <ClickAwayListener onClickAway={() => setAway({...away, p2: false})}>
               <Accordion expanded={open === 'panel2' && away.p2} onChange={handleChange('panel2')}>
                  <AccordionSummary className={classes.homeButton}>
                     Information
                  </AccordionSummary>
                  <AccordionDetails>
                     <div> 
                        <Link to="/information/rules" className={classes.link} onClick={props.onClick}>
                           <Button className={classes.homeButton}>
                              Rules
                           </Button>
                        </Link>
                        <Link to="/information/fees" className={classes.link} onClick={props.onClick}>
                           <Button className={classes.homeButton}>
                              Fees
                           </Button>
                        </Link>
                        <Link to="/information/faq" className={classes.link} onClick={props.onClick}>
                           <Button className={classes.homeButton}>
                              FAQ
                           </Button>
                        </Link>
                        <Link to="/information/past-tests" className={classes.link} onClick={props.onClick}>
                           <Button className={classes.homeButton}>
                              Past Tests
                           </Button>
                        </Link>
                     </div>
                  </AccordionDetails>
               </Accordion>
            </ClickAwayListener>
            <Link className={classes.link} to="/competitions" onClick={props.onClick}>
               <Button className={classes.homeButton}>
                  Competitions
               </Button>
            </Link>
         </div>
      </div>
   );
};
