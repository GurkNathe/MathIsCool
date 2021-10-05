import React from "react";
import { CssBaseline, Button, Container, Typography } from '@mui/material';
import { Paper, ProfileAvatar } from "../styledComps";

import SignIn from "./SignIn";

import { auth } from "../fire";
import { signOut } from "@firebase/auth";

export default function ProfilePage () {
  const username = sessionStorage.getItem("username")
  const email = sessionStorage.getItem("email")

  return(
    <Container component="main" maxWidth="xs">
      <CssBaseline/>
      <Paper>
        { username !== null && username !== undefined ?
          <ProfileAvatar size="100px">
            {username.match(/(\b\S)?/g).join("").toUpperCase()}
          </ProfileAvatar>:
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
                      signOut(auth)
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
      </Paper>
    </Container>
  );
}
