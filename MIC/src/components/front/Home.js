import React, { useState, useEffect } from "react";

import fire from "../fire";

import math from "../../assets/math1.jpg";
import lake from "../../assets/moseslake.jpg";
import train from "../../assets/mtrainier.jpg";
import wp from "../../assets/WP_20140307_009.jpg"
import donate from "../../assets/btn_donate_LG.webp"

function Home() {
  const [news, setNews] = useState("");
  
  //holding names of documents
  var test = []

  useEffect(() => {
    fire.firestore().collection('web').doc('news').get()
      .then((doc) => {
        setNews(doc.data().news.records);
      })
      .catch((error) => {
        console.log(error)
      })
    }, [])

  for(const i in news){
    test.push(i);
  }
  test.sort()
  for(let i = 0; i < test.length; i++){
    test[i] = news[test[i]];
  }
  // console.log(test)

  /**
   * Need to find a way to import info from firestore.
   * Currently, if I try to do it like I have above, 
   * console.log will run in an infinite loop, 
   * eventually crashing the page.
   */

   {/*<p>
   <b>2021 Masters Registration:</b> Masters Registration for 
   grades 4 through 8 is Open. The process to register 
   is different so there is a short
   <a href="http://www.academicsarecool.com/assets/docs/MastersRegistration.mp4" target="_blank" rel="noreferrer">video</a> 
   to describe it.
 </p>
 <p>
   <b>Online Contests for 2020-2021:</b> The contests for 2020-2021 
   are currently scheduled to be held online. The High School 
   contest will be December 2nd, starting at 3:00pm. There will 
   not be a Masters HS contest. See the Competition pages for other dates. 
   See the notes below for sample online information and fees.
 </p>
 <p>
   <b>We accept PayPal:</b> In addition to checks, Academics are Cool 
   now accepts donations and registrtion payments through PayPal. 
   See the Donate button in the right margin. There is a 'Pay Now' 
   button at the bottom of registration invoices.
 </p>
 <p>
   <b>Check the Mailing Address:</b> Please note the mailing address. 
   <b>Send all</b> payments and correspondence to:<br/>
   Academics Are Cool<br/>
   P. O. Box 2214<br/>
   Richland, WA 99352
 </p>
 <p>
   <b>2019 Divisions:</b> The divisions are assigned according to how 
   the schools have done in past competitions 
   (<a href="http://www.academicsarecool.com/assets/docs/division_algorithm.pdf" target="_blank" rel="noreferrer">see method</a>).
   New schools will be assigned to a division by the regional director. 
   The 2019-20 assignments can be found at&nbsp;
   <a href="http://www.academicsarecool.com/assets/docs/divisions.pdf" target="_blank" rel="noreferrer">2019-20 Divisions</a>
   . The 2020-21 Divisions will be posted by the end of the month.
 </p>
 <p>
   <b>Fees:</b> The registration fee for each team is $40 per team for 
   Online contests. The registration fee for an individual $12 each 
   for Online. A school that registers at least one team for a 
   Championships contest can also register two alternate students 
   for no fee. See the Fees page for more information.
 </p>*/}

  return(
    <div style={{display: "flex", flexDirection:"row"}}>
      <div style={{margin:"2%", boxShadow:"0 3px 1px -2px rgb(0 0 0 / 20%), 0 2px 2px 0 rgb(0 0 0 / 14%), 0 1px 5px 0 rgb(0 0 0 / 12%)", width:"80%"}}>
        <div style={{marginLeft:"1%", marginRight:"1%"}}>
          <h1 style={{fontStyle:"italic"}}>What's Happening</h1>
          <>
            {test.map((doc) => {
              return(
                <p>
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
