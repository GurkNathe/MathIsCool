import React from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import useStyles from "../style";

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