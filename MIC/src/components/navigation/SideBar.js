import React, { useState } from "react";
import { makeStyles, Drawer, Button, ClickAwayListener, Accordion, AccordionSummary, AccordionDetails, MenuList, MenuItem, ButtonGroup } from "@material-ui/core";
import { Link } from "react-router-dom";

import { Menu } from "@material-ui/icons"

import image from "../../assets/logo.5a82c15d88ad2d074447.png"

const drawerWidth = "128px";

//put all the front stuff under on accordion or like it currently is?


const useStyles = makeStyles((theme) => ({
   closed:{
      transition: "margin-left 450ms cubic-bezier(0.23, 1, 0.32, 1)",
      background: `url(${image}) right center/contain no-repeat #3f51b5`,
   },
   button:{
      position:"relative",
      overflow:"hidden",
      display:"flex",
      flexDirection:"column",
      justifyContent:"left",
      color:"white",
      borderRadius:"5px",
      textDecoration:"none",
      textTransform:"uppercase",
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
   }
}));

function SideBar() {
   const classes = useStyles();
   const [open, setOpen] = useState(false);
   
   return(
      <div>
         <Drawer open={open}>
            <ClickAwayListener onClickAway={() => setOpen(false)}>
               <div style={{background:`url(${image}) right center/contain no-repeat #3f51b5`}}>
                  <div style={{marginLeft:drawerWidth}}>
                     <Button onClick={() => setOpen(false)} style={{color:"white"}}>X</Button>
                  </div>
                  <Button class={classes.button} href="/">
                     Home
                  </Button>
                  <Accordion style={{background:"transparent", color:"white"}}>
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
                  <Button class={classes.button} href="/login" onClick={() => {localStorage.removeItem("authorized")}}>Logout</Button>
               </div>
            </ClickAwayListener>
         </Drawer>
         <div class={classes.closed}>
            <Button onClick={() => setOpen(true)}>
               <Menu/>
            </Button>
         </div>
      </div>
   );
};

export default SideBar;