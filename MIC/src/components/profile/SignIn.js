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
    width: '100%',
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

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

    //leaving this in here for when admins/editors are added to the site
    
    // fire.firestore().collection('users').onSnapshot((snapshot) => {
    //   const data = snapshot.docs.map((doc) => ({
    //     id: doc.id,
    //     ...doc.data(),
    //   }));
    //   data.forEach(user => {
    //     if(user.email == email && user.password == password){
    //       localStorage.setItem("id", user.id);
    //       history.push("/home");
    //     }
    //   })
    //   setEmail(null);
    //   setPassword(null);
    //   return;
    // })

    fire.auth().signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        localStorage.setItem("email", email);
        localStorage.setItem("username", userCredential.user.displayName)
        history.push("/")
        window.location.reload()
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        setError(error)
        console.log(errorCode);
        console.log(errorMessage);
      })
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
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
              <Link href="/login/forgot-password" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link href="/login/signup" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
}
