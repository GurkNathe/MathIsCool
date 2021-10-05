import React, { useState } from 'react';
import { CssBaseline, TextField, Grid, Typography, Container } from "@mui/material";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useHistory, Link } from "react-router-dom";
import { Form, LockAvatar, Paper, Submit } from '../styledComps';
import { createUserWithEmailAndPassword, sendEmailVerification, onAuthStateChanged, updateProfile } from "@firebase/auth";
import { auth } from "../fire";

//! Bug that allows you to change username, something wrong with onSubmit
export default function SignUp() {
  const history = useHistory();
  const [up, setUp] = useState({email: " ", username: " ", password: " ", confirm: " ", error: null});

  const onChange = (event, type) => {
    switch (type) {
      case "email":
        setUp((prevState) => ({
          ...prevState,
          email: event.target.value,
          error: null,
        }));
        break;
      case "password":
        setUp((prevState) => ({
          ...prevState,
          password: event.target.value,
          error: null,
        }));
        break;
      case "confirm":
        setUp((prevState) => ({
          ...prevState,
          confirm: event.target.value,
          error: null,
        }));
        break;
      case "username":
        setUp((prevState) => ({
          ...prevState,
          username: event.target.value,
          error: null,
        }))
        break;
      default:
        console.log(up);
    }
  }

  const setError = (error) => {
    setUp((prevState) => ({
      ...prevState,
      error: error
    }))
  }

  //will handle sending info to firebase and changing to loggedin page
  const onSubmit = (event) => {

    //Checks if password and confirmation password are the same.
    if(up.password !== up.confirm){
      setError(null);
      setError("NoMatch");
      return;
    } else if(up.username === " " || up.username === ""){
      setError(null);
      setError("NoUser");
      return;
    } else {
      //Sign's a person up using an email and password, and send email confirmation.
      createUserWithEmailAndPassword(auth, up.email, up.password)
        .then(() => {
          sendEmailVerification(auth.currentUser);
          sessionStorage.setItem("email", up.email);
          sessionStorage.setItem("username", up.username)
          history.push({
            pathname: "/",
            state: {
              alert: true,
              severity: "info",
              message: "An email was sent to your email address. Please navigate to it and click the verification link.",
              duration: 5000
            }
          });
        })
        .catch((error) => {
          if(up.error === null)
            setError(error.code)
        });
      
      //! need to enclose so no unwanted display name changes happen
      //Adds person's username
      const unsub = onAuthStateChanged(auth, (user) => {
        if(user){
          updateProfile(user, {
            displayName: up.username
          }).then(() => {
          }).catch((error) => {
            setError(error.code)
          });
        }
      });

      return unsub;
    }
  };

  return (
    <Container component="main" maxWidth="xs" style={{marginBottom:"40px"}}>
      <CssBaseline />
      <Paper>
        <LockAvatar>
          <LockOutlinedIcon />
        </LockAvatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <Form noValidate>
          <Grid container spacing={2}>

            <Grid item xs={12}>
              <TextField
                error={up.error}
                variant="outlined"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                helperText={up.error === "NoUser" ? 
                              "Please enter a valid username." :
                              null
                            }
                autoFocus
                onChange={(event) => onChange(event, "username")}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                error={up.error}
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                helperText={up.error === "auth/invalid-email" ? 
                              "Please enter a valid email address." : 
                              up.error === "auth/email-already-in-use" ? 
                                "Email already taken." : 
                                null
                            }
                onChange={(event) => onChange(event, "email")}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                error={up.error}
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                onChange={(event) => onChange(event, "password")}
              />
            </Grid>

            <Grid item xs={12}> 
              <TextField
                error={up.error}
                variant="outlined"
                required
                fullWidth
                name="confirm-pass"
                label="Confirm Password"
                type="password"
                id="confirm-pass"
                helperText={up.error === "NoMatch" ? 
                              "Passwords did not match." : 
                              up.error === "auth/weak-password" ? 
                                "Password should be at least 6 characters" : 
                                null
                            }
                onChange={(event) => onChange(event, "confirm")}
              />
            </Grid>
            
          </Grid>
          <Submit
            fullWidth
            variant="contained"
            onClick={onSubmit}
          >
            Sign Up
          </Submit>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link to="/login">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </Form>
      </Paper>
    </Container>
  );
}