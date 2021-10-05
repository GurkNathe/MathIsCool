import React, { useState } from 'react';
import { CssBaseline, TextField, Grid, Typography, Container } from "@mui/material";
import { Paper, Form, Submit } from "../styledComps";

import { sendPasswordResetEmail } from "@firebase/auth";
import { auth } from "../fire";

import { useHistory } from "react-router-dom";

export default function ForgotPass() {
  const history = useHistory();
  const [email, setEmail] = useState(" ");
  const [error, setError] = useState(null);

  //gets current input email
  const onEmail = (event) => {
    setEmail(event.target.value);
    setError(null);
  }

  //will handle sending info to firebase and changing to loggedin page
  const onSubmit = () => {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        history.push({
          pathname: "/",
          state: {
            alert: true,
            severity: "info",
            message: "A password reset email was sent to your email. Please click on the link and reset your password.",
            duration: 5000
          }
        });
      })
      .catch((error) => {
        setError(error)
      })
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Paper>
        <Typography component="h1" variant="h5">
          Enter Email Address
        </Typography>
        <Form id="user" noValidate>
          <Grid item xs={12}>
            <TextField 
                error={error}
                variant="outlined" 
                margin="normal" 
                required 
                fullWidth 
                id="email" 
                label="Email Address" 
                name="email" 
                autoComplete="email" 
                helperText={error ? "Please enter a valid email address." : null}
                autoFocus 
                onChange={onEmail}
              />
          </Grid>
          <Submit
            fullWidth
            variant="contained"
            onClick={onSubmit}
          >
            Reset
          </Submit>
        </Form>
      </Paper>
    </Container>
  );
}
