import React from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import useStyles from "../style";
import { Link } from "react-router-dom";

export default function Profile(props) {
  const classes = useStyles();

  const username = sessionStorage.getItem("username");
  
  return(
    <div style={{marginTop:"10px", marginBottom:"10px", marginLeft:"auto", marginRight:"10px"}}>
      { username !== null && username !== undefined ?
        <Avatar className={classes.avatar}>
          <Link to="/profile" className={classes.link} onClick={() => {props.setOpen(false)}}>
            <Button>
              {username.match(/(\b\S)?/g).join("").toUpperCase()}
            </Button>
          </Link>
        </Avatar>:
        <Link to="/profile" className={classes.link} onClick={() => {props.setOpen(false)}}>
          <AccountCircleIcon className={classes.avatar2}/>
        </Link>
      }
    </div>
  );
}
