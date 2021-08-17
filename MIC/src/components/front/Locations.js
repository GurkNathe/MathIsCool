import React, { useState, useEffect } from "react";

// import fire from "../fire";

import map from "../../assets/MIC_Regions.png"

function Locations() {
  const [loc, setLoc] = useState("");
  
  //holding names of sites
  var locations = [];

  //getting sites from database
  // useEffect(() => {
  //   fire.firestore().collection('web').doc('sites').get()
  //     .then((doc) => {
  //       setLoc(doc.data().sites.records);
  //     })
  //     .catch((error) => {
  //       console.log(error)
  //     })
  //   }, [])

  useEffect(() => {
    setLoc(JSON.parse(localStorage.getItem('sites')).sites.records);
  }, [])
  
  //getting site names
  for(const i in loc){
    locations.push(loc[i].name);
  }

  //sorting site names
  locations.sort();

  //alphabetically ordering getting site names 
  for(const i in locations){
    for(const j in loc){
      if(locations[i] === loc[j].name)
        locations[i] = loc[j];
    }
  }

  return(
    <div style={{display: "flex", flexDirection:"row"}}>
      <div 
        style={{margin:"2%", 
                boxShadow:"0 3px 1px -2px rgb(0 0 0 / 20%), 0 2px 2px 0 rgb(0 0 0 / 14%), 0 1px 5px 0 rgb(0 0 0 / 12%)", 
                width:"100%",
                minHeight:"80vh", 
                maxHeight:"100%", 
                maxWidth:"100%"
                }}>
        <div style={{marginLeft:"1%", marginRight:"1%"}}>
          <h1 style={{fontStyle:"italic"}}>Locations</h1>
          <>
            <h3>WEST</h3>
            {locations.map((doc) => {
                return(
                  doc.region === "west" ?
                    <span>
                      <a href={doc.mapUrl}>{doc.name}</a> - 
                      {doc.street}, {doc.city}<br/>
                    </span>:
                    null
                );
              })
            }
            <h3>CENTRAL</h3>
            {locations.map((doc) => {
                return(
                  doc.region === "central" ?
                    <span>
                      <a href={doc.mapUrl}>{doc.name}</a> - 
                      {doc.street}, {doc.city}<br/>
                    </span>:
                    null
                );
              })
            }
            <h3>EAST</h3>
            {locations.map((doc) => {
                return(
                  doc.region === "east" ?
                    <span>
                      <a href={doc.mapUrl}>{doc.name}</a> - 
                      {doc.street}, {doc.city}<br/>
                    </span>:
                    null
                );
              })
            }
            <h3>MASTERS</h3>
            {locations.map((doc) => {
                return(
                  doc.region === "masters" ?
                    <span>
                      <a href={doc.mapUrl}>{doc.name}</a> - 
                      {doc.street}{doc.city === " " ? null : ","} {doc.city}<br/>
                    </span>:
                    null
                );
              })
            }
          </>
          <img src={map} alt="map" style={{marginTop:"2%", paddingBottom:"1%", maxHeight:"100%", maxWidth:"100%"}}/>
        </div>
      </div>
    </div>
  );
}

export default Locations;
