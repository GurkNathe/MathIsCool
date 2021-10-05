import React, { useState } from "react";
import { Accordion, AccordionDetails, ClickAwayListener } from "@mui/material";
import { LinkButton, All, Header, Summary } from "../styledComps";

export default function FrontBack(props){
   const [open, setOpen] = useState(false);
   const [away, setAway] = useState({p1: true, p2: true});

   const handleChange = (panel) => (event, isOpen) => {
      setOpen(isOpen ? panel : false);
      setAway({p1: true, p2: true});
   }

   // used to generate the links under each accordion tab
   const tabs = [[{ to: "/about/history", text: "History" },
                  { to: "/about/contacts", text: "Contacts" },
                  { to: "/about/locations", text: "Locations" }],
                 [{ to: "/information/rules", text: "Rules" },
                  { to: "/information/fees", text: "Fees" },
                  { to: "/information/faq", text: "FAQ" },
                  { to: "/information/past-tests", text: "Past Tests" }]]
                 
   return(
      <All>
         <Header>
            Home
         </Header>
         <LinkButton to="/" onClick={props.onClick} text="Homepage" />
         <ClickAwayListener onClickAway={() => setAway({...away, p1: false})}>
         
            <Accordion expanded={open === 'panel1' && away.p1} onChange={handleChange('panel1')}>
               <Summary>
                  About Us
               </Summary>
               <AccordionDetails>
                  <div>
                     {tabs[0].map((data, index) => {
                        return (
                           <LinkButton key={index} to={data.to} onClick={props.onClick} text={data.text}/>
                        )
                     })}
                  </div>
               </AccordionDetails>
            </Accordion>
         </ClickAwayListener>
         <ClickAwayListener onClickAway={() => setAway({...away, p2: false})}>

            <Accordion expanded={open === 'panel2' && away.p2} onChange={handleChange('panel2')}>
               <Summary>
                  Information
               </Summary>
               <AccordionDetails>
                  <div>
                     {tabs[1].map((data, index) => {
                        return (
                           <LinkButton key={index} to={data.to} onClick={props.onClick} text={data.text}/>
                        )
                     })}
                  </div>
               </AccordionDetails>
            </Accordion>
         </ClickAwayListener>
         <LinkButton to="/competitions" onClick={props.onClick} text="Competitions"/>
      </All>
   );
};
