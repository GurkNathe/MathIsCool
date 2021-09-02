import React, { useState } from 'react';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

import fire from "../fire";
import { useHistory } from "react-router-dom";

//Taken from material-ui templates page

//TODO: change to style.js
const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

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
        .then((userCreds) => {
          console.log(userCreds)
          fire.auth().currentUser.sendEmailVerification()
            .then(() => {
              alert("An email was sent to your email address. Please navigate to it and click the verification link.")
            })
          history.push("/");
        })
        .catch((error) => {
          console.log(error);
          if(up.error === null)
            setError(error.code)
        });
      
      //Adds person's username
      fire.auth().onAuthStateChanged((user) => {
        if(user){
          user.updateProfile({
            displayName: up.username
          }).then(() => {
          }).catch((error) => {
            setError(error.code)
          });
        }
      });

      //setting the firestore data for a user
      setTimeout(() => {
        let uid = fire.auth().currentUser.uid;
        if(uid){
          fire.firestore().collection('users')
            .add({
              admin: false,
              director: false,
              editor: false,
              email: up.email,
              displayName: up.username,
              userId: uid
            })
            .then((ref) => {
            })
            .catch((e) => {
              console.log(e);
            });
        }
      }, 2000)
    }
  };

  return (
    <Container component="main" maxWidth="xs" style={{marginBottom:"40px"}}>
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
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
                  onChange={(event) => onChange(event, "username")}
                /> :
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  name="username"
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
              <Link href="/login" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
}