import React, { useState, useEffect } from "react";
import { Alert } from "@material-ui/lab";
import { Snackbar } from "@material-ui/core";

import { math, lake, train, wp, donate } from "../assets.js";

import getWeb from "./getWeb";
import getPage from "./getPage";
import useStyles from "../style";

export default function Home(props) {
  const classes = useStyles();
  const title = "news";
  const [news, setNews] = useState(getPage(title, "records"));
  const [open, setOpen] = useState(props.location.state ? props.location.state.alert : false);
  
  //holding names of articles
  var test = []

  useEffect(() => {
    getWeb(title).then((result) => {
      result !== undefined ? setNews(result.records) : setNews(news);
    })
  }, [news])

  //getting article names
  for(const i in news){
    test.push(i);
  }

  test.sort() //sorting names

  //getting article data in order
  for(let i = 0; i < test.length; i++){
    test[i] = news[test[i]];
  }

  const handleClose = (event, reason) => {
    if (reason === 'clickaway')
      return;
    setOpen(false);
  }

  return(
    <div className={classes.root}>
      { props.location.state ?
        <Snackbar 
          open={open} 
          onClose={handleClose} 
          autoHideDuration={props.location.state.duration} 
          anchorOrigin={{vertical:'top', horizontal:'center'}}
        >
          <Alert severity={props.location.state.severity} variant="filled">
            {props.location.state.message}
          </Alert>
        </Snackbar>:
        null
      }
      <div className={classes.second}>
        <div className={classes.inner}>
          <h1 style={{fontStyle:"italic"}}>What's Happening</h1>
          <>
            {test.map((doc) => {
              return(
                <p key={doc.title}>
                  <b>{doc.title}:</b>&nbsp;
                  <span dangerouslySetInnerHTML={{ __html: doc.article}}></span>
                </p>
              )
            })}
          </>
        </div>
      </div>
      <div className={classes.imgCol}>
        <a href="https://www.paypal.com/us/home" target="_blank" rel="noreferrer"><img src={donate} alt="PayPal" style={{width:"50%", borderRadius:"5px", marginBottom:"1%"}}/></a>
        <img src={math} alt="math" className={classes.imgSty}/>
        <img src={lake} alt="lake" className={classes.imgSty}/>
        <img src={train} alt="train" className={classes.imgSty}/>
        <img src={wp} alt="wp" className={classes.imgSty}/>
      </div>
    </div>
  );
}
