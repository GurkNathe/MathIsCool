import React from "react";
import { Button, Typography } from "@material-ui/core";
import { Link } from "react-router-dom";
import useStyles from "../style";

export default function Admin(props){

   const classes = useStyles();

   return(
      <div className={classes.all}>
         <Typography className={classes.sHeader}>
            Admin
         </Typography>
         <div style={{paddingLeft:"20px"}}>
            <div>
               <Link to="/admin/import-content" className={classes.link} onClick={props.onClick}>
                  <Button className={classes.homeButton}>
                     Import Content
                  </Button>
               </Link>
               <Link to="/admin/add-admin" className={classes.link} onClick={props.onClick}>
                  <Button className={classes.homeButton}>
                     Add Admin
                  </Button>
               </Link>
               <Link to="/admin/mark-masters" className={classes.link} onClick={props.onClick}>
                  <Button className={classes.homeButton}>
                     Mark Masters
                  </Button>
               </Link>
               <Link to="/admin/manage-comps" className={classes.link} onClick={props.onClick}>
                  <Button className={classes.homeButton}>
                     Manage Competitions
                  </Button>
               </Link>
            </div>
         </div>
      </div>
   );
}
               
               
               
