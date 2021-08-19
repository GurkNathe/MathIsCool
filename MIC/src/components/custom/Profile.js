import React from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/styles";
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

import fire from "../fire";

const useStyles = makeStyles((theme) => ({
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
}))

function Profile() {
  const classes = useStyles();

  const username = localStorage.getItem("username");
  
  return(
    <div style={{marginTop:"10px", marginBottom:"10px", marginLeft:"auto", marginRight:"10px"}}>
      { username !== null && username !== undefined ?
        <Avatar className={classes.avatar}>
            <Button href="/profile">
              {username.match(/(\b\S)?/g).join("").toUpperCase()}
            </Button>
        </Avatar>:
        <AccountCircleIcon href="/profile" className={classes.avatar2}/>
      }
    </div>
  );
}

export default Profile;