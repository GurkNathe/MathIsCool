import React from "react";
import { makeStyles, CssBaseline, Button, Avatar, Container, Typography } from '@material-ui/core';

import SignIn from "./SignIn";
import useStyles from "../style";

import fire from "../fire";

export default function ProfilePage () {
  const classes = useStyles();

  const username = sessionStorage.getItem("username")
  const email = sessionStorage.getItem("email")

  return(
    <Container component="main" maxWidth="xs">
      <CssBaseline/>
      <div className={classes.paper}>
        { username !== null && username !== undefined ?
          <Avatar className={classes.pAvatar}>
            {username.match(/(\b\S)?/g).join("").toUpperCase()}
          </Avatar>:
          <SignIn/>
        }
        { username !== null && username !== undefined ? 
          <>
            <Typography component="h1" variant="h5">
              {username}
            </Typography>
            <Typography component="h1" variant="h5">
              {email}
            </Typography>
            <Button onClick={() => {
                      fire.auth().signOut()
                        .then((user) => {
                            window.location.reload();
                        })
                        .catch((error) => {
                            console.log("An error occured ", error)
                        });
                      sessionStorage.removeItem("username")
                      sessionStorage.removeItem("email")
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
