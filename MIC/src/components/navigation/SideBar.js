import React, { useState, useEffect } from "react";
import { makeStyles, Drawer, Button, ClickAwayListener, Divider, Avatar, Typography } from "@material-ui/core";
import { Menu } from "@material-ui/icons";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import { useHistory } from "react-router-dom";

import FrontBack from "./FrontBack";
import CoachTools from "./CoachTools";
import Admin from "./Admin";
import Profile from "../custom/Profile";

import fire from "../fire";

import image from "../../assets/logo.5a82c15d88ad2d074447.png";

const useStyles = makeStyles((theme) => ({
   closed:{
      transition: "margin-left 450ms cubic-bezier(0.23, 1, 0.32, 1)",
      background: "#3f51b5",
      display:"flex",
      flexDirection:"row",
      '&::-webkit-scrollbar':{
         display:"none"
      }
   },
   button:{
      justifyContent:"left",
      textTransform:"capitalize",
      color:"white",
      borderRadius:"0",
      width:"100%",
      fontSize:"15px",
      padding:"10px",
      '-webkit-text-stroke': "0.5px",
      '-webkit-text-stroke-color': "black",
      '&:hover':{
         backgroundColor:"#2a3576",
         opacity:"0.9",
         transition:"background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,border 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
      },
      '& .MuiButton-root':{
         fontWeight:"inherit",
      }
   },
   x:{
      color:"white",
      '&:hover':{
         color:"#101010",
         backgroundColor:"transparent",
         transition:"background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,border 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
      },
      '& .MuiButton-root':{
         fontWeight:"inherit",
      }
   },
   inner:{
      background:`url(${image}) right center/contain no-repeat #3f51b5`,
      height:"100%", 
      overflowX:"hidden",
      overflowY:"scroll",
      display:"flex",
      '&::-webkit-scrollbar':{
         display:"none"
      }
   },
   outer:{
      overflow:"hidden",
   },
   avatar: {
      '&:hover':{
        backgroundColor: "grey",
        cursor: "pointer",
      },
      width: "40px",
      height: "40px",
   },
   avatar2: {
      color:"#c6c6c6",
      width: "40px",
      height: "40px",
      '&:hover':{
         color:"grey"
      }
   }
}));

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
               <div className={classes.inner}>
                  <FrontBack/>
                  { fire.auth().currentUser ? <CoachTools/> : null }
                  <Admin/>
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