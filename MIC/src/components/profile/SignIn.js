import React, { useState } from 'react';
import firebase from "firebase/app";
import "firebase/auth";

import { Avatar, Button, CssBaseline, TextField, Grid, Typography, Container } from "@material-ui/core";
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { useHistory, Link } from "react-router-dom";

import fire from "../fire";
import useStyles from '../style';

export default function SignIn() {
  const history = useHistory();
  const classes = useStyles();
  const [email, setEmail] = useState(" ");
  const [password, setPassword] = useState(" ");
  const [error, setError] = useState(null);

  //gets current input email
  const onEmail = (event) => {
    setEmail(event.target.value);
    setError(null);
  }

  //gets current input password
  const onPass = (event) => {
    setPassword(event.target.value);
    setError(null);
  }

  //will handle sending info to firebase and changing to loggedin page
  const onSubmit = () => {
    fire.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
      .then(() => {
        return fire.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
          sessionStorage.setItem("email", email);
          sessionStorage.setItem("username", userCredential.user.displayName)
          history.push({
            pathname: "/",
            state: {
              alert: false,
              severity: null,
              message: null,
              duration: null
            }
          })
        })
        .catch((error) => {
          setError(error)
        })
      })
      .catch((error) => {
        console.error(error)
      })
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.sAvatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <form id="user" className={classes.form} noValidate>
          <Grid item xs={12}>
            {(error) ? 
              <TextField 
                error
                variant="outlined" 
                margin="normal" 
                required 
                fullWidth 
                id="email" 
                label="Email Address" 
                name="email" 
                autoComplete="email" 
                autoFocus 
                onChange={onEmail}
              /> : 
              <TextField  
                variant="outlined" 
                margin="normal" 
                required 
                fullWidth 
                id="email" 
                label="Email Address" 
                name="email" 
                autoComplete="email" 
                autoFocus 
                onChange={onEmail}
              />
            }
          </Grid>
          <Grid item xs={12}>
            {(error) ? 
              <TextField  
                error 
                variant="outlined" 
                margin="normal" 
                required 
                fullWidth 
                name="password" 
                label="Password" 
                type="password" 
                id="password" 
                autoComplete="current-password" 
                helperText="Inncorrect email address or password." 
                autoFocus 
                onChange={onPass}
              /> :
              <TextField  
                variant="outlined" 
                margin="normal" 
                required 
                fullWidth 
                name="password" 
                label="Password" 
                type="password" 
                id="password" 
                autoComplete="current-password" 
                autoFocus 
                onChange={onPass}
              />
            }
          </Grid>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={onSubmit}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <Link to="/login/forgot-password">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link to="/login/signup">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
}
