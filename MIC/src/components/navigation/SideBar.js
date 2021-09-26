import React, { useState, useEffect } from "react";
import { Drawer, Button, ClickAwayListener, Divider, Avatar, Typography } from "@material-ui/core";
import { Menu } from "@material-ui/icons";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import { Link } from "react-router-dom";

import FrontBack from "./FrontBack";
import CoachTools from "./CoachTools";
import Admin from "./Admin";
import Profile from "../custom/Profile";
import useStyles from "../style";

import fire from "../fire";

//NOTE: Mobile rendering of the pushed profile button is still pushed after switching pages
//TODO: Make open bar buttons fit to screen

export default function SideBar() {
   const classes = useStyles();
   const [open, setOpen] = useState(false);
   const [name, setName] = useState(1);

   const username = sessionStorage.getItem("username");

   if(name === 1){
      fire.auth().onAuthStateChanged((use) => {
         setName(use);
      })
   }

   const onClick = () => {
      setOpen(false)
   }

   return(
      <div className={classes.outer}>
         <Drawer open={open} anchor="top">
            <ClickAwayListener onClickAway={() => setOpen(false)}>
               <div className={classes.in}>
                  <FrontBack onClick={onClick}/>
                  { fire.auth().currentUser ? <CoachTools onClick={onClick}/> : null }
                  { fire.auth().currentUser ? fire.auth().currentUser.photoURL ? <Admin onClick={onClick}/> : null : null}
                  <Divider/>
                  <Profile setOpen={setOpen}/>
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
                     <Link to="/profile" className={classes.link} onClick={() => {setOpen(false)}}>
                        <Button>
                        {username.match(/(\b\S)?/g).join("").toUpperCase()}
                        </Button>
                     </Link>
                  </Avatar>:
                  <Link to="/profile" className={classes.link} onClick={() => {setOpen(false)}}>
                     <AccountCircleIcon className={classes.avatar2}/>
                  </Link>
               }
            </div>
         </div>
      </div>
   );
};
