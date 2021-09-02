import React, { useState, useEffect } from "react";
import { Drawer, Button, ClickAwayListener, Divider, Avatar, Typography } from "@material-ui/core";
import { Menu } from "@material-ui/icons";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import { useHistory } from "react-router-dom";

import FrontBack from "./FrontBack";
import CoachTools from "./CoachTools";
import Admin from "./Admin";
import Profile from "../custom/Profile";
import useStyles from "../style";

import fire from "../fire";

//NOTE: Mobile rendering of the pushed profile button is still pushed after switching pages

function SideBar() {
   const history = useHistory();
   const classes = useStyles();
   const [open, setOpen] = useState(false);
   const [name, setName] = useState(1);

   const username = localStorage.getItem("username");

   useEffect(() => {
      setTimeout(() => {
         setName(fire.auth().currentUser);
      }, 1000)
   }, [name]);

   return(
      <div className={classes.outer}>
         <Drawer open={open} anchor="top">
            <ClickAwayListener onClickAway={() => setOpen(false)}>
               <div className={classes.in}>
                  <FrontBack/>
                  { fire.auth().currentUser ? <CoachTools/> : null }
                  { fire.auth().currentUser ? <Admin/> : null} {/* TODO: need to add admin permission check */}
                  <Divider/>
                  <Profile/>
               </div>
            </ClickAwayListener>
         </Drawer>
         <div className={classes.closed}>
            <Button onClick={() => setOpen(true)}>
               <Menu style={{color:"white"}}/>
            </Button>
            <Typography style={{color:"white", display:"flex", alignItems:"center", fontSize:"2.5rem", fontFamily:"math"}}>
               Math Is Cool
            </Typography>
            <div style={{marginTop:"10px", marginBottom:"10px", marginLeft:"auto", marginRight:"10px"}}>
               {username ?
                  <Avatar className={classes.avatar}>
                     <Button onClick={() => {setOpen(false); history.push("/profile")}}>
                        {username.match(/(\b\S)?/g).join("").toUpperCase()}
                     </Button>
                  </Avatar>:
                  <AccountCircleIcon onClick={() => {setOpen(false); history.push("/profile")}} className={classes.avatar2}/>
               }
            </div>
         </div>
      </div>
   );
};

export default SideBar;