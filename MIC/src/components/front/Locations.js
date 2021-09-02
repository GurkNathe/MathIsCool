import React, { useState, useEffect } from "react";

import { map } from "../assets.js";
import getPage from "./getPage";
import getWeb from "./getWeb";
import useStyles from "../style";

function Locations() {
  const classes = useStyles();
  const [loc, setLoc] = useState("");
  
  //holding names of sites
  var locations = [];

  const title = "sites";

  useEffect(() => {
    getWeb(title);
    setLoc(getPage(title, "records"))
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
    <div className={classes.root}>
      <div className={classes.second}>
        <div className={classes.inner}>
          <h1 className={classes.header}>Locations</h1>
          <>
            <h3>WEST</h3>
            {locations.map((doc) => {
                return(
                  doc.region === "west" ?
                    <span key={doc.name}>
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
                    <span key={doc.name}>
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
                    <span key={doc.name}>
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
                    <span key={doc.name}>
                      <a href={doc.mapUrl}>{doc.name}</a> - 
                      {doc.street}{doc.city === " " ? null : ","} {doc.city}<br/>
                    </span>:
                    null
                );
              })
            }
          </>
          <img src={map} alt="map" className={classes.map}/>
        </div>
      </div>
    </div>
  );
}

export default Locations;
