import React from "react";
import { Link } from "react-router-dom";
import { Accordion, Button, makeStyles, AccordionSummary, ButtonGroup, AccordionDetails, ClickAwayListener } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
   button:{
      position:"relative",
      overflow:"hidden",
      display:"flex",
      flexDirection:"column",
      justifyContent:"left",
      color:"white",
      borderRadius:"5px",
      textDecoration:"none",
      background:"transparent",
      border:"currentColor",
      fontSize:"15px",
      padding:"10px",
      '&:hover':{
      backgroundColor:"#2a3576",
      opacity:"0.5",
      transition:"background-color 250ms \
                  cubic-bezier(0.4, 0, 0.2, 1) 0ms,box-shadow \
                  250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,border \
                  250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
    }
   },
   accord:{
      border:"none",
      color:"yellow"
   }
}));

function FrontBack(){

   const classes = useStyles();

   return(
      <Accordion
         style={{background:"transparent", color:"white", border:"none"}}  
         root={classes.accord}
      >
         <AccordionSummary 
            class={classes.button}
         >
            Home
         </AccordionSummary>
         <Button class={classes.button} href="/">
            Homepage
         </Button>
         <Accordion style={{background:"transparent", color:"white", border:"none"}} >
            <AccordionSummary class={classes.button}>
               About Us
            </AccordionSummary>
            <AccordionDetails>
               <ButtonGroup orientation="vertical"> 
                  <Button class={classes.button} component={Link} to="/about/history">History</Button>
                  <Button class={classes.button} component={Link} to="/about/contacts">Contacts</Button>
                  <Button class={classes.button} component={Link} to="/about/locations">Locations</Button>
               </ButtonGroup>
            </AccordionDetails>
         </Accordion>
         <Accordion style={{background:"transparent", color:"white"}}>
            <AccordionSummary class={classes.button}>
               Information
            </AccordionSummary>
            <AccordionDetails>
               <ButtonGroup orientation="vertical"> 
                  <Button class={classes.button} component={Link} to="/information/rules">Rules</Button>
                  <Button class={classes.button} component={Link} to="/information/fees">Fees</Button>
                  <Button class={classes.button} component={Link} to="/information/faq">FAQ</Button>
               </ButtonGroup>
            </AccordionDetails>
         </Accordion>
         <Accordion style={{background:"transparent", color:"white"}}>
            <AccordionSummary class={classes.button}>
               Resources
            </AccordionSummary>
            <AccordionDetails>
               <ButtonGroup orientation="vertical"> 
                  <Button class={classes.button} component={Link} to="/resources/rules">Rules</Button>
                  <Button class={classes.button} component={Link} to="/resources/past-tests">Past Tests</Button>
               </ButtonGroup>
            </AccordionDetails>
         </Accordion>
         <Button class={classes.button} href="/competitions">Competitions</Button>
      </Accordion>
   );
};

export default FrontBack;