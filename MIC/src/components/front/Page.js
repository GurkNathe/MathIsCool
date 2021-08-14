import React from "react";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  top: {
    display: "flex",
    flexDirection:"row"
  },
  middle: {
    margin:"2%", 
    boxShadow:"0 3px 1px -2px rgb(0 0 0 / 20%), 0 2px 2px 0 rgb(0 0 0 / 14%), 0 1px 5px 0 rgb(0 0 0 / 12%)", 
    width:"100%", 
    height:"100%", 
    overflow:"auto"
  },
  inner: {
    marginLeft:"1%", 
    marginRight:"1%",
    minHeight:"80vh"
  }
}))

function Page(props) {
  const classes = useStyles();
  return(
    <div className={classes.top}>
      <div className={classes.middle}>
        <div className={classes.inner}>
          <h1 style={{fontStyle:"italic"}}>{props.title}</h1>
          <div dangerouslySetInnerHTML={{ __html: props.page}}></div>
        </div>
      </div>
    </div>
  );
}

export default Page;