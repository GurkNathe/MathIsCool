import React, { useState, useEffect } from 'react';
import Accord from "../custom/Accord";
import getWeb from "./getWeb";
import getPage from "./getPage";
import useStyles from "../style";

export default function FAQ() {
  const classes = useStyles();
  const title = "faq";
  const [faq, setFAQ] = useState(getPage(title, "records"));

  var test = [];
  var cats = [];

  useEffect(() => {
    getWeb(title).then((result) => {
      result !== undefined ? setFAQ(result.records) : setFAQ(faq);
    })
  }, [])

  //Used for sorting the questions
  for(const i in faq){
    if(faq[i].answer !== undefined && faq[i].answer !== null){
      const digit = Math.floor((Number(i)+100)/100) - 2;
      test[digit] = {
        ...test[digit],
        [i]: faq[i]
      }
    } else {
      cats.push(faq[i].question)
    }
  }

  return (
    <div className={classes.root}>
      <div className={classes.second}>
        <div className={classes.inner}>
          <h1 style={{fontStyle:"italic"}}>FAQ</h1>
          {
            test.map((group, index) => {
              return(
                <div key={index}>
                  <p><b>{cats[index]}</b></p>
                  {
                    Object.values(group).map((quest, ind) => {
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
