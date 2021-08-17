import React from "react";
import { makeStyles, CssBaseline, Button, Avatar, Container, Typography } from '@material-ui/core';

import SignIn from "../front/SignIn";

import fire from "../fire";

const useStyles = makeStyles((theme) => ({
  avatar: {
    '&:hover':{
      backgroundColor: "grey",
      cursor: "pointer",
    },
    margin: theme.spacing(1),
    width:"100px",
    height:"100px",
    
  },
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar2: {
    color:"grey",
    width:"100px",
    height:"100px",
    margin: theme.spacing(1),
    '&:hover':{
       color:"#3f51b5",
    }
 }
}))

function ProfilePage () {
  const classes = useStyles();

  const username = localStorage.getItem("username")

  return(
    <Container component="main" maxWidth="xs">
      <CssBaseline/>
      <div className={classes.paper}>
        { username ?
          <Avatar className={classes.avatar}>
            {username.match(/(\b\S)?/g).join("").toUpperCase()}
          </Avatar>:
          <SignIn/>
        }
        { username ? 
          <>
            <Typography component="h1" variant="h5">
              {username}
            </Typography>
            <Button className={classes.button} onClick={() => {
                      fire.auth().signOut()
                        .then((user) => {
                            window.location.reload();
                        })
                        .catch((error) => {
                            console.log("An error occured ", error)
                        });
                      localStorage.removeItem("username")
                      localStorage.removeItem("email")
                  }
                }
            >
                Logout
            </Button> 
          </>
          :
          null
        }
      </div>
    </Container>
  );
}

export default ProfilePage;