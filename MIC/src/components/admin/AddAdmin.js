import React, { useState } from 'react';
import { Button, TextField, Grid, Typography, Container, makeStyles } from "@material-ui/core";

import fire from "../fire";

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

//Adds new admin to firestore
async function addAdmin(uid){
  const admins = fire.firestore().collection("roles").doc("admin");
  const admin = await admins.get().then((doc) => {
    var uids = doc.data().admins;
    if(!uids.includes(uid)){
      fire.firestore().collection("roles").doc("admin").update({
        admins: [
          ...uids,
          uid
        ]
      })
    }
  })
  
  return admin;
}

export default function AddAdmin() {
  const classes = useStyles();
  const [uid, setUid] = useState("");
  const [error, setError] = useState(false);
  
  const onSubmit = () => {
    var actual = true;
    if(uid === "" || uid === null || uid === undefined){
      setError(true);
      actual = false;
    }

    if(actual){
      addAdmin(uid);
    }
  }

  //gets current input uid
  const onEmail = (event) => {
    setUid(event.target.value);
    setError(false);
  }

  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          Enter UID of User
        </Typography>
        <form id="user" className={classes.form} noValidate>
          <Grid item xs={12}>
            <TextField  
              error={error}
              variant="outlined" 
              margin="normal" 
              required 
              fullWidth
              label="UID" 
              helperText={error ? "Please enter a valid uid.": null}
              autoFocus 
              onChange={onEmail}
            />
          </Grid>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={onSubmit}
          >
            Add Admin
          </Button>
        </form>
      </div>
    </Container>
  );
}
