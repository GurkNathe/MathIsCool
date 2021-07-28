import React, { useState, useRef, useEffect } from "react";
import { AppBar, Toolbar, Button, Typography, MenuItem, MenuList, Popper, Grow, ClickAwayListener, makeStyles } from "@material-ui/core";

import { Link } from "react-router-dom";

import image from "../../assets/logo.5a82c15d88ad2d074447.png"

const useStyles = makeStyles((theme) => ({
  button:{
    position:"relative",
    overflow:"hidden",
    display:"flex",
    flexDirection:"column",
    justifyContent:"center",
    color:"inherit",
    borderRadius:"5px",
    textDecoration:"none",
    textTransform:"uppercase",
    background:"transparent",
    border:"currentColor",
    fontSize:"15px",
    padding:"5px",
    '&:hover':{
      backgroundColor:"#2a3576",
      transition:"background-color 250ms \
                  cubic-bezier(0.4, 0, 0.2, 1) 0ms,box-shadow \
                  250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,border \
                  250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
    }
  }
}));

function HeadBar() {
  const classes = useStyles();
  const [about, setAbout] = useState(false);
  const aboutRef = useRef(null);
  const [info, setInfo] = useState(false);
  const infoRef = useRef(null);
  const [resource, setResource] = useState(false);
  const resourceRef = useRef(null);


  //Event handling for the About Us tab
  const aboutClick = () => {
    setAbout((prevAbout) => !prevAbout);
  };

  const aboutClose = (event) => {
    if (aboutRef.current && aboutRef.current.contains(event.target)) {
      return;
    }

    setAbout(false);
  };

  const prevAbout = useRef(about);
  useEffect(() => {
    if (prevAbout.current === true && about === false) {
      aboutRef.current.focus();
    }

    prevAbout.current = about;
  }, [about]);


  //Event handling for the Information tab
  const infoClick = () => {
    setInfo((prevInfo) => !prevInfo);
  };

  const infoClose = (event) => {
    if (infoRef.current && infoRef.current.contains(event.target)) {
      return;
    }

    setInfo(false);
  };

  const prevInfo = useRef(info);
  useEffect(() => {
    if (prevInfo.current === true && info === false) {
      infoRef.current.focus();
    }

    prevInfo.current = info;
  }, [info]);

  
  //Event handling for the Resources tab
  const resourceClick = (event) => {
    setResource((prevResource) => !prevResource);
  };

  const resourceClose = (event) => {
    if (resourceRef.current && resourceRef.current.contains(event.target)) {
      return;
    }

    setResource(false);
  };

  const prevResource = useRef(info);
  useEffect(() => {
    if (prevResource.current === true && resource === false) {
      resourceRef.current.focus();
    }

    prevResource.current = resource;
  }, [resource]);

  //Do we want to make navigation bar sticky or fixed?
  return (
    <AppBar position="static" style={{display:"flex", background:`url(${image}) right center/contain no-repeat #3f51b5`}}>
      
      <Typography 
        style={{fontFamily:"cursive", 
                fontSize:"40px", 
                fontStyle:"italic", 
                marginLeft:"20px", 
                marginTop:"10px"}}
      >
              Math Is Cool
      </Typography>

      <Toolbar>
        <div style={{display:"flex", flexDisplay:"row", justifyContent:"space-around",}}>
          <Button className={classes.button} href="/">
            Home
          </Button>
        
          <div style={{display:"flex", flexDisplay:"row", justifyContent:"center",}}>
            <Button 
              ref={aboutRef}
              aria-controls={about ? 'menu-list-grow' : undefined}
              aria-haspopup="true"
              onClick={aboutClick}
              className={classes.button}
            >
              About Us
            </Button>
            <Popper open={about} anchorEl={aboutRef.current} role={undefined} transition disablePortal>
                    {({ TransitionProps, placement }) => (
                      <Grow
                        {...TransitionProps}
                        style={{transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom'}}
                      >
                        <ClickAwayListener onClickAway={aboutClose}>
                          <MenuList 
                            style={{backgroundColor:"white", 
                                    borderRadius:"5px", 
                                    boxShadow:"0 3px 1px -2px rgb(0 0 0 / 20%), \
                                              0 2px 2px 0 rgb(0 0 0 / 14%), \
                                              0 1px 5px 0 rgb(0 0 0 / 12%)"}} 
                            autoFocusItem={about}
                          >
                            <MenuItem style={{color:"black"}} component={Link} to="/about/history" onClick={aboutClose}>History</MenuItem>
                            <MenuItem style={{color:"black"}} component={Link} to="/about/contacts" onClick={aboutClose}>Contacts</MenuItem>
                            <MenuItem style={{color:"black"}} component={Link} to="/about/locations" onClick={aboutClose}>Locations</MenuItem>
                          </MenuList>
                        </ClickAwayListener>
                      </Grow>
                    )}
            </Popper>
          </div>

          <div style={{display:"flex", flexDisplay:"row", justifyContent:"center",}}>
            <Button 
              ref={infoRef}
              aria-controls={info ? 'menu-list-grow' : undefined}
              aria-haspopup="true"
              onClick={infoClick}
              className={classes.button}
            >
              Information
            </Button>
            <Popper open={info} anchorEl={infoRef.current} role={undefined} transition disablePortal>
                    {({ TransitionProps, placement }) => (
                      <Grow
                        {...TransitionProps}
                        style={{transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom'}}
                      >
                        <ClickAwayListener onClickAway={infoClose}>
                          <MenuList 
                            style={{backgroundColor:"white", 
                                    borderRadius:"5px", 
                                    boxShadow:"0 3px 1px -2px rgb(0 0 0 / 20%), \
                                              0 2px 2px 0 rgb(0 0 0 / 14%), \
                                              0 1px 5px 0 rgb(0 0 0 / 12%)"}} 
                            autoFocusItem={info} 
                            id="fade-menu"
                          >
                            <MenuItem style={{color:"black"}} component={Link} to="/information/rules" onClick={infoClose}>Rules</MenuItem>
                            <MenuItem style={{color:"black"}} component={Link} to="/information/fees" onClick={infoClose}>Fees</MenuItem>
                            <MenuItem style={{color:"black"}} component={Link} to="/information/faq" onClick={infoClose}>FAQ</MenuItem>
                          </MenuList>
                        </ClickAwayListener>
                      </Grow>
                    )}
            </Popper>
          </div>

          <div style={{display:"flex", flexDisplay:"row", justifyContent:"center",}}>
            <Button 
              ref={resourceRef}
              aria-controls={resource ? 'menu-list-grow' : undefined}
              aria-haspopup="true"
              onClick={resourceClick}
              className={classes.button}
            >
              Resources
            </Button>
            <Popper open={resource} anchorEl={resourceRef.current} role={undefined} transition disablePortal>
                    {({ TransitionProps, placement }) => (
                      <Grow
                        {...TransitionProps}
                        style={{transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom'}}
                      >
                        <ClickAwayListener onClickAway={resourceClose}>
                          <MenuList 
                            style={{backgroundColor:"white", 
                                    borderRadius:"5px", 
                                    boxShadow:"0 3px 1px -2px rgb(0 0 0 / 20%), \
                                              0 2px 2px 0 rgb(0 0 0 / 14%), \
                                              0 1px 5px 0 rgb(0 0 0 / 12%)"}} 
                            autoFocusItem={resource}
                          >
                            <MenuItem style={{color:"black"}} component={Link} to="/resources/rules" onClick={resourceClose}>Rules</MenuItem>
                            <MenuItem style={{color:"black"}} component={Link} to="/resources/past-tests" onClick={resourceClose}>Past Tests</MenuItem>
                          </MenuList>
                        </ClickAwayListener>
                      </Grow>
                    )}
            </Popper>
          </div>

          <Button className={classes.button} href="/competitions">Competitions</Button>
          {!localStorage.getItem("authorized") ? <Button className={classes.button} href="/login">Login</Button> :
                                                 <Button className={classes.button} href="/home">HomePage</Button>}
          {localStorage.getItem("authorized") ? <Button className={classes.button} href="/login" onClick={() => {localStorage.removeItem("authorized")}}>Logout</Button> : null}
        </div>
      </Toolbar>
    </AppBar>
  );
}

export default HeadBar;
