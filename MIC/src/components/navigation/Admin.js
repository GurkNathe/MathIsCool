import React from "react";
import { Button, ButtonGroup, Typography } from "@material-ui/core";
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
               <Button className={classes.homeButton} href="/admin/add-admin">
                  Add Admin
               </Button>
            </ButtonGroup>
         </div>
      </div>
   );
}
