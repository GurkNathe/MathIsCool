import React, { useState } from 'react';

import { Avatar, Button, CssBaseline, TextField, Grid, Typography, Container } from "@material-ui/core";
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { useHistory, Link } from "react-router-dom";

import fire from "../fire";
import useStyles from "../style";

export default function SignUp() {
  const history = useHistory();
  const classes = useStyles();
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
      fire.auth().createUserWithEmailAndPassword(up.email, up.password)
        .then(() => {
          fire.auth().currentUser.sendEmailVerification()
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
      
      //Adds person's username
      const unsub = fire.auth().onAuthStateChanged((user) => {
        if(user){
          user.updateProfile({
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
      <div className={classes.paper}>
        <Avatar className={classes.sAvatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <form className={classes.form} noValidate>
          <Grid container spacing={2}>

            <Grid item xs={12}>
              {(up.error) ? 
                <TextField
                  error
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
                /> :
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  name="username"
                  autoFocus
                  onChange={(event) => onChange(event, "username")}
                />
              }
            </Grid>
            
            <Grid item xs={12}>
              {(up.error) ? 
                <TextField
                  error
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
                /> :
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  onChange={(event) => onChange(event, "email")}
                />
              }
            </Grid>

            <Grid item xs={12}>
              {(up.error) ? 
                <TextField
                  error
                  variant="outlined"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  onChange={(event) => onChange(event, "password")}
                /> :
                <TextField
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
              }
            </Grid>

            <Grid item xs={12}>
              {(up.error) ? 
                <TextField
                  error
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
                /> : 
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  name="confirm-pass"
                  label="Confirm Password"
                  type="password"
                  id="confirm-pass"
                  onChange={(event) => onChange(event, "confirm")}
                />
              }
            </Grid>
            
          </Grid>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={onSubmit}
          >
            Sign Up
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link to="/login">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
}