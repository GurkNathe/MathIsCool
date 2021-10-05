import React, { useState, useEffect } from "react";
import { Snackbar, Alert } from "@mui/material";
import { LayerOne, LayerTwo, LayerThree, ImageSet, Image } from "../styledComps.js";

import { math, lake, train, wp, donate } from "../assets.js";

import getWeb from "./getWeb";
import getPage from "./getPage";

export default function Home(props) {
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
    <LayerOne>
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
      <LayerTwo>
        <LayerThree>
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
        </LayerThree>
      </LayerTwo>
      <ImageSet>
        <a href="https://www.paypal.com/us/home" target="_blank" rel="noreferrer"><img src={donate} alt="PayPal" style={{width:"50%", borderRadius:"5px", marginBottom:"1%"}}/></a>
        <Image src={math} alt="math"/>
        <Image src={lake} alt="lake"/>
        <Image src={train} alt="train"/>
        <Image src={wp} alt="wp"/>
      </ImageSet>
    </LayerOne>
  );
}
