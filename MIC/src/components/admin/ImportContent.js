import React, { useState } from "react";
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import fire from "../fire";

export default function ImportContent(){
 
  const useStyles = makeStyles({
    base:{
      margin: '10px'
    },
  });
  
  const [table, setTable] = useState({ string: "", name: "new"});
  const [page, setPage] = useState({string: "", name: "new"});
  
  const classes = useStyles();

  const makeTable = (str) => {
    let lines = str.split('\n');
    let fields = lines[0].split('\t');
    let records = [];
    for(let i = 1; i < lines.length; i++){
      let line = lines[i].split('\t');
      let record = {};
      for(let j = 0; j < line.length; j++){
        let val = line[j];
        if(val.length === 0)
          val = null;
        else if(val.toLowerCase() === "false")
          val = false;
        else if(val.toLowerCase() === "true")
          val = true;
        else if(!isNaN(val))
          val = Number(val) 
        else
          val = val.replace(/~/g, '\n')
        
        record[fields[j]] = val;
      }
      records.push(record);
    }
    return records;
  }
 
  const saveTable = () => {
    if(table.string.length > 0){
      let records = makeTable(table.string);
      fire.firestore().collection("web").doc(table.name)
          .set({n: records.length, timestamp: (new Date().toString().slice(4,24)), records: records})
        .then(() => {
          setTable({string: "", name: table.name})
          alert('Wrote ' + records.length + ' records');
        })  
        .catch((error) => {
          console.error("Error writing document: ", error);
        });
    } 
  }
  
  const savePage = () => {
    if(page.string.length > 0){
      fire.firestore().collection("web").doc(page.name)
        .set({page: page.string.replace(/~/g, '\n'), timestamp: (new Date().toString().slice(4,24))})
        .then(() => {
          setPage({string: "", name: page.name});
          
          alert('Wrote Page: ' + page.name);
        })  
        .catch((error) => {
          console.error("Error writing document: ", error);
        });
    } 
  }
  
  return(
    <div className={classes.base}> 
      
      <h1>Import Table Content</h1>

      <textarea 
        onChange={(ev) => setTable({string: ev.target.value, name: table.name})}
        value={table.string}
        cols={120}
        rows={15}
        autoFocus={true}
      />

      <p>
        <span onChange={(ev) => setTable({string: table.string, name: ev.target.value})}>
         <input type="radio" value="faq" name="table"/> FAQ &emsp;
         <input type="radio" value="news" name="table"/> News &emsp;
         <input type="radio" value="sites" name="table"/> Sites &emsp;
         <input type="radio" value="samples" name="table"/> Samples &emsp;
         <input type="radio" value="competitions" name="table"/> Competitions &emsp;
         <input type="radio" value="schools" name="table"/> Schools &emsp;
        </span>
        <Button variant="outlined" color="primary" size="medium" onClick={saveTable}>
          Import Table
        </Button>
      </p>
      
      <hr></hr>

      <h1>Import Page Content</h1>

      <textarea 
        onChange={(ev) => setPage({string: ev.target.value, name: page.name})}
        value={page.string}
        cols={120}
        rows={15}
      />
 
      <p>
        <span onChange={(ev) => setPage({string: page.string, name: ev.target.value})}>
         <input type="radio" value="rules" name="page"/> Rules &emsp;
         <input type="radio" value="history" name="page"/> History &emsp;
         <input type="radio" value="whotocall" name="page"/> WhoToCall &emsp;
         <input type="radio" value="fees" name="page"/> Fees &emsp;
        </span>
        <Button variant="outlined" color="primary" size="medium" onClick={savePage}>
          Import Page
        </Button>
      </p>
    </div>
 );
}
