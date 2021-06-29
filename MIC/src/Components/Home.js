import React from "react";

import math from "../assets/math1.jpg";
import lake from "../assets/moseslake.jpg";
import train from "../assets/mtrainier.jpg";
import wp from "../assets/WP_20140307_009.jpg"
import donate from "../assets/btn_donate_LG.webp"

function Home() {
  return (
    <div style={{display: "flex", flexDirection:"row"}}>
      <div style={{marginLeft:"2%", marginTop:"2%", marginBottom:"2%", boxShadow:"0 3px 1px -2px rgb(0 0 0 / 20%), 0 2px 2px 0 rgb(0 0 0 / 14%), 0 1px 5px 0 rgb(0 0 0 / 12%)"}}>
        <div style={{marginLeft:"1%", marginTop:"1%", marginRight:"2%"}}>
          <h1 style={{fontStyle:"italic"}}>What's Happening?</h1>
          <p>
            <b>2021 Masters Registration:</b> Masters Registration for 
            grades 4 through 8 is Open. The process to register 
            is different so there is a short 
            <a href="http://www.academicsarecool.com/assets/docs/MastersRegistration.mp4" target="_blank"> video </a> 
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
            Send all payments and correspondence to:<br/>
            Academics Are Cool<br/>
            P. O. Box 2214<br/>
            Richland, WA 99352
          </p>
          <p>
            <b>2019 Divisions:</b> The divisions are assigned according to how 
            the schools have done in past competitions 
            (<a href="http://www.academicsarecool.com/assets/docs/division_algorithm.pdf" target="_blank">see method</a>).
            New schools will be assigned to a division by the regional director. 
            The 2019-20 assignments can be found at&nbsp;
            <a href="http://www.academicsarecool.com/assets/docs/divisions.pdf" target="_blank">2019-20 Divisions</a>
            . The 2020-21 Divisions will be posted by the end of the month.
          </p>
          <p>
            <b>Fees:</b> The registration fee for each team is $40 per team for 
            Online contests. The registration fee for an individual $12 each 
            for Online. A school that registers at least one team for a 
            Championships contest can also register two alternate students 
            for no fee. See the Fees page for more information.
          </p>
        </div>
      </div>
      <div style={{marginLeft:"2%", marginRight:"2%", marginTop:"2%", marginBottom:"2%", width:"30%", textAlign:"center"}}>
        <a href="https://www.paypal.com/us/home" target="_blank"><img src={donate} style={{width:"50%", borderRadius:"5px", marginBottom:"1%"}}/></a>
        <img src={math} style={{width:"100%", borderRadius:"5px", marginBottom:"1%"}}/>
        <img src={lake} style={{width:"100%", borderRadius:"5px", marginBottom:"1%"}}/>
        <img src={train} style={{width:"100%", borderRadius:"5px", marginBottom:"1%"}}/>
        <img src={wp} style={{width:"100%", borderRadius:"5px", marginBottom:"1%"}}/>
      </div>
    </div>
  );
}

export default Home;
