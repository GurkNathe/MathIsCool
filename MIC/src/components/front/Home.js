import React, { useState, useEffect } from "react";

import fire from "../fire";

import math from "../../assets/math1.jpg";
import lake from "../../assets/moseslake.jpg";
import train from "../../assets/mtrainier.jpg";
import wp from "../../assets/WP_20140307_009.jpg";
import donate from "../../assets/btn_donate_LG.webp";

function Home() {
  const [news, setNews] = useState("");
  
  //holding names of articles
  var test = []

  //getting articles from database
  
  // useEffect(() => {
  //   fire.firestore().collection('web').doc('news').get()
  //     .then((doc) => {
  //       setNews(doc.data().news.records);
  //     })
  //     .catch((error) => {
  //       console.log(error)
  //     })
  //   }, [])

  useEffect(() => {
    setNews(JSON.parse(localStorage.getItem('news')).news.records);
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
    <div style={{display: "flex", flexDirection:"row"}}>
      <div style={{margin:"2%", boxShadow:"0 3px 1px -2px rgb(0 0 0 / 20%), 0 2px 2px 0 rgb(0 0 0 / 14%), 0 1px 5px 0 rgb(0 0 0 / 12%)", width:"80%"}}>
        <div style={{marginLeft:"1%", marginRight:"1%"}}>
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
      <div style={{marginLeft:"2%", marginRight:"2%", marginTop:"2%", marginBottom:"2%", width:"20%", textAlign:"center"}}>
        <a href="https://www.paypal.com/us/home" target="_blank" rel="noreferrer"><img src={donate} alt="PayPal" style={{width:"50%", borderRadius:"5px", marginBottom:"1%"}}/></a>
        <img src={math} alt="math" style={{width:"100%", borderRadius:"5px", marginBottom:"1%"}}/>
        <img src={lake} alt="lake" style={{width:"100%", borderRadius:"5px", marginBottom:"1%"}}/>
        <img src={train} alt="train" style={{width:"100%", borderRadius:"5px", marginBottom:"1%"}}/>
        <img src={wp} alt="wp" style={{width:"100%", borderRadius:"5px", marginBottom:"1%"}}/>
      </div>
    </div>
  );
}

export default Home;
