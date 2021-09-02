import React, { useState, useEffect } from 'react';
import Accord from "../custom/Accord";
import getWeb from "./getWeb";
import getPage from "./getPage";
import useStyles from "../style";

export default function FAQ() {
  const classes = useStyles();
  const [faq, setFAQ] = useState("");

  const title = "faq";

  var test = [{},
              {},
              {},
              {}];

  const cats = ["General", "Registration", "Contest Time", "Masters"];

  useEffect(() => {
    getWeb(title);
    setFAQ(getPage(title, "records"))
  }, [])

  console.log(faq)

  //Used for sorting the questions
  for(const i in faq){
    if(faq[i].answer !== undefined){
      if(faq[i].order < 200){
        test[0] = {
          ...test[0],
          [i]: faq[i]
        }
      } else if(faq[i].order < 300){
        test[1] = {
          ...test[1],
          [i]: faq[i]
        }
      } else if(faq[i].order < 400){
        test[2] = {
          ...test[2],
          [i]: faq[i]
        }
      } else if(faq[i].order < 500){
        test[3] = {
          ...test[3],
          [i]: faq[i]
        }
      }
    }
  }

  console.log(test)

  return (
    <div className={classes.root}>
      <div className={classes.second}>
        <div className={classes.inner}>
          <h1 style={{fontStyle:"italic"}}>FAQ</h1>
          {
            test.map((group, index) => {
              var g = [];
              for(const i in group){
                g.push(group[i])
              }
              console.log(g)
              return(
                <div key={index}>
                  <p><b>{cats[index]}</b></p>
                  {
                    g.map((quest, ind) => {
                      return(
                        <Accord key={ind} title={quest.question} content={quest.answer}/>
                      )
                    })
                  }
                </div>
              )
            })
          }
        </div>
      </div>
    </div>
  );
}
