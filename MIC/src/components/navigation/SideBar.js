import React, { useState, useContext } from "react";
import { makeStyles, Drawer, Button, ClickAwayListener, Divider } from "@material-ui/core";
import { useHistory } from "react-router-dom";

import FrontBack from "../back/FrontBack";
import CoachTools from "../back/CoachTools";

import fire from "../fire";

import { Menu } from "@material-ui/icons";

import image from "../../assets/logo.5a82c15d88ad2d074447.png";

const drawerWidth = "128px";

const useStyles = makeStyles((theme) => ({
   closed:{
      transition: "margin-left 450ms cubic-bezier(0.23, 1, 0.32, 1)",
      background: `url(${image}) right center/contain no-repeat #3f51b5`,
      '&::-webkit-scrollbar':{
         display:"none"
      }
   },
   button:{
      justifyContent:"left",
      textTransform:"capitalize",
      color:"white",
      width:"auto",
      borderRadius:"0",
      width:"100%",
      fontSize:"15px",
      padding:"10px",
      '-webkit-text-stroke': "0.5px",
      '-webkit-text-stroke-color': "black",
      '&:hover':{
         backgroundColor:"#2a3576",
         opacity:"0.9",
         transition:"background-color 250ms \
                     cubic-bezier(0.4, 0, 0.2, 1) 0ms,box-shadow \
                     250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,border \
                     250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
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
         transition:"background-color 250ms \
                     cubic-bezier(0.4, 0, 0.2, 1) 0ms,box-shadow \
                     250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,border \
                     250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
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
   }
}));

function SideBar() {
   const history = useHistory();
   const classes = useStyles();
   const [open, setOpen] = useState(false);
   
   return(
      <div className={classes.outer}>
         <Drawer open={open} anchor="top">
            <ClickAwayListener onClickAway={() => setOpen(false)}>
               <div className={classes.inner}>
                  <div style={{alignContent:"left"}}>
                     <Button onClick={() => setOpen(false)} className={classes.x}>X</Button>
                  </div>
                  <FrontBack/>
                  { fire.auth().currentUser ? <CoachTools/> : null }
                  <Divider/>
                  
                  { fire.auth().currentUser ?
                     <Button className={classes.button} onClick={() => {
                              fire.auth().signOut()
                                 .then((user) => {
                                    setOpen(false);
                                    history.push("/login")
                                 })
                                 .catch((error) => {
                                    console.log("An error occured ", error)
                                 })
                           }
                        }
                     >
                        Logout
                     </Button> :
                     <Button className={classes.button} href="/login">
                        Login
                     </Button>
                  }

               </div>
            </ClickAwayListener>
         </Drawer>
         <div className={classes.closed}>
            <Button onClick={() => setOpen(true)}>
               <Menu style={{color:"white"}}/>
            </Button>
         </div>
      </div>
   );
};

export default SideBar;