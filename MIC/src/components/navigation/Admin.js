import React from "react";
import { Accordion, Button, AccordionSummary, ButtonGroup, Typography } from "@material-ui/core";
import useStyles from "../style";

export default function Admin(){

   const classes = useStyles();

   return(
      <div className={classes.all}>
         <Typography style={{display:"flex", color:"white", justifyContent:"center", paddingTop:"5px"}}>
            Admin
         </Typography>
         <div style={{paddingLeft:"20px"}}>
            <ButtonGroup orientation="vertical">
               <Button className={classes.homeButton} href="/admin/import-content">
                  Import Content
               </Button>
            </ButtonGroup>
         </div>
      </div>
   );
}
