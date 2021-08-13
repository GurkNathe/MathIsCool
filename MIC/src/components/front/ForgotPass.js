import React, { useState } from 'react';
import { Button, CssBaseline, TextField, Grid, Typography, Container, makeStyles } from "@material-ui/core";

import fire from "../fire";
import { useHistory } from "react-router-dom";

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

export default function ForgotPass() {
  const history = useHistory();
  const classes = useStyles();
  const [email, setEmail] = useState(" ");
  const [error, setError] = useState(null);

  //gets current input email
  const onEmail = (event) => {
    setEmail(event.target.value);
    setError(null);
  }

  //will handle sending info to firebase and changing to loggedin page
  const onSubmit = () => {
    fire.auth().sendPasswordResetEmail(email)
      .then((result) => {
        alert("A password reset email was sent to your email. Please click on the link and reset your password.")
        history.push("/profile")
      })
      .catch((error) => {
        setError(error)
      })
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          Enter Email Address
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
                helperText="Please enter a valid email address."
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
          <Button
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={onSubmit}
          >
            Reset
          </Button>
        </form>
      </div>
    </Container>
  );
}
