import React, { useState, useEffect } from "react";
import { makeStyles, Drawer, Button, ClickAwayListener, Divider, Avatar } from "@material-ui/core";
import { Menu } from "@material-ui/icons";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import { useHistory } from "react-router-dom";

import FrontBack from "../back/FrontBack";
import CoachTools from "../back/CoachTools";
import Profile from "../random/Profile";

import fire from "../fire";

import image from "../../assets/logo.5a82c15d88ad2d074447.png";

// `url(${image}) right center/contain no-repeat #3f51b5`

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

// { fire.auth().currentUser ?
//    <Button className={classes.button} onClick={() => {
//             fire.auth().signOut()
//                .then((user) => {
//                   setOpen(false);
//                   history.push("/login")
//                })
//                .catch((error) => {
//                   console.log("An error occured ", error)
//                })
//          }
//       }
//    >
//       Logout
//    </Button> :
//    <Button className={classes.button} href="/login">
//       Login
//    </Button>
// }

function SideBar() {
   const history = useHistory();
   const classes = useStyles();
   const [open, setOpen] = useState(false);
   const [name, setName] = useState(1);

   useEffect(() => {
      setTimeout(() => {
         setName(fire.auth().currentUser);
      }, 2000)
   }, [name]);

   console.log(name)

   return(
      <div className={classes.outer}>
         <Drawer open={open} anchor="top">
            <ClickAwayListener onClickAway={() => setOpen(false)}>
               <div className={classes.inner}>
                  <FrontBack/>
                  { fire.auth().currentUser ? <CoachTools/> : null }
                  <Divider/>
                  <Profile/>
               </div>
            </ClickAwayListener>
         </Drawer>
         <div className={classes.closed}>
            <Button onClick={() => setOpen(true)}>
               <Menu style={{color:"white"}}/>
            </Button>
            <div style={{marginTop:"10px", marginBottom:"10px", marginLeft:"auto", marginRight:"10px"}}>
               {fire.auth().currentUser ?
                  <Avatar className={classes.avatar}>
                     <Button onClick={() => {setOpen(false); history.push("/profile")}}>
                        {fire.auth().currentUser.displayName.match(/(\b\S)?/g).join("").toUpperCase()}
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