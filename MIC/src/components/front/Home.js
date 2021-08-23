import React, { useState, useEffect } from "react";

import math from "../../assets/math1.jpg";
import lake from "../../assets/moseslake.jpg";
import train from "../../assets/mtrainier.jpg";
import wp from "../../assets/WP_20140307_009.jpg";
import donate from "../../assets/btn_donate_LG.webp";
import getWeb from "./getWeb";
import getPage from "./getPage";
import useStyles from "../style";

function Home() {
  const [news, setNews] = useState("");
  const classes = useStyles();
  
  //holding names of articles
  var test = []

  const title = "news";

  useEffect(() => {
    getWeb(title);
    setNews(getPage(title, "records"))
  }, [])

  //getting article names
  for(const i in news){
    test.push(i);
  }

  test.sort() //sorting names

  //getting article data in order
  for(let i = 0; i < test.length; i++){
    test[i] = news[test[i]];
  }

  return(
    <div className={classes.root}>
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

export default Home;
