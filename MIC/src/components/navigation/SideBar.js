import React, { useState, useContext } from "react";
import { makeStyles, Drawer, Button, ClickAwayListener, Divider } from "@material-ui/core";

import FrontBack from "../back/FrontBack";
import CoachTools from "../back/CoachTools";
import Context from "../../context/loginContext";

import { Menu } from "@material-ui/icons";

import image from "../../assets/logo.5a82c15d88ad2d074447.png";

const drawerWidth = "128px";

//put all the front stuff under on accordion or like it currently is?


const useStyles = makeStyles((theme) => ({
   closed:{
      transition: "margin-left 450ms cubic-bezier(0.23, 1, 0.32, 1)",
      background: `url(${image}) right center/contain no-repeat #3f51b5`,
      '&::-webkit-scrollbar':{
         display:"none"
      }
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
   const {state, actions} = useContext(Context);
   
   return(
      <div>
         <Drawer open={open}>
            <ClickAwayListener onClickAway={() => setOpen(false)}>
               <div style={{background:`url(${image}) right center/contain no-repeat #3f51b5`, height:"100%", overflow:"auto"}}>
                  <div style={{marginLeft:drawerWidth}}>
                     <Button onClick={() => setOpen(false)} style={{color:"white"}}>X</Button>
                  </div>
                  <FrontBack/>
                  <CoachTools/>
                  <Divider/>
                  <Button className={classes.button} href="/login" onClick={() => {
                           localStorage.removeItem("id");
                        }
                     }
                  >
                     Logout
                  </Button>
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