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
import Context from "../../context/loginContext";

//Taken from material-ui templates page

//Don't know if the copyright is necessary
// function Copyright() {
//   return (
//     <Typography variant="body2" color="textSecondary" align="center">
//       {'Copyright © '}
//       <Link color="inherit" href="https://academicsarecool.com" target="/">
//         Math Is Cool
//       </Link>{' '}
//       {new Date().getFullYear()}
//       {'.'}
//     </Typography>
//   );
// }

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

  const {state, actions} = useContext(Context);

  //gets current input email
  const onEmail = (event) => {
    setEmail(event.target.value);
  }

  //gets current input password
  const onPass = (event) => {
    setPassword(event.target.value);
  }

  //will handle sending info to firebase and changing to loggedin page
  const onSubmit = () => {

    fire.firestore().collection('users').onSnapshot((snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      data.forEach(user => {
        if(user.email == email && user.password == password){
          localStorage.setItem("authorized", true);
          actions({type:'setState', payload:{...state, authorized: true }});
          history.push("/home");
          return;
        }
      })
      setEmail(null);
      setPassword(null);
      return;
    })

    //add a loading wheel here or while the sign in is being checked?
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
            {(email) ? 
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
              /> : 
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
              />
            }
          </Grid>
          <Grid item xs={12}>
            {(password) ? 
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
              /> :
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
              <Link href="#" variant="body2">
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

//<Box mt={8}>
//  <Copyright />
//</Box>