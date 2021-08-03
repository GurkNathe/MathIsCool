import React, { useState, useContext } from 'react';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

import fire from "../fire";
import { useHistory } from "react-router-dom";

//Taken from material-ui templates page

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://academicsarecool.com" target="/">
        Math Is Cool
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

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
  const [up, setUp] = useState({email: " ", password: " ", confirm: " ", error: null});

  const onChange = (event, type) => {
    switch (type) {
      case "email":
        setUp((prevState) => ({
          ...prevState,
          email: event.target.value,
        }));
        console.log(up);
        break;
      case "password":
        setUp((prevState) => ({
          ...prevState,
          password: event.target.value,
        }));
        console.log(up);
        break;
      case "confirm":
        setUp((prevState) => ({
          ...prevState,
          confirm: event.target.value,
        }));
        console.log(up);
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
  const onSubmit = () => {
    //const user = {email: email, password: password, confirm: confirm};

    if(up.password !== up.confirm){
      setError("NoMatch");
      return;
    } else if(up.password.length < 8){
      setError("TooSmall");
      return;
    } else if(!up.email){
      setError(true);
      return;
    } else if (!up.password){
      setError(true);
      return;
    }

    // fire.firestore().collection('users').add({
    //   auth:true,
    //   email:email,
    //   password:password,
    //   admin:false
    // }).then((ref) => {
    //   console.log(ref);
    //   localStorage.setItem("authorized", true);
    //   actions({type:'setState', payload:{...state, authorized: true }});
    //   history.push("/home");
    // }).catch((e) => {
    //   setPassword(null);
    //   setConfirm(null);
    //   console.log(e);
    //   return;
    // })


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
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  helperText={up.error == "Email" ? "Email already registered." : null}
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
                  helperText={up.error == "NoMatch" ? "Passwords did not match." : "Password needs to be more than 8 characters."}
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
            
            <Grid item xs={12}>
              <FormControlLabel
                control={<Checkbox value="allowExtraEmails" color="primary" />}
                label="I want to receive inspiration, marketing promotions and updates via email."
              />
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
          <Grid container justify="flex-end">
            <Grid item>
              <Link href="/login" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={5}>
        <Copyright />
      </Box>
    </Container>
  );
}